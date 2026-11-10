import { useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SmarterThan7YoApp } from '../src/components/SmarterThan7YoApp';

export default function SmarterThan7YoScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#070B19' }}>
      <SmarterThan7YoApp onSwitchToGreatestMinds={() => router.push('/')} />
    </SafeAreaView>
  );
}
