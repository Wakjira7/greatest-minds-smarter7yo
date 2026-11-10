import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DisclaimerBannerProps {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<DisclaimerBannerProps> = ({ compact = false }) => {
  return (
    <View
      style={[styles.container, compact ? styles.compactContainer : styles.cardContainer]}
    >
      <View style={styles.row}>
        <Text style={styles.icon}>⚠️</Text>
        <Text
          style={[styles.text, compact && styles.compactText]}
          accessibilityRole="text"
        >
          <Text style={styles.bold}>AI Parody Advisor</Text> — For entertainment and
          self-reflection only, not medical or clinical therapy.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(245, 158, 11, 0.10)',
  },
  cardContainer: {
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.32)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 16,
  },
  compactContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(245, 158, 11, 0.22)',
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 13,
  },
  text: {
    flex: 1,
    color: '#FDE68A',
    fontSize: 12,
    lineHeight: 17,
  },
  compactText: {
    fontSize: 11,
    lineHeight: 15,
  },
  bold: {
    fontWeight: '700',
    color: '#FBBF24',
  },
});
