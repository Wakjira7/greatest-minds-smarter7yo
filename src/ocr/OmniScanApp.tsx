import * as Clipboard from 'expo-clipboard';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { LinearGradient } from 'expo-linear-gradient';
import * as Sharing from 'expo-sharing';
import { StatusBar } from 'expo-status-bar';
import {
  Camera,
  Check,
  ChevronLeft,
  CirclePlay,
  Copy,
  Crown,
  FileDown,
  FileText,
  Images,
  Infinity as InfinityIcon,
  Lock,
  Pencil,
  ScanText,
  Search,
  Settings,
  Share2,
  ShieldCheck,
  Trash2,
  WifiOff,
  X,
  Zap,
} from 'lucide-react-native';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  FlatList,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Engine from '../../modules/omniscan-engine';
import { AD_UNITS, initAds, openPrivacyOptions, showRewarded } from './ads';
import { buy, checkOwnedPro, loadPlans, onPurchases, Plans } from './billing';
import {
  buildMeta,
  deleteDoc,
  DocBody,
  DocMeta,
  docPath,
  FREE_PAGES_PER_DAY,
  loadIndex,
  loadWallet,
  NO_FILL_GIFTS_PER_DAY,
  PAGES_PER_VIDEO,
  pagesLeft,
  readDoc,
  renameDoc,
  rollDay,
  saveDoc,
  saveWallet,
  spendPage,
  Wallet,
} from './storage';
import { Palette, usePalette } from './theme';

const PRIVACY_URL = 'https://telegra.ph/Privacy-Policy-Copyright--Terms---OmniScan-Offline-PDF-OCR-Pro-10-20';
const PDF_DPI = 200;
const IMAGE_MAX_SIDE = 4096;

type Kind = DocMeta['kind'];
interface Source {
  kind: Kind;
  title: string;
  uris: string[];
}
interface Job {
  title: string;
  done: number;
  total: number;
  startedAt: number;
}
type SheetMode = null | 'upgrade' | 'out' | 'settings' | 'export' | 'rename' | 'legal';

// ===================================================================== helpers

const fmtDate = (t: number) =>
  new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });

const safeName = (s: string) => s.replace(/[^\w\- ]+/g, '').trim().slice(0, 60) || 'OmniScan';

const titleFromName = (name: string) => name.replace(/\.[a-z0-9]{2,5}$/i, '').replace(/[_]+/g, ' ').trim();

const defaultTitle = (kind: Kind) =>
  `${kind === 'pdf' ? 'PDF' : kind === 'camera' ? 'Scan' : 'Photo'} ${new Date().toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
  })} ${new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}`;

const wordCount = (s: string) => (s.trim() ? s.trim().split(/\s+/).length : 0);

// ===================================================================== root

export function OmniScanApp() {
  const c = usePalette();
  const insets = useSafeAreaInsets();
  const s = useMemo(() => makeStyles(c), [c]);

  const [wallet, setWallet] = useState<Wallet | null>(null);
  const walletRef = useRef<Wallet | null>(null);
  const [docs, setDocs] = useState<DocMeta[]>([]);
  const [query, setQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [openBody, setOpenBody] = useState<DocBody | null>(null);
  const [job, setJob] = useState<Job | null>(null);
  const cancelRef = useRef(false);
  const [sheet, setSheet] = useState<SheetMode>(null);
  const pagesWaiter = useRef<((ok: boolean) => void) | null>(null);
  const [plans, setPlans] = useState<Plans>({ storeReady: false });
  const [adsReady, setAdsReady] = useState(false);
  const [busyReward, setBusyReward] = useState(false);
  const [busyExport, setBusyExport] = useState<string | null>(null);
  const [renameText, setRenameText] = useState('');

  // ------------------------------------------------------------ wallet
  const commitWallet = useCallback((w: Wallet) => {
    walletRef.current = w;
    setWallet(w);
    saveWallet(w).catch(() => {});
  }, []);

  const setPro = useCallback(
    (owned: string | null | undefined) => {
      const w = walletRef.current;
      if (!w || owned === undefined) return; // store unreachable: keep cached status (works offline)
      const pro = owned !== null;
      if (w.pro !== pro || w.proProduct !== (owned ?? undefined)) {
        commitWallet({ ...w, pro, proProduct: owned ?? undefined });
      }
    },
    [commitWallet]
  );

  useEffect(() => {
    (async () => {
      const [w, list] = await Promise.all([loadWallet(), loadIndex()]);
      walletRef.current = w;
      setWallet(w);
      setDocs(list);
      setPro(await checkOwnedPro());
      setPlans(await loadPlans());
    })();
    initAds().then(setAdsReady);
    const sub = onPurchases((owned, code) => {
      if (owned) {
        setPro(owned);
        resolvePages(true);
        setSheet(null);
        Alert.alert('Welcome to Pro', 'Unlimited pages unlocked. Thank you for supporting OmniScan!');
      } else if (code !== 0 && code !== 1) {
        // 1 = user cancelled
        Alert.alert('Purchase not completed', 'Google Play could not finish the purchase. Please try again.');
      }
    });
    const app = AppState.addEventListener('change', (st) => {
      if (st === 'active' && walletRef.current) {
        const rolled = rollDay(walletRef.current);
        if (rolled !== walletRef.current) commitWallet(rolled);
      }
    });
    return () => {
      sub.remove();
      app.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isPro = !!wallet?.pro;
  const left = wallet ? pagesLeft(wallet) : 0;

  // ------------------------------------------------------------ pages (rewarded / paywall)
  const resolvePages = (ok: boolean) => {
    const r = pagesWaiter.current;
    pagesWaiter.current = null;
    r?.(ok);
  };

  const closeSheet = () => {
    setSheet(null);
    resolvePages(false);
  };

  /** Pauses a running scan and asks the user for more pages. Resolves true when credits were added. */
  const askForPages = () =>
    new Promise<boolean>((resolve) => {
      pagesWaiter.current = resolve;
      setSheet('out');
    });

  const grantBonus = (n: number, gift = false) => {
    const w = rollDay(walletRef.current!);
    commitWallet({
      ...w,
      bonusPages: w.bonusPages + n,
      noFillGiftsToday: gift ? w.noFillGiftsToday + 1 : w.noFillGiftsToday,
    });
  };

  const watchVideo = async () => {
    if (busyReward) return;
    setBusyReward(true);
    const outcome = await showRewarded();
    setBusyReward(false);
    if (outcome === 'earned') {
      grantBonus(PAGES_PER_VIDEO);
      setSheet(null);
      resolvePages(true);
    } else if (outcome === 'unavailable') {
      const w = rollDay(walletRef.current!);
      if (w.noFillGiftsToday < NO_FILL_GIFTS_PER_DAY) {
        grantBonus(PAGES_PER_VIDEO, true);
        setSheet(null);
        resolvePages(true);
        Alert.alert('Pages added', `No video was available right now, so here are ${PAGES_PER_VIDEO} free pages on us.`);
      } else {
        Alert.alert('No video right now', 'Please try again in a minute, or go Pro for unlimited pages.');
      }
    }
  };

  const purchase = async (which: 'monthly' | 'lifetime') => {
    const plan = which === 'monthly' ? plans.monthly : plans.lifetime;
    if (!plan) {
      const fresh = await loadPlans();
      setPlans(fresh);
      const p2 = which === 'monthly' ? fresh.monthly : fresh.lifetime;
      if (!p2) {
        Alert.alert('Store unavailable', 'Google Play is not reachable right now. Check your connection and try again.');
        return;
      }
      await buy(p2);
      return;
    }
    await buy(plan);
  };

  const restore = async () => {
    const owned = await checkOwnedPro();
    if (owned === undefined) Alert.alert('Store unavailable', 'Connect to the internet and try again.');
    else if (owned) {
      setPro(owned);
      Alert.alert('Restored', 'Your Pro access is active.');
    } else Alert.alert('Nothing to restore', 'No Pro purchase was found for this Google account.');
  };

  // ------------------------------------------------------------ scanning pipeline
  const runJob = async (src: Source) => {
    if (!walletRef.current) return;
    if (pagesLeft(rollDay(walletRef.current)) <= 0) {
      const ok = await askForPages();
      if (!ok) return;
    }
    cancelRef.current = false;
    const id = `${Date.now()}`;
    const createdAt = Date.now();
    const body: DocBody = { title: src.title, pages: [] };
    let handle: number | null = null;
    let total = src.uris.length;
    let failed: string | null = null;

    setJob({ title: src.title, done: 0, total, startedAt: Date.now() });
    activateKeepAwakeAsync('omniscan-job').catch(() => {});
    try {
      if (src.kind === 'pdf') {
        const r = await Engine.openPdf(src.uris[0]);
        handle = r.handle;
        total = r.pageCount;
        setJob({ title: src.title, done: 0, total, startedAt: Date.now() });
      }
      for (let i = 0; i < total; i++) {
        if (cancelRef.current) break;
        let next = spendPage(rollDay(walletRef.current!));
        if (!next) {
          const ok = await askForPages();
          if (!ok || cancelRef.current) break;
          next = spendPage(rollDay(walletRef.current!));
          if (!next) break;
        }
        try {
          const r =
            handle !== null
              ? await Engine.ocrPdfPage(handle, i, PDF_DPI, 'latin')
              : await Engine.ocrImage(src.uris[i], IMAGE_MAX_SIDE, 'latin');
          commitWallet(next); // charge only for pages that were actually read
          body.pages.push({ w: r.width, h: r.height, text: r.text, lines: r.lines });
        } catch (e: any) {
          if (handle !== null) throw e;
          body.pages.push({ w: 1, h: 1, text: '', lines: [] }); // unreadable photo: keep page order
        }
        setJob((j) => (j ? { ...j, done: i + 1 } : j));
        if (body.pages.length % 10 === 0) {
          await saveDoc(buildMeta(id, src.kind, body, total, createdAt), body); // crash-safe checkpoint
        }
      }
    } catch (e: any) {
      failed = e?.message || 'Could not read this file.';
    } finally {
      if (handle !== null) Engine.closePdf(handle).catch(() => {});
      deactivateKeepAwake('omniscan-job');
    }

    setJob(null);
    if (body.pages.length > 0) {
      const list = await saveDoc(buildMeta(id, src.kind, body, total, createdAt), body);
      setDocs(list);
      setOpenBody(body);
      setOpenId(id);
    }
    if (failed) Alert.alert('Could not finish', failed);
  };

  const scanCamera = async () => {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert('Camera needed', 'Allow camera access to scan documents.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Open settings', onPress: () => Linking.openSettings() },
      ]);
      return;
    }
    const r = await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 1, exif: false });
    if (r.canceled || !r.assets?.length) return;
    runJob({ kind: 'camera', title: defaultTitle('camera'), uris: [r.assets[0].uri] });
  };

  const scanPhotos = async () => {
    const r = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 30,
      quality: 1,
    });
    if (r.canceled || !r.assets?.length) return;
    const first = r.assets[0].fileName;
    runJob({
      kind: 'photo',
      title: r.assets.length === 1 && first ? titleFromName(first) : defaultTitle('photo'),
      uris: r.assets.map((a) => a.uri),
    });
  };

  const scanFile = async () => {
    const r = await DocumentPicker.getDocumentAsync({
      type: ['application/pdf', 'image/*'],
      copyToCacheDirectory: false, // read huge files in place (no 1 GB copy)
      multiple: false,
    });
    if (r.canceled || !r.assets?.length) return;
    const a = r.assets[0];
    const isPdf = (a.mimeType || '').includes('pdf') || a.name.toLowerCase().endsWith('.pdf');
    runJob({ kind: isPdf ? 'pdf' : 'photo', title: titleFromName(a.name) || defaultTitle('pdf'), uris: [a.uri] });
  };

  // ------------------------------------------------------------ documents
  const openDoc = async (id: string) => {
    const body = await readDoc(id);
    if (!body) {
      Alert.alert('Not found', 'This scan could not be opened.');
      return;
    }
    setOpenBody(body);
    setOpenId(id);
  };

  const closeDoc = () => {
    setOpenId(null);
    setOpenBody(null);
  };

  const openMeta = docs.find((d) => d.id === openId) || null;
  const fullText = useMemo(() => (openBody ? openBody.pages.map((p) => p.text).join('\n\n') : ''), [openBody]);

  const copyAll = async () => {
    await Clipboard.setStringAsync(fullText);
    Alert.alert('Copied', 'All text copied to the clipboard.');
  };

  const shareText = () => {
    Share.share({ message: fullText.length > 90000 ? fullText.slice(0, 90000) : fullText, title: openBody?.title }).catch(
      () => {}
    );
  };

  const exportAs = async (fmt: 'pdf' | 'docx' | 'txt') => {
    if (!openId || !openBody) return;
    setBusyExport(fmt);
    try {
      const out = `${FileSystem.cacheDirectory}${safeName(openBody.title)}.${fmt}`;
      if (fmt === 'txt') await FileSystem.writeAsStringAsync(out, fullText);
      else if (fmt === 'pdf') await Engine.exportPdf(docPath(openId), out);
      else await Engine.exportDocx(docPath(openId), out);
      const mime =
        fmt === 'pdf'
          ? 'application/pdf'
          : fmt === 'docx'
          ? 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
          : 'text/plain';
      setSheet(null);
      await Sharing.shareAsync(out, { mimeType: mime, dialogTitle: `Save or share ${fmt.toUpperCase()}` });
    } catch (e: any) {
      Alert.alert('Export failed', e?.message || 'Please try again.');
    } finally {
      setBusyExport(null);
    }
  };

  const removeDoc = () => {
    if (!openId) return;
    Alert.alert('Delete scan?', 'This removes the text from this phone.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setDocs(await deleteDoc(openId));
          closeDoc();
        },
      },
    ]);
  };

  const saveRename = async () => {
    const t = renameText.trim();
    if (!openId || !t) return setSheet(null);
    setDocs(await renameDoc(openId, t));
    setOpenBody((b) => (b ? { ...b, title: t } : b));
    setSheet(null);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? docs.filter((d) => d.search.includes(q)) : docs;
  }, [docs, query]);

  // ------------------------------------------------------------ render
  if (!wallet) {
    return (
      <View style={[s.fill, s.center, { backgroundColor: c.bg }]}>
        <ActivityIndicator color={c.primary} />
      </View>
    );
  }

  const banner =
    !isPro && adsReady ? (
      <View style={s.bannerWrap}>
        <BannerAd unitId={AD_UNITS.banner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
      </View>
    ) : null;

  return (
    <View style={[s.fill, { backgroundColor: c.bg }]}>
      <StatusBar style={c.dark ? 'light' : 'dark'} />

      {openId && openBody ? (
        // ======================================================== DOCUMENT
        <View style={[s.fill, { paddingTop: insets.top }]}>
          <View style={s.docHeader}>
            <Pressable onPress={closeDoc} hitSlop={12} style={s.iconBtn}>
              <ChevronLeft color={c.text} size={24} />
            </Pressable>
            <Pressable
              style={{ flex: 1 }}
              onPress={() => {
                setRenameText(openBody.title);
                setSheet('rename');
              }}
            >
              <Text style={s.docTitle} numberOfLines={1}>
                {openBody.title}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={s.docSub}>
                  {openBody.pages.length} {openBody.pages.length === 1 ? 'page' : 'pages'} · {wordCount(fullText)} words
                </Text>
                <Pencil color={c.textFaint} size={11} />
              </View>
            </Pressable>
          </View>

          {openMeta && openMeta.pages < openMeta.totalPages ? (
            <View style={s.notice}>
              <Text style={s.noticeText}>
                Scanned {openMeta.pages} of {openMeta.totalPages} pages. Get more pages and scan the file again to read the
                rest.
              </Text>
            </View>
          ) : null}

          <FlatList
            data={openBody.pages}
            keyExtractor={(_, i) => String(i)}
            contentContainerStyle={{ padding: 16, paddingBottom: 24 }}
            initialNumToRender={3}
            windowSize={5}
            renderItem={({ item, index }) => (
              <View style={s.pageCard}>
                {openBody.pages.length > 1 ? <Text style={s.pageLabel}>Page {index + 1}</Text> : null}
                {item.text ? (
                  <Text selectable style={s.pageText}>
                    {item.text}
                  </Text>
                ) : (
                  <Text style={[s.pageText, { color: c.textFaint, fontStyle: 'italic' }]}>
                    No text found on this page. Try a sharper, well-lit photo.
                  </Text>
                )}
              </View>
            )}
          />

          <View style={[s.actionBar, { paddingBottom: banner ? 8 : Math.max(insets.bottom, 10) }]}>
            <ActionButton c={c} icon={<Copy color={c.text} size={20} />} label="Copy" onPress={copyAll} />
            <ActionButton c={c} icon={<Share2 color={c.text} size={20} />} label="Share" onPress={shareText} />
            <ActionButton
              c={c}
              primary
              icon={<FileDown color={c.onPrimary} size={20} />}
              label="Export"
              onPress={() => setSheet('export')}
            />
            <ActionButton c={c} icon={<Trash2 color={c.danger} size={20} />} label="Delete" onPress={removeDoc} />
          </View>
          {banner ? <View style={{ paddingBottom: insets.bottom }}>{banner}</View> : null}
        </View>
      ) : (
        // ======================================================== HOME
        <View style={[s.fill, { paddingTop: insets.top }]}>
          <View style={s.topBar}>
            <LinearGradient colors={[c.heroFrom, c.heroTo]} style={s.logo} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <ScanText color="#fff" size={18} />
            </LinearGradient>
            <Text style={s.brand}>OmniScan</Text>
            <View style={{ flex: 1 }} />
            <Pressable onPress={() => setSheet(isPro ? 'settings' : 'upgrade')} style={[s.pill, isPro && s.pillPro]}>
              {isPro ? (
                <>
                  <Crown color={c.gold} size={14} />
                  <Text style={[s.pillText, { color: c.gold }]}>Pro</Text>
                </>
              ) : (
                <>
                  <Zap color={c.primary} size={14} />
                  <Text style={s.pillText}>
                    {left} {left === 1 ? 'page' : 'pages'} left
                  </Text>
                </>
              )}
            </Pressable>
            <Pressable onPress={() => setSheet('settings')} hitSlop={10} style={s.iconBtn}>
              <Settings color={c.textDim} size={20} />
            </Pressable>
          </View>

          <FlatList
            data={filtered}
            keyExtractor={(d) => d.id}
            contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
            keyboardShouldPersistTaps="handled"
            ListHeaderComponent={
              <View>
                <LinearGradient
                  colors={[c.heroFrom, c.heroTo]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={s.hero}
                >
                  <Text style={s.heroTitle}>Turn any page into text</Text>
                  <View style={s.heroRow}>
                    <WifiOff color="rgba(255,255,255,0.85)" size={13} />
                    <Text style={s.heroSub}>Works offline · Private · On your phone</Text>
                  </View>
                  <View style={s.tiles}>
                    <ScanTile s={s} icon={<Camera color="#fff" size={26} />} label="Camera" onPress={scanCamera} />
                    <ScanTile s={s} icon={<Images color="#fff" size={26} />} label="Photos" onPress={scanPhotos} />
                    <ScanTile s={s} icon={<FileText color="#fff" size={26} />} label="PDF" onPress={scanFile} />
                  </View>
                </LinearGradient>

                {!isPro ? (
                  <View style={s.freeRow}>
                    <Text style={s.freeText}>
                      Free: {FREE_PAGES_PER_DAY} page every day · +{PAGES_PER_VIDEO} pages per video
                    </Text>
                    <Pressable onPress={watchVideo} disabled={busyReward} style={s.freeBtn}>
                      {busyReward ? (
                        <ActivityIndicator size="small" color={c.primary} />
                      ) : (
                        <>
                          <CirclePlay color={c.primary} size={15} />
                          <Text style={s.freeBtnText}>Get pages</Text>
                        </>
                      )}
                    </Pressable>
                  </View>
                ) : null}

                <View style={s.sectionRow}>
                  <Text style={s.section}>Your scans</Text>
                  {docs.length ? <Text style={s.count}>{docs.length}</Text> : null}
                </View>

                {docs.length >= 4 ? (
                  <View style={s.searchBox}>
                    <Search color={c.textFaint} size={18} />
                    <TextInput
                      value={query}
                      onChangeText={setQuery}
                      placeholder="Search your scans"
                      placeholderTextColor={c.textFaint}
                      style={s.searchInput}
                      returnKeyType="search"
                    />
                    {query ? (
                      <Pressable onPress={() => setQuery('')} hitSlop={10}>
                        <X color={c.textFaint} size={18} />
                      </Pressable>
                    ) : null}
                  </View>
                ) : null}
              </View>
            }
            ListEmptyComponent={
              docs.length === 0 ? (
                <View style={s.empty}>
                  <View style={s.emptyIcon}>
                    <ScanText color={c.primary} size={34} />
                  </View>
                  <Text style={s.emptyTitle}>No scans yet</Text>
                  <Text style={s.emptyText}>Tap Camera, Photos or PDF above. Your text stays on this phone.</Text>
                </View>
              ) : (
                <Text style={[s.emptyText, { marginTop: 24 }]}>No scans match “{query}”.</Text>
              )
            }
            renderItem={({ item }) => <DocCard s={s} c={c} d={item} onPress={() => openDoc(item.id)} />}
          />
          {banner ? <View style={{ paddingBottom: insets.bottom }}>{banner}</View> : null}
        </View>
      )}

      {/* ============================================================ PROGRESS */}
      <Modal visible={!!job} transparent animationType="fade" statusBarTranslucent onRequestClose={() => {}}>
        <View style={s.overlay}>
          <View style={s.progressCard}>
            <LinearGradient colors={[c.heroFrom, c.heroTo]} style={s.progressIcon}>
              <ScanText color="#fff" size={26} />
            </LinearGradient>
            <Text style={s.progressTitle} numberOfLines={1}>
              {job?.title}
            </Text>
            <Text style={s.progressSub}>
              {job && job.total > 0
                ? job.done < job.total
                  ? `Reading page ${job.done + 1} of ${job.total}`
                  : 'Finishing…'
                : 'Opening file…'}
            </Text>
            <View style={s.bar}>
              <View
                style={[s.barFill, { width: `${job && job.total ? Math.max(4, (job.done / job.total) * 100) : 4}%` }]}
              />
            </View>
            {job && job.done > 0 ? (
              <Text style={s.progressHint}>
                {((Date.now() - job.startedAt) / 1000 / job.done).toFixed(1)} s per page · 100% on-device
              </Text>
            ) : (
              <Text style={s.progressHint}>100% on-device · nothing is uploaded</Text>
            )}
            <Pressable
              onPress={() => {
                cancelRef.current = true;
              }}
              style={s.stopBtn}
            >
              <Text style={s.stopText}>{job && job.done > 0 ? 'Stop & keep scanned pages' : 'Cancel'}</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ============================================================ SHEETS */}
      <Modal
        visible={sheet !== null}
        transparent
        animationType="slide"
        statusBarTranslucent
        onRequestClose={closeSheet}
      >
        <Pressable style={s.scrim} onPress={closeSheet} />
        <View style={[s.sheet, { paddingBottom: Math.max(insets.bottom, 16) + 8 }]}>
          <View style={s.grabber} />

          {(sheet === 'upgrade' || sheet === 'out') && (
            <Paywall
              s={s}
              c={c}
              out={sheet === 'out'}
              plans={plans}
              busyReward={busyReward}
              onVideo={watchVideo}
              onBuy={purchase}
              onRestore={restore}
              onClose={closeSheet}
            />
          )}

          {sheet === 'export' && (
            <View>
              <Text style={s.sheetTitle}>Export</Text>
              <Text style={s.sheetSub}>Save to Files, Drive, email or any app.</Text>
              <ExportRow
                s={s}
                c={c}
                title="PDF"
                sub="Searchable, selectable text"
                busy={busyExport === 'pdf'}
                onPress={() => exportAs('pdf')}
              />
              <ExportRow
                s={s}
                c={c}
                title="Word (.docx)"
                sub="Edit in Word or Google Docs"
                busy={busyExport === 'docx'}
                onPress={() => exportAs('docx')}
              />
              <ExportRow
                s={s}
                c={c}
                title="Text (.txt)"
                sub="Plain text, works everywhere"
                busy={busyExport === 'txt'}
                onPress={() => exportAs('txt')}
              />
            </View>
          )}

          {sheet === 'rename' && (
            <View>
              <Text style={s.sheetTitle}>Rename</Text>
              <TextInput
                value={renameText}
                onChangeText={setRenameText}
                autoFocus
                selectTextOnFocus
                style={s.renameInput}
                onSubmitEditing={saveRename}
                returnKeyType="done"
              />
              <PrimaryButton s={s} c={c} label="Save" onPress={saveRename} />
            </View>
          )}

          {sheet === 'settings' && (
            <View>
              <Text style={s.sheetTitle}>Settings</Text>
              {isPro ? (
                <View style={s.proCard}>
                  <Crown color={c.gold} size={18} />
                  <Text style={s.proCardText}>
                    {wallet.proProduct === 'omniscan_pro_lifetime' ? 'Pro · Lifetime' : 'Pro · Monthly'} — unlimited pages,
                    no ads
                  </Text>
                </View>
              ) : (
                <SettingRow s={s} c={c} label="Go Pro — unlimited pages" onPress={() => setSheet('upgrade')} />
              )}
              <SettingRow s={s} c={c} label="Restore purchase" onPress={restore} />
              {!isPro ? <SettingRow s={s} c={c} label="Ad privacy choices" onPress={openPrivacyOptions} /> : null}
              {wallet.proProduct === 'omniscan_pro_monthly' ? (
                <SettingRow
                  s={s}
                  c={c}
                  label="Manage subscription"
                  onPress={() =>
                    Linking.openURL(
                      'https://play.google.com/store/account/subscriptions?package=com.wakjira.offlineocr&sku=omniscan_pro_monthly'
                    )
                  }
                />
              ) : null}
              <SettingRow s={s} c={c} label="Privacy policy" onPress={() => Linking.openURL(PRIVACY_URL)} />
              <SettingRow s={s} c={c} label="Copyright & open-source licenses" onPress={() => setSheet('legal')} />
              <Text style={s.footnote}>
                {wallet.totalPages} pages scanned on this phone · OmniScan 1.0.2{'\n'}© 2026 Wakjira Shewangzaw Dabi
              </Text>
            </View>
          )}

          {sheet === 'legal' && (
            <ScrollView style={{ maxHeight: 460 }}>
              <Text style={s.sheetTitle}>Copyright & licenses</Text>
              <Text style={s.legal}>
                © 2026 Wakjira Shewangzaw Dabi. All rights reserved.{'\n\n'}
                All text recognition runs on your device. Your documents and photos are never uploaded. You are responsible
                for having the right to scan the documents you process.{'\n\n'}
                Open-source components: Google ML Kit Text Recognition (Google APIs Terms), React Native and Expo (MIT),
                AndroidX (Apache 2.0), Lucide icons (ISC), Google Mobile Ads SDK (Google terms), Google Play Billing Library
                (Google terms).
              </Text>
            </ScrollView>
          )}
        </View>
      </Modal>
    </View>
  );
}

// ===================================================================== pieces

function ScanTile({ s, icon, label, onPress }: { s: Styles; icon: React.ReactNode; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.tile, pressed && { opacity: 0.75, transform: [{ scale: 0.97 }] }]}>
      {icon}
      <Text style={s.tileText}>{label}</Text>
    </Pressable>
  );
}

function DocCard({ s, c, d, onPress }: { s: Styles; c: Palette; d: DocMeta; onPress: () => void }) {
  const Icon = d.kind === 'pdf' ? FileText : d.kind === 'camera' ? Camera : Images;
  const tint = d.kind === 'pdf' ? c.danger : d.kind === 'camera' ? c.primary : c.accent;
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.card, pressed && { opacity: 0.85 }]}>
      <View style={[s.cardIcon, { backgroundColor: tint + '1F' }]}>
        <Icon color={tint} size={22} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.cardTitle} numberOfLines={1}>
          {d.title}
        </Text>
        <Text style={s.cardMeta}>
          {d.pages} {d.pages === 1 ? 'page' : 'pages'} · {fmtDate(d.createdAt)}
        </Text>
        {d.preview ? (
          <Text style={s.cardPreview} numberOfLines={2}>
            {d.preview}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

function ActionButton({
  c,
  icon,
  label,
  onPress,
  primary,
}: {
  c: Palette;
  icon: React.ReactNode;
  label: string;
  onPress: () => void;
  primary?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: primary ? c.primary : 'transparent',
        opacity: pressed ? 0.7 : 1,
      })}
    >
      {icon}
      <Text style={{ marginTop: 4, fontSize: 12, fontWeight: '600', color: primary ? c.onPrimary : c.textDim }}>
        {label}
      </Text>
    </Pressable>
  );
}

function PrimaryButton({ s, c, label, onPress }: { s: Styles; c: Palette; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1, marginTop: 14 }]}>
      <LinearGradient colors={[c.heroFrom, c.heroTo]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={s.cta}>
        <Text style={s.ctaText}>{label}</Text>
      </LinearGradient>
    </Pressable>
  );
}

function ExportRow({
  s,
  c,
  title,
  sub,
  busy,
  onPress,
}: {
  s: Styles;
  c: Palette;
  title: string;
  sub: string;
  busy: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} disabled={busy} style={({ pressed }) => [s.exportRow, pressed && { opacity: 0.8 }]}>
      <View style={s.exportIcon}>
        <FileDown color={c.primary} size={20} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={s.exportTitle}>{title}</Text>
        <Text style={s.exportSub}>{sub}</Text>
      </View>
      {busy ? <ActivityIndicator color={c.primary} /> : null}
    </Pressable>
  );
}

function SettingRow({ s, c, label, onPress }: { s: Styles; c: Palette; label: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [s.settingRow, pressed && { backgroundColor: c.surfaceAlt }]}>
      <Text style={s.settingText}>{label}</Text>
    </Pressable>
  );
}

function Paywall({
  s,
  c,
  out,
  plans,
  busyReward,
  onVideo,
  onBuy,
  onRestore,
  onClose,
}: {
  s: Styles;
  c: Palette;
  out: boolean;
  plans: Plans;
  busyReward: boolean;
  onVideo: () => void;
  onBuy: (w: 'monthly' | 'lifetime') => void;
  onRestore: () => void;
  onClose: () => void;
}) {
  const [pick, setPick] = useState<'lifetime' | 'monthly'>('lifetime');
  const lifetimePrice = plans.lifetime?.formattedPrice || '$3.99';
  const monthlyPrice = plans.monthly?.formattedPrice || '$4.99';
  return (
    <View>
      <Pressable onPress={onClose} hitSlop={12} style={s.sheetClose}>
        <X color={c.textFaint} size={22} />
      </Pressable>
      <LinearGradient colors={[c.heroFrom, c.heroTo]} style={s.crown}>
        <Crown color="#fff" size={28} />
      </LinearGradient>
      <Text style={[s.sheetTitle, { textAlign: 'center' }]}>{out ? 'Out of pages for today' : 'OmniScan Pro'}</Text>
      <Text style={[s.sheetSub, { textAlign: 'center' }]}>
        {out ? 'Watch a short video for free pages, or go unlimited.' : 'Scan without limits.'}
      </Text>

      <View style={{ marginVertical: 10, gap: 8 }}>
        <Benefit c={c} s={s} icon={<InfinityIcon color={c.primary} size={18} />} text="Unlimited pages, any PDF size" />
        <Benefit c={c} s={s} icon={<ShieldCheck color={c.primary} size={18} />} text="No ads, ever" />
        <Benefit c={c} s={s} icon={<Lock color={c.primary} size={18} />} text="Still 100% private and offline" />
      </View>

      <PlanCard
        s={s}
        c={c}
        selected={pick === 'lifetime'}
        title="Lifetime"
        price={lifetimePrice}
        note="Pay once, yours forever"
        badge="Best value"
        onPress={() => setPick('lifetime')}
      />
      <PlanCard
        s={s}
        c={c}
        selected={pick === 'monthly'}
        title="Monthly"
        price={`${monthlyPrice}/mo`}
        note="Cancel anytime"
        onPress={() => setPick('monthly')}
      />

      <PrimaryButton s={s} c={c} label="Continue" onPress={() => onBuy(pick)} />

      <Pressable onPress={onVideo} disabled={busyReward} style={({ pressed }) => [s.videoBtn, pressed && { opacity: 0.8 }]}>
        {busyReward ? (
          <ActivityIndicator color={c.primary} />
        ) : (
          <>
            <CirclePlay color={c.primary} size={18} />
            <Text style={s.videoText}>Watch a video · +{PAGES_PER_VIDEO} free pages</Text>
          </>
        )}
      </Pressable>

      <Pressable onPress={onRestore} hitSlop={8}>
        <Text style={s.restore}>Restore purchase</Text>
      </Pressable>
      <Text style={s.fine}>Monthly renews automatically until cancelled in Google Play. Payment by Google Play.</Text>
    </View>
  );
}

function Benefit({ s, c, icon, text }: { s: Styles; c: Palette; icon: React.ReactNode; text: string }) {
  return (
    <View style={s.benefit}>
      <View style={[s.benefitIcon, { backgroundColor: c.primarySoft }]}>{icon}</View>
      <Text style={s.benefitText}>{text}</Text>
    </View>
  );
}

function PlanCard({
  s,
  c,
  selected,
  title,
  price,
  note,
  badge,
  onPress,
}: {
  s: Styles;
  c: Palette;
  selected: boolean;
  title: string;
  price: string;
  note: string;
  badge?: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[s.plan, selected && { borderColor: c.primary, backgroundColor: c.primarySoft }]}
    >
      <View style={[s.radio, selected && { borderColor: c.primary, backgroundColor: c.primary }]}>
        {selected ? <Check color="#fff" size={13} /> : null}
      </View>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <Text style={s.planTitle}>{title}</Text>
          {badge ? (
            <View style={s.badge}>
              <Text style={s.badgeText}>{badge}</Text>
            </View>
          ) : null}
        </View>
        <Text style={s.planNote}>{note}</Text>
      </View>
      <Text style={s.planPrice}>{price}</Text>
    </Pressable>
  );
}

// ===================================================================== styles

type Styles = ReturnType<typeof makeStyles>;

function makeStyles(c: Palette) {
  return StyleSheet.create({
    fill: { flex: 1 },
    center: { alignItems: 'center', justifyContent: 'center' },

    topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 10, gap: 10 },
    logo: { width: 34, height: 34, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    brand: { fontSize: 21, fontWeight: '800', color: c.text, letterSpacing: -0.4 },
    pill: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 11,
      paddingVertical: 7,
      borderRadius: 999,
      backgroundColor: c.primarySoft,
    },
    pillPro: { backgroundColor: c.gold + '22' },
    pillText: { fontSize: 13, fontWeight: '700', color: c.primary },
    iconBtn: { padding: 6 },

    hero: { borderRadius: 24, padding: 20, marginTop: 6 },
    heroTitle: { color: '#fff', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 },
    heroRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
    heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 13, fontWeight: '500' },
    tiles: { flexDirection: 'row', gap: 10, marginTop: 18 },
    tile: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 18,
      borderRadius: 18,
      backgroundColor: 'rgba(255,255,255,0.16)',
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.22)',
      gap: 8,
    },
    tileText: { color: '#fff', fontSize: 14, fontWeight: '700' },

    freeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 12,
      padding: 12,
      borderRadius: 16,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      gap: 10,
    },
    freeText: { flex: 1, fontSize: 12.5, color: c.textDim, fontWeight: '500' },
    freeBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 5,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: c.primarySoft,
      minWidth: 96,
      justifyContent: 'center',
    },
    freeBtnText: { fontSize: 13, fontWeight: '700', color: c.primary },

    sectionRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 22, marginBottom: 10 },
    section: { fontSize: 18, fontWeight: '800', color: c.text },
    count: {
      fontSize: 12,
      fontWeight: '700',
      color: c.textDim,
      backgroundColor: c.surfaceAlt,
      paddingHorizontal: 8,
      paddingVertical: 2,
      borderRadius: 999,
      overflow: 'hidden',
    },
    searchBox: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      paddingHorizontal: 14,
      height: 46,
      borderRadius: 14,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 12,
    },
    searchInput: { flex: 1, color: c.text, fontSize: 15 },

    card: {
      flexDirection: 'row',
      gap: 12,
      padding: 14,
      borderRadius: 18,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 10,
    },
    cardIcon: { width: 46, height: 46, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
    cardTitle: { fontSize: 15.5, fontWeight: '700', color: c.text },
    cardMeta: { fontSize: 12, color: c.textFaint, marginTop: 2, fontWeight: '500' },
    cardPreview: { fontSize: 13, color: c.textDim, marginTop: 6, lineHeight: 18 },

    empty: { alignItems: 'center', paddingVertical: 36, paddingHorizontal: 24 },
    emptyIcon: {
      width: 76,
      height: 76,
      borderRadius: 38,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primarySoft,
      marginBottom: 14,
    },
    emptyTitle: { fontSize: 17, fontWeight: '800', color: c.text },
    emptyText: { fontSize: 14, color: c.textDim, textAlign: 'center', marginTop: 6, lineHeight: 20 },

    bannerWrap: { alignItems: 'center', backgroundColor: c.bg },

    docHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 10, paddingVertical: 8 },
    docTitle: { fontSize: 18, fontWeight: '800', color: c.text },
    docSub: { fontSize: 12.5, color: c.textFaint, marginTop: 1, fontWeight: '500' },
    notice: { marginHorizontal: 16, padding: 12, borderRadius: 14, backgroundColor: c.gold + '22' },
    noticeText: { fontSize: 13, color: c.text, lineHeight: 18 },
    pageCard: {
      padding: 16,
      borderRadius: 18,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      marginBottom: 12,
    },
    pageLabel: {
      fontSize: 11,
      fontWeight: '800',
      color: c.primary,
      letterSpacing: 0.8,
      textTransform: 'uppercase',
      marginBottom: 8,
    },
    pageText: { fontSize: 15.5, lineHeight: 24, color: c.text },
    actionBar: {
      flexDirection: 'row',
      gap: 6,
      paddingHorizontal: 12,
      paddingTop: 8,
      backgroundColor: c.surface,
      borderTopWidth: 1,
      borderTopColor: c.border,
    },

    overlay: { flex: 1, backgroundColor: 'rgba(5,6,15,0.6)', alignItems: 'center', justifyContent: 'center', padding: 24 },
    progressCard: { width: '100%', maxWidth: 380, borderRadius: 26, padding: 24, backgroundColor: c.surface, alignItems: 'center' },
    progressIcon: { width: 58, height: 58, borderRadius: 18, alignItems: 'center', justifyContent: 'center' },
    progressTitle: { fontSize: 17, fontWeight: '800', color: c.text, marginTop: 14 },
    progressSub: { fontSize: 14, color: c.textDim, marginTop: 4 },
    bar: { width: '100%', height: 8, borderRadius: 4, backgroundColor: c.surfaceAlt, marginTop: 18, overflow: 'hidden' },
    barFill: { height: 8, borderRadius: 4, backgroundColor: c.primary },
    progressHint: { fontSize: 12, color: c.textFaint, marginTop: 10 },
    stopBtn: { marginTop: 18, paddingVertical: 10, paddingHorizontal: 18, borderRadius: 999, backgroundColor: c.surfaceAlt },
    stopText: { fontSize: 14, fontWeight: '700', color: c.text },

    scrim: { flex: 1, backgroundColor: 'rgba(5,6,15,0.45)' },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    grabber: { alignSelf: 'center', width: 40, height: 4, borderRadius: 2, backgroundColor: c.border, marginBottom: 12 },
    sheetClose: { position: 'absolute', right: 0, top: 0, zIndex: 2, padding: 4 },
    sheetTitle: { fontSize: 22, fontWeight: '800', color: c.text, letterSpacing: -0.4 },
    sheetSub: { fontSize: 14, color: c.textDim, marginTop: 4, marginBottom: 6 },
    crown: {
      alignSelf: 'center',
      width: 60,
      height: 60,
      borderRadius: 30,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
      marginTop: 4,
    },
    benefit: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    benefitIcon: { width: 32, height: 32, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    benefitText: { fontSize: 14.5, color: c.text, fontWeight: '600' },
    plan: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: c.border,
      marginTop: 10,
    },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    planTitle: { fontSize: 16, fontWeight: '800', color: c.text },
    planNote: { fontSize: 12.5, color: c.textDim, marginTop: 2 },
    planPrice: { fontSize: 16, fontWeight: '800', color: c.text },
    badge: { backgroundColor: c.success, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 },
    badgeText: { color: '#fff', fontSize: 11, fontWeight: '800' },
    cta: { height: 54, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
    ctaText: { color: '#fff', fontSize: 16.5, fontWeight: '800' },
    videoBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      height: 50,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: c.primary,
      marginTop: 10,
    },
    videoText: { color: c.primary, fontSize: 15, fontWeight: '700' },
    restore: { textAlign: 'center', color: c.textDim, fontSize: 13.5, fontWeight: '600', marginTop: 14 },
    fine: { textAlign: 'center', color: c.textFaint, fontSize: 11, marginTop: 8, lineHeight: 15 },

    exportRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 16,
      backgroundColor: c.surfaceAlt,
      marginTop: 10,
    },
    exportIcon: {
      width: 40,
      height: 40,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.primarySoft,
    },
    exportTitle: { fontSize: 15.5, fontWeight: '700', color: c.text },
    exportSub: { fontSize: 12.5, color: c.textDim, marginTop: 1 },

    renameInput: {
      marginTop: 12,
      height: 50,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surfaceAlt,
      paddingHorizontal: 14,
      color: c.text,
      fontSize: 16,
    },

    proCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 14,
      borderRadius: 14,
      backgroundColor: c.gold + '1F',
      marginTop: 12,
      marginBottom: 4,
    },
    proCardText: { flex: 1, color: c.text, fontSize: 14, fontWeight: '600' },
    settingRow: { paddingVertical: 15, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: c.border, borderRadius: 8 },
    settingText: { fontSize: 15.5, color: c.text, fontWeight: '600' },
    footnote: { fontSize: 12, color: c.textFaint, textAlign: 'center', marginTop: 16, lineHeight: 18 },
    legal: { fontSize: 14, color: c.textDim, lineHeight: 21, marginTop: 10 },
  });
}
