import React, { useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChatMessage, Persona } from '../types/chat';
import { Avatar3D } from './Avatar3D';

interface ChatBubbleProps {
  message: ChatMessage;
  persona: Persona;
  onReportPress: (message: ChatMessage) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({
  message,
  persona,
  onReportPress,
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);

  const isUser = message.role === 'user';
  const timeString = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  // DTPocketFM v1.6 Voice Read-Aloud (TTS) for Advisor replies
  const handleToggleSpeech = () => {
    const cleanText = message.content.replace(/\*\*/g, '');
    if (isSpeaking) {
      if (
        Platform.OS === 'web' &&
        typeof window !== 'undefined' &&
        'speechSynthesis' in window
      ) {
        window.speechSynthesis.cancel();
      }
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    if (
      Platform.OS === 'web' &&
      typeof window !== 'undefined' &&
      'speechSynthesis' in window
    ) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.02;
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    } else {
      setTimeout(() => setIsSpeaking(false), 3800);
    }
  };

  const handleCopyQuote = () => {
    const cleanText = message.content.replace(/\*\*/g, '');
    if (
      Platform.OS === 'web' &&
      typeof navigator !== 'undefined' &&
      navigator.clipboard
    ) {
      navigator.clipboard.writeText(`${persona.name}: "${cleanText}"`).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Render bold text segments wrapped in **...**
  const renderFormattedText = (text: string) => {
    const parts = text.split(/(\*\*[^*]+\*\*)/g);
    return parts.map((part, idx) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const clean = part.slice(2, -2);
        return (
          <Text
            key={idx}
            style={[
              styles.catchphraseHighlight,
              !isUser && { color: persona.accentColor },
            ]}
          >
            {clean}
          </Text>
        );
      }
      return <Text key={idx}>{part}</Text>;
    });
  };

  if (isUser) {
    return (
      <View style={styles.userRow}>
        <View style={[styles.userBubble, { backgroundColor: persona.accentColor }]}>
          <Text style={styles.userText}>{message.content}</Text>
          <Text style={styles.userTimestamp}>{timeString}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.aiRow}>
      <View
        style={[
          styles.aiAvatar,
          {
            backgroundColor: persona.accentBg,
            borderColor: persona.accentBorder,
          },
        ]}
      >
        <Avatar3D
          personaId={persona.id}
          accentColor={persona.accentColor}
          size={36}
          animated={false}
        />
      </View>

      <View style={styles.aiBubbleWrapper}>
        <View style={styles.aiHeaderRow}>
          <Text style={[styles.aiName, { color: persona.accentColor }]}>
            {persona.name}
          </Text>
          <Text style={styles.aiRoleBadge}>{persona.specialtyBadge}</Text>
        </View>

        <View
          style={[
            styles.aiBubble,
            {
              borderColor: message.reported
                ? 'rgba(239, 68, 68, 0.45)'
                : 'rgba(148, 163, 184, 0.18)',
            },
          ]}
        >
          <Text style={styles.aiText}>{renderFormattedText(message.content)}</Text>

          {message.catchphraseUsed && (
            <View
              style={[
                styles.catchphrasePill,
                {
                  backgroundColor: persona.accentBg,
                  borderColor: persona.accentBorder,
                },
              ]}
            >
              <Text style={[styles.catchphrasePillText, { color: persona.accentColor }]}>
                ✨ Catchphrase: “{message.catchphraseUsed}”
              </Text>
            </View>
          )}

          {/* Bubble Footer: Timestamp + Live Token/Cost Meter + DTPocketFM Audio TTS + Copy + Mandatory Store Report Button */}
          <View style={styles.aiFooterRow}>
            <Text style={styles.aiTimestamp}>
              {timeString}
              {message.isMock ? ' • 🛡️ $0.00 Preview' : ` • 🟢 ${message.modelUsed || 'Gemini Live'}`}
              {message.tokensUsed
                ? ` • ${message.tokensUsed} tok ($${(message.costUsd ?? 0).toFixed(4)})`
                : ''}
            </Text>

            <View style={styles.footerActionsRight}>
              <Pressable
                onPress={handleToggleSpeech}
                accessibilityRole="button"
                accessibilityLabel="Listen to AI Message"
                style={[
                  styles.actionChip,
                  isSpeaking && {
                    backgroundColor: persona.accentBg,
                    borderColor: persona.accentBorder,
                    borderWidth: 1,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.actionChipText,
                    isSpeaking && { color: persona.accentColor },
                  ]}
                >
                  {isSpeaking ? '⏹ Stop' : '🔊 Listen'}
                </Text>
              </Pressable>

              <Pressable
                onPress={handleCopyQuote}
                accessibilityRole="button"
                accessibilityLabel="Copy AI Quote"
                style={styles.actionChip}
              >
                <Text style={styles.actionChipText}>
                  {copied ? '✓ Copied' : '📋 Copy'}
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onReportPress(message)}
                accessibilityRole="button"
                accessibilityLabel="Report AI Message"
                style={({ pressed }) => [
                  styles.reportButton,
                  message.reported && styles.reportButtonReported,
                  pressed && { opacity: 0.75 },
                ]}
              >
                <Text
                  style={[
                    styles.reportButtonText,
                    message.reported && styles.reportButtonTextReported,
                  ]}
                >
                  {message.reported ? '🚩 Reported' : '🏳️ Report'}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  userRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 14,
    paddingLeft: 48,
  },
  userBubble: {
    borderRadius: 18,
    borderBottomRightRadius: 4,
    paddingHorizontal: 15,
    paddingVertical: 11,
    maxWidth: '100%',
  },
  userText: {
    color: '#090D16',
    fontSize: 14.5,
    fontWeight: '600',
    lineHeight: 20,
  },
  userTimestamp: {
    color: 'rgba(9, 13, 22, 0.65)',
    fontSize: 10.5,
    fontWeight: '600',
    marginTop: 5,
    textAlign: 'right',
  },
  aiRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 16,
    paddingRight: 20,
  },
  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  aiBubbleWrapper: {
    flex: 1,
  },
  aiHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
    paddingLeft: 2,
  },
  aiName: {
    fontSize: 12.5,
    fontWeight: '700',
  },
  aiRoleBadge: {
    color: '#64748B',
    fontSize: 11,
    fontWeight: '600',
  },
  aiBubble: {
    backgroundColor: '#111827',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    borderWidth: 1,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  aiText: {
    color: '#F1F5F9',
    fontSize: 14.5,
    lineHeight: 22,
  },
  catchphraseHighlight: {
    fontWeight: '800',
  },
  catchphrasePill: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  catchphrasePillText: {
    fontSize: 11.5,
    fontWeight: '700',
    fontStyle: 'italic',
  },
  aiFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(148, 163, 184, 0.12)',
    gap: 8,
  },
  aiTimestamp: {
    color: '#64748B',
    fontSize: 11,
  },
  footerActionsRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionChip: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.10)',
  },
  actionChipText: {
    color: '#CBD5E1',
    fontSize: 11,
    fontWeight: '700',
  },
  reportButton: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    backgroundColor: 'rgba(148, 163, 184, 0.10)',
  },
  reportButtonReported: {
    backgroundColor: 'rgba(239, 68, 68, 0.16)',
  },
  reportButtonText: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
  },
  reportButtonTextReported: {
    color: '#FCA5A5',
  },
});
