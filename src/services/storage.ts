import AsyncStorage from '@react-native-async-storage/async-storage';
import { getPersonaById } from '../constants/personas';
import { ChatMessage, MessageReport } from '../types/chat';

const CHAT_KEY_PREFIX = '@persona_advisor_chat_v1:';
const REPORTS_KEY = '@persona_advisor_reports_v1';

export function createInitialGreetingMessage(personaId: string): ChatMessage {
  const persona = getPersonaById(personaId);
  const greetingText =
    persona?.greeting ??
    'Welcome! Tell me what problem is on your mind today, and we will solve it together.';

  return {
    id: `greeting-${personaId}`,
    personaId,
    role: 'assistant',
    content: greetingText,
    timestamp: Date.now(),
    catchphraseUsed: persona?.catchphrases[0],
    modelUsed: 'persona-greeting',
    isMock: false,
  };
}

export async function loadPersonaChatHistory(personaId: string): Promise<ChatMessage[]> {
  try {
    const raw = await AsyncStorage.getItem(`${CHAT_KEY_PREFIX}${personaId}`);
    if (!raw) {
      const initial = [createInitialGreetingMessage(personaId)];
      await AsyncStorage.setItem(`${CHAT_KEY_PREFIX}${personaId}`, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = [createInitialGreetingMessage(personaId)];
      await AsyncStorage.setItem(`${CHAT_KEY_PREFIX}${personaId}`, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch (err) {
    console.warn('Failed to load chat history from AsyncStorage:', err);
    return [createInitialGreetingMessage(personaId)];
  }
}

export async function savePersonaChatHistory(
  personaId: string,
  messages: ChatMessage[]
): Promise<void> {
  try {
    await AsyncStorage.setItem(`${CHAT_KEY_PREFIX}${personaId}`, JSON.stringify(messages));
  } catch (err) {
    console.warn('Failed to save chat history to AsyncStorage:', err);
  }
}

export async function clearPersonaChatHistory(personaId: string): Promise<ChatMessage[]> {
  const initial = [createInitialGreetingMessage(personaId)];
  try {
    await AsyncStorage.setItem(`${CHAT_KEY_PREFIX}${personaId}`, JSON.stringify(initial));
  } catch (err) {
    console.warn('Failed to reset chat history:', err);
  }
  return initial;
}

export interface PersonaChatSummary {
  messageCount: number;
  lastMessageText?: string;
  lastUpdated?: number;
}

export async function loadAllPersonaSummaries(
  personaIds: string[]
): Promise<Record<string, PersonaChatSummary>> {
  const result: Record<string, PersonaChatSummary> = {};
  try {
    const keys = personaIds.map((id) => `${CHAT_KEY_PREFIX}${id}`);
    const pairs = await AsyncStorage.multiGet(keys);

    for (let i = 0; i < personaIds.length; i++) {
      const personaId = personaIds[i];
      const raw = pairs[i]?.[1];
      if (!raw) {
        result[personaId] = { messageCount: 0 };
        continue;
      }
      const messages = JSON.parse(raw) as ChatMessage[];
      const userTurns = messages.filter((m) => m.role === 'user').length;
      const lastMsg = messages[messages.length - 1];
      result[personaId] = {
        messageCount: userTurns,
        lastMessageText: userTurns > 0 ? lastMsg?.content : undefined,
        lastUpdated: userTurns > 0 ? lastMsg?.timestamp : undefined,
      };
    }
  } catch (err) {
    console.warn('Failed to load persona summaries:', err);
  }
  return result;
}

export async function submitMessageReport(
  message: ChatMessage,
  reason: string
): Promise<MessageReport> {
  const report: MessageReport = {
    id: `report-${Date.now()}`,
    messageId: message.id,
    personaId: message.personaId,
    messageExcerpt: message.content.slice(0, 160),
    reason,
    createdAt: Date.now(),
  };

  try {
    const existingRaw = await AsyncStorage.getItem(REPORTS_KEY);
    const existing: MessageReport[] = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(report);
    await AsyncStorage.setItem(REPORTS_KEY, JSON.stringify(existing.slice(0, 100)));
  } catch (err) {
    console.warn('Failed to save report to AsyncStorage:', err);
  }

  return report;
}
