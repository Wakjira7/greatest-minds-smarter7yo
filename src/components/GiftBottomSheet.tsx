import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

/**
 * Virtual gift sheet for chat.
 * Re-implemented from Astroway's `astrologerProfile/sendGiftBottomSheet.dart`:
 * 3-column gift grid with a selected state, wallet balance row with a Recharge
 * shortcut, and an "Insufficient balance" guard before sending.
 */

export interface GiftOption {
  id: string;
  emoji: string;
  label: string;
  coins: number;
  reaction: string;
}

export const MIND_GIFTS: GiftOption[] = [
  { id: 'tea', emoji: '🍵', label: 'Cup of Tea', coins: 2, reaction: 'A warm cup of tea! Let us think slowly together.' },
  { id: 'scroll', emoji: '📜', label: 'Ancient Scroll', coins: 5, reaction: 'A scroll! Knowledge is the finest gift of all.' },
  { id: 'laurel', emoji: '🌿', label: 'Laurel Wreath', coins: 10, reaction: 'A laurel wreath—I am honored, my friend!' },
  { id: 'telescope', emoji: '🔭', label: 'Telescope', coins: 15, reaction: 'Now we can gaze at the stars while we talk!' },
  { id: 'crown', emoji: '👑', label: 'Golden Crown', coins: 25, reaction: 'A crown! You treat me like royalty.' },
  { id: 'galaxy', emoji: '🌌', label: 'Whole Galaxy', coins: 50, reaction: 'An entire galaxy?! Your generosity is cosmic!' },
];

interface GiftBottomSheetProps {
  visible: boolean;
  personaName: string;
  accentColor: string;
  coinBalance: number;
  onClose: () => void;
  onRecharge: () => void;
  onSend: (gift: GiftOption) => Promise<boolean>;
}

export const GiftBottomSheet: React.FC<GiftBottomSheetProps> = ({
  visible,
  personaName,
  accentColor,
  coinBalance,
  onClose,
  onRecharge,
  onSend,
}) => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  const selected = MIND_GIFTS.find((g) => g.id === selectedId) ?? null;

  const handleSend = async () => {
    if (!selected || sending) return;
    if (coinBalance < selected.coins) {
      setError('Insufficient balance — recharge or watch an ad for coins.');
      return;
    }
    setSending(true);
    const ok = await onSend(selected);
    setSending(false);
    if (ok) {
      setSelectedId(null);
      setError(null);
      onClose();
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.backdrop} onPress={onClose}>
        <Pressable style={styles.sheet} onPress={() => {}}>
          <View style={styles.handle} />
          <Text style={styles.title}>🎁 Send a Gift</Text>
          <Text style={styles.subtitle}>to {personaName}</Text>

          <View style={styles.grid}>
            {MIND_GIFTS.map((gift) => {
              const isSelected = gift.id === selectedId;
              const affordable = coinBalance >= gift.coins;
              return (
                <Pressable
                  key={gift.id}
                  onPress={() => {
                    setSelectedId(gift.id);
                    setError(null);
                  }}
                  style={[
                    styles.giftCell,
                    isSelected && { borderColor: accentColor, backgroundColor: accentColor + '22' },
                    !affordable && { opacity: 0.55 },
                  ]}
                >
                  {isSelected ? (
                    <View style={[styles.check, { backgroundColor: accentColor }]}>
                      <Text style={styles.checkText}>✓</Text>
                    </View>
                  ) : null}
                  <Text style={styles.giftEmoji}>{gift.emoji}</Text>
                  <Text style={styles.giftLabel} numberOfLines={1}>
                    {gift.label}
                  </Text>
                  <Text style={[styles.giftCost, isSelected && { color: accentColor }]}>
                    🪙 {gift.coins}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.walletRow}>
            <Text style={styles.walletLabel}>👛 Coin Balance</Text>
            <Text style={styles.walletValue}>🪙 {coinBalance}</Text>
            <Pressable onPress={onRecharge} style={styles.rechargeBtn}>
              <Text style={styles.rechargeText}>Recharge</Text>
            </Pressable>
          </View>

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <Pressable
            onPress={handleSend}
            disabled={!selected || sending}
            style={[
              styles.sendBtn,
              { backgroundColor: selected ? accentColor : '#1E293B' },
            ]}
          >
            <Text style={[styles.sendText, { color: selected ? '#090D16' : '#64748B' }]}>
              {sending
                ? 'Sending…'
                : selected
                ? `Send ${selected.emoji} for 🪙 ${selected.coins}`
                : 'Pick a gift'}
            </Text>
          </Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(4,7,20,0.75)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: '#0F172A',
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 18,
    paddingBottom: 26,
    borderTopWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
  },
  handle: {
    alignSelf: 'center',
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginBottom: 12,
  },
  title: { color: '#F8FAFC', fontSize: 18, fontWeight: '900', textAlign: 'center' },
  subtitle: { color: '#94A3B8', fontSize: 12.5, textAlign: 'center', marginBottom: 14 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'space-between' },
  giftCell: {
    width: '31%',
    backgroundColor: '#131C33',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  check: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkText: { color: '#090D16', fontSize: 11, fontWeight: '900' },
  giftEmoji: { fontSize: 30 },
  giftLabel: { color: '#E2E8F0', fontSize: 11.5, fontWeight: '800', marginTop: 4 },
  giftCost: { color: '#FBBF24', fontSize: 11.5, fontWeight: '900', marginTop: 2 },
  walletRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    backgroundColor: '#131C33',
    borderRadius: 14,
    padding: 12,
    gap: 8,
  },
  walletLabel: { color: '#94A3B8', fontSize: 12, fontWeight: '700', flex: 1 },
  walletValue: { color: '#FBBF24', fontSize: 14, fontWeight: '900' },
  rechargeBtn: {
    backgroundColor: 'rgba(251,191,36,0.16)',
    borderWidth: 1,
    borderColor: '#FBBF24',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  rechargeText: { color: '#FBBF24', fontSize: 11.5, fontWeight: '900' },
  error: { color: '#FB7185', fontSize: 12, fontWeight: '700', marginTop: 10, textAlign: 'center' },
  sendBtn: { marginTop: 14, paddingVertical: 14, borderRadius: 14, alignItems: 'center' },
  sendText: { fontSize: 14, fontWeight: '900' },
});
