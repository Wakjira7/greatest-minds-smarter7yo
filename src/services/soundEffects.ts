import { Platform } from 'react-native';

const LOSER_LAUGH_WAV = require('../../assets/sounds/loser-laugh.wav');
const CORRECT_CHIME_WAV = require('../../assets/sounds/correct-chime.wav');

// Lazy-load expo-av and expo-speech inside try/catch so missing native modules never crash release builds
let ExpoAudio: any = null;
let ExpoSpeech: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExpoAudio = require('expo-av')?.Audio || null;
} catch {
  ExpoAudio = null;
}

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  ExpoSpeech = require('expo-speech') || null;
} catch {
  ExpoSpeech = null;
}

let audioConfigured = false;
async function ensureAudioMode() {
  if (audioConfigured || !ExpoAudio?.setAudioModeAsync) return;
  try {
    await ExpoAudio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      playThroughEarpieceAndroid: false,
    });
    audioConfigured = true;
  } catch {
    // Ignore audio mode setup errors
  }
}

/**
 * Web Audio API fallback synthesizer for instant zero-latency browser playback
 */
function playWebSynthSound(type: 'loser' | 'correct') {
  if (Platform.OS !== 'web' || typeof window === 'undefined') return;
  try {
    const AudioCtx = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (type === 'loser') {
      // Classic "Wah-Wah-Wah-Waaaaah" descending sad trombone + giggle
      const tromboneNotes = [
        { t: 0.0, d: 0.26, f1: 233.08, f2: 229.0 },
        { t: 0.28, d: 0.26, f1: 220.0, f2: 216.0 },
        { t: 0.56, d: 0.26, f1: 207.65, f2: 203.0 },
        { t: 0.84, d: 0.55, f1: 196.0, f2: 142.0 },
      ];
      for (const n of tromboneNotes) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(n.f1, now + n.t);
        osc.frequency.linearRampToValueAtTime(n.f2, now + n.t + n.d);
        gain.gain.setValueAtTime(0.001, now + n.t);
        gain.gain.linearRampToValueAtTime(0.28, now + n.t + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + n.t);
        osc.stop(now + n.t + n.d);
      }

      // Playful bouncy kid laugh notes ("Ha-ha-ha-he-he!")
      const laughNotes = [540, 590, 520, 620, 560, 650];
      laughNotes.forEach((freq, idx) => {
        const start = now + 1.42 + idx * 0.14;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        osc.frequency.exponentialRampToValueAtTime(freq * 0.84, start + 0.11);
        gain.gain.setValueAtTime(0.25, start);
        gain.gain.exponentialRampToValueAtTime(0.01, start + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + 0.12);
      });
    } else {
      // Bright Victory Arpeggio
      const winNotes = [523.25, 659.25, 783.99, 1046.5];
      winNotes.forEach((freq, idx) => {
        const start = now + idx * 0.11;
        const dur = idx === 3 ? 0.38 : 0.15;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, start);
        gain.gain.setValueAtTime(0.24, start);
        gain.gain.exponentialRampToValueAtTime(0.008, start + dur);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(start);
        osc.stop(start + dur);
      });
    }
  } catch {
    // Ignore WebAudio error
  }
}

/**
 * Plays the Game Show Loser Sound ("Wah-Wah-Wah-Waaaaah") + Kid Laugh ("Hahaha! Hehehe!")
 * and speaks the classmate roast out loud on both Android/iOS native and Web!
 */
export async function playLoserLaughSound(roastText?: string, ttsLang = 'en-US') {
  playWebSynthSound('loser');

  if (ExpoAudio?.Sound?.createAsync) {
    try {
      await ensureAudioMode();
      const { sound } = await ExpoAudio.Sound.createAsync(LOSER_LAUGH_WAV, {
        shouldPlay: true,
        volume: 1.0,
      });
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status?.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch {
      // Fallback to speech below
    }
  }

  // Trigger playful kid laugh + roast via native TTS (or Web speechSynthesis) right as the horn finishes
  const laughLine = roastText
    ? `Hahaha! Hehehe! ${roastText}`
    : 'Hahaha! Hehehe! You got outsmarted by a 7-year-old!';

  setTimeout(() => {
    speakKidVoice(laughLine, ttsLang, 1.42, 1.08);
  }, 950);
}

/**
 * Plays the Game Show Victory Chime + Kid Cheer
 */
export async function playCorrectChimeSound(cheerText?: string, ttsLang = 'en-US') {
  playWebSynthSound('correct');

  if (ExpoAudio?.Sound?.createAsync) {
    try {
      await ensureAudioMode();
      const { sound } = await ExpoAudio.Sound.createAsync(CORRECT_CHIME_WAV, {
        shouldPlay: true,
        volume: 0.9,
      });
      sound.setOnPlaybackStatusUpdate((status: any) => {
        if (status?.didJustFinish) {
          sound.unloadAsync().catch(() => {});
        }
      });
    } catch {
      // Ignore
    }
  }

  if (cheerText) {
    setTimeout(() => {
      speakKidVoice(cheerText, ttsLang, 1.38, 1.06);
    }, 350);
  }
}

/**
 * Cross-platform TTS voice (Android/iOS native via expo-speech + Web via speechSynthesis)
 */
export function speakKidVoice(
  text: string,
  ttsLang = 'en-US',
  pitch = 1.28,
  rate = 1.05
) {
  if (!text) return;

  if (Platform.OS !== 'web' && ExpoSpeech?.speak) {
    try {
      ExpoSpeech.stop();
      ExpoSpeech.speak(text, {
        language: ttsLang,
        pitch,
        rate,
      });
      return;
    } catch {
      // Fallback
    }
  }

  if (
    Platform.OS === 'web' &&
    typeof window !== 'undefined' &&
    'speechSynthesis' in window
  ) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = ttsLang;
      utterance.pitch = pitch;
      utterance.rate = rate;
      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore
    }
  }
}
