import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUser, getUser } from '@/utils/storage';
import { useAppContext } from '@/app/_layout';

export default function ReadyScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAppContext();
  const [userName, setUserName] = useState('');

  useEffect(() => {
    loadName();
  }, []);

  async function loadName() {
    const user = await getUser();
    if (user?.name) setUserName(user.name);
  }

  const handleStart = async () => {
    const user = await getUser();
    if (user) {
      await saveUser({ ...user, onboarded: true });
    }
    // Update in-memory state BEFORE navigating so root layout's
    // redirect guard doesn't send us back to onboarding
    completeOnboarding();
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Celebration */}
        <View style={styles.iconContainer}>
          <Text style={styles.emoji}>🚀</Text>
        </View>

        <Text style={styles.title}>
          Siap menaklukkan{'\n'}tugasmu, {userName}? 💪
        </Text>

        <Text style={styles.subtitle}>
          Semua sudah siap! Mulai catat dan atur{'\n'}
          tugas sekolahmu sekarang juga.
        </Text>

        {/* Motivational Cards */}
        <View style={styles.cards}>
          <View style={[styles.motivCard, { backgroundColor: Colors.coralSoft }]}>
            <Text style={styles.motivEmoji}>💡</Text>
            <Text style={styles.motivText}>
              "Sedikit-sedikit, lama-lama menjadi bukit"
            </Text>
          </View>
          <View style={[styles.motivCard, { backgroundColor: Colors.mintSoft }]}>
            <Text style={styles.motivEmoji}>🌟</Text>
            <Text style={styles.motivText}>
              Kerjakan tugasmu tepat waktu, raih prestasi!
            </Text>
          </View>
        </View>
      </View>

      {/* CTA */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={handleStart}
          activeOpacity={0.85}
        >
          <Text style={styles.primaryBtnText}>🎯 Mulai Sekarang</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Langkah 4 dari 4 — Selesai!</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.lg,
  },
  emoji: {
    fontSize: 56,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxxl,
  },
  cards: {
    width: '100%',
    gap: Spacing.md,
  },
  motivCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  motivEmoji: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  motivText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '500',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bottom: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.xl,
    width: '100%',
    alignItems: 'center',
    ...Shadows.lg,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
  hint: {
    marginTop: Spacing.md,
    fontSize: FontSize.sm,
    color: Colors.textMuted,
  },
});
