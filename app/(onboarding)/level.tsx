import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUser, getUser } from '@/utils/storage';

const LEVELS = [
  { id: 'SD', label: 'SD', emoji: '🎒', desc: 'Sekolah Dasar' },
  { id: 'SMP', label: 'SMP', emoji: '📖', desc: 'Sekolah Menengah Pertama' },
  { id: 'SMA', label: 'SMA', emoji: '🎓', desc: 'Sekolah Menengah Atas' },
  { id: 'SMK', label: 'SMK', emoji: '🔧', desc: 'Sekolah Menengah Kejuruan' },
  { id: 'Mahasiswa', label: 'Mahasiswa', emoji: '🏫', desc: 'Perguruan Tinggi' },
];

export default function LevelScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState('');

  const handleNext = async () => {
    if (!selected) return;
    const existing = await getUser();
    await saveUser({
      name: existing?.name || '',
      level: selected,
      onboarded: false,
    });
    router.push('/(onboarding)/ready');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>🏫</Text>
          </View>

          <Text style={styles.title}>Jenjang Pendidikan</Text>
          <Text style={styles.subtitle}>
            Pilih jenjang pendidikanmu saat ini
          </Text>

          {/* Level Cards */}
          <View style={styles.grid}>
            {LEVELS.map((level) => (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.card,
                  selected === level.id && styles.cardSelected,
                ]}
                onPress={() => setSelected(level.id)}
                activeOpacity={0.7}
              >
                <Text style={styles.cardEmoji}>{level.emoji}</Text>
                <Text
                  style={[
                    styles.cardLabel,
                    selected === level.id && styles.cardLabelSelected,
                  ]}
                >
                  {level.label}
                </Text>
                <Text
                  style={[
                    styles.cardDesc,
                    selected === level.id && styles.cardDescSelected,
                  ]}
                >
                  {level.desc}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA */}
      <View style={styles.bottom}>
        <TouchableOpacity
          style={[styles.primaryBtn, !selected && styles.primaryBtnDisabled]}
          onPress={handleNext}
          activeOpacity={0.85}
          disabled={!selected}
        >
          <Text style={styles.primaryBtnText}>Lanjutkan →</Text>
        </TouchableOpacity>

        <Text style={styles.hint}>Langkah 3 dari 4</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.huge,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.skySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
    ...Shadows.md,
  },
  emoji: {
    fontSize: 48,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxxl,
  },
  grid: {
    width: '100%',
    gap: Spacing.md,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardSelected: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
  },
  cardEmoji: {
    fontSize: 28,
    marginRight: Spacing.md,
  },
  cardLabel: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginRight: Spacing.sm,
  },
  cardLabelSelected: {
    color: Colors.primary,
  },
  cardDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
  },
  cardDescSelected: {
    color: Colors.primaryDark,
  },
  bottom: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
    alignItems: 'center',
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xxxl,
    borderRadius: BorderRadius.xl,
    width: '100%',
    alignItems: 'center',
    ...Shadows.md,
  },
  primaryBtnDisabled: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.6,
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
