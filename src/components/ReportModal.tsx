import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { ChatMessage } from '../types/chat';

interface ReportModalProps {
  visible: boolean;
  message: ChatMessage | null;
  onClose: () => void;
  onSubmitReport: (message: ChatMessage, reason: string) => void;
}

const REPORT_REASONS = [
  'Inappropriate or offensive tone',
  'Harmful or unsafe life advice',
  'Out of character / Hallucination',
  'Other store policy concern',
];

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  message,
  onClose,
  onSubmitReport,
}) => {
  const [selectedReason, setSelectedReason] = useState<string>(REPORT_REASONS[0]);

  if (!message) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View style={styles.modalCard}>
          <Text style={styles.title}>🏳️ Report AI Message</Text>
          <Text style={styles.subtitle}>
            Help us keep Persona Advisor safe and compliant with App Store & Google Play
            AI policies. Why are you reporting this response?
          </Text>

          <View style={styles.excerptBox}>
            <Text style={styles.excerptText} numberOfLines={2}>
              “{message.content}”
            </Text>
          </View>

          <View style={styles.reasonsList}>
            {REPORT_REASONS.map((reason) => {
              const active = selectedReason === reason;
              return (
                <Pressable
                  key={reason}
                  onPress={() => setSelectedReason(reason)}
                  style={[styles.reasonOption, active && styles.reasonOptionActive]}
                >
                  <View style={[styles.radio, active && styles.radioActive]} />
                  <Text
                    style={[styles.reasonText, active && styles.reasonTextActive]}
                  >
                    {reason}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <View style={styles.actionsRow}>
            <Pressable onPress={onClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onSubmitReport(message, selectedReason)}
              style={styles.submitButton}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(2, 6, 23, 0.78)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#111827',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.25)',
    padding: 20,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: '800',
    marginBottom: 6,
  },
  subtitle: {
    color: '#94A3B8',
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 12,
  },
  excerptBox: {
    backgroundColor: '#090D16',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
    marginBottom: 14,
  },
  excerptText: {
    color: '#CBD5E1',
    fontSize: 12,
    fontStyle: 'italic',
  },
  reasonsList: {
    gap: 8,
    marginBottom: 18,
  },
  reasonOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#0B1120',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.15)',
  },
  reasonOptionActive: {
    borderColor: '#EF4444',
    backgroundColor: 'rgba(239, 68, 68, 0.10)',
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: '#64748B',
  },
  radioActive: {
    borderColor: '#EF4444',
    backgroundColor: '#EF4444',
  },
  reasonText: {
    color: '#CBD5E1',
    fontSize: 13.5,
    fontWeight: '500',
  },
  reasonTextActive: {
    color: '#FCA5A5',
    fontWeight: '700',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  cancelButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: 'rgba(148, 163, 184, 0.12)',
  },
  cancelButtonText: {
    color: '#CBD5E1',
    fontSize: 13.5,
    fontWeight: '600',
  },
  submitButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#EF4444',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 13.5,
    fontWeight: '700',
  },
});
