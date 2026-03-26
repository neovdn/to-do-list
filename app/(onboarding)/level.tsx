import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Animated, Pressable } from 'react-native';
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

// 1. Ekstraksi Komponen Card dengan Animasi
const LevelCard = ({ level, isSelected, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  // Efek mengecil saat ditekan
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95, // Mengecil 5%
      useNativeDriver: true,
    }).start();
  };

  // Efek kembali ke ukuran semula saat dilepas (memegas)
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4, // Mengatur seberapa banyak pantulannya
      tension: 40, // Mengatur kecepatan kembalinya
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={[
          styles.card,
          isSelected && styles.cardSelected,
        ]}
      >
        <View style={styles.cardLeft}>
          <Text style={styles.cardEmoji}>{level.emoji}</Text>
          <Text style={[styles.cardLabel, isSelected && styles.cardLabelSelected]}>
            {level.label}
          </Text>
        </View>
        <Text style={[styles.cardDesc, isSelected && styles.cardDescSelected]}>
          {level.desc}
        </Text>
      </Pressable>
    </Animated.View>
  );
};

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
          
          {/* Header Area */}
          <View style={styles.headerArea}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>🏫</Text>
            </View>
            <Text style={styles.title}>Jenjang Pendidikan</Text>
            <Text style={styles.subtitle}>
              Pilih jenjang pendidikanmu saat ini untuk menyesuaikan materi.
            </Text>
          </View>

          {/* Level Cards Grid */}
          <View style={styles.grid}>
            {LEVELS.map((level) => (
              <LevelCard
                key={level.id}
                level={level}
                isSelected={selected === level.id}
                onPress={() => setSelected(level.id)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* CTA Area */}
      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            !selected && styles.primaryBtnDisabled,
            pressed && selected && { opacity: 0.85, transform: [{ scale: 0.98 }] }
          ]}
          onPress={handleNext}
          disabled={!selected}
        >
          <Text style={styles.primaryBtnText}>Lanjutkan →</Text>
        </Pressable>
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
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xl, // Sedikit dikurangi agar tidak terlalu jauh ke bawah
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconContainer: {
    width: 80, // Dikecilkan sedikit agar lebih proporsional
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.skySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.5, // Memberikan kesan tipografi yang lebih rapat dan modern
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  grid: {
    width: '100%',
    gap: Spacing.md,
    paddingBottom: Spacing.xxl, // Memberi ruang ekstra di bawah saat di-scroll
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, // Dibuat lebih membulat (xl) agar lebih soft
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Memisahkan emoji/label dengan deskripsi
    borderWidth: 1.5, // Dibuat 1.5 agar tidak terlalu tebal/kasar
    borderColor: Colors.border,
    ...Shadows.sm,
  },
  cardSelected: {
    backgroundColor: Colors.primarySoft,
    borderColor: Colors.primary,
    ...Shadows.md, // Shadow lebih tebal saat dipilih agar seolah 'mengambang'
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardEmoji: {
    fontSize: 26,
    marginRight: Spacing.md,
  },
  cardLabel: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  cardLabelSelected: {
    color: Colors.primary,
  },
  cardDesc: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  cardDescSelected: {
    color: Colors.primaryDark,
  },
  bottom: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl, // Menambah area bawah aman untuk HP modern (notch/home bar)
    paddingTop: Spacing.md,
    backgroundColor: Colors.background, // Memastikan background solid jika tertumpuk scroll
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
    backgroundColor: Colors.border, // Pakai warna border/abu-abu agar jelas tidak bisa diklik
    opacity: 1,
    ...Shadows.none, // Hilangkan bayangan saat nonaktif
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
    textAlign: 'center',
  },
});