import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

// Ekstraksi komponen fitur agar lebih rapi
const FeatureItem = ({ icon, text, delay }) => {
  const slideAnim = useRef(new Animated.Value(20)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        delay: delay, // Waktu tunda kemunculan
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        delay: delay,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={[styles.featureItem, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <Text style={styles.featureIcon}>{icon}</Text>
      <Text style={styles.featureText}>{text}</Text>
    </Animated.View>
  );
};

export default function WelcomeScreen() {
  const router = useRouter();
  
  // Animasi untuk elemen utama (Header)
  const headerOpacity = useRef(new Animated.Value(0)).current;
  const headerScale = useRef(new Animated.Value(0.9)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(headerOpacity, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(headerScale, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        
        {/* Header Section dengan Animasi Fade & Scale */}
        <Animated.View style={[styles.headerSection, { opacity: headerOpacity, transform: [{ scale: headerScale }] }]}>
          <View style={styles.iconContainer}>
            <Text style={styles.heroEmoji}>📚</Text>
          </View>

          <Text style={styles.appName}>TugasKu</Text>
          <View style={styles.divider} />

          <Text style={styles.tagline}>
            Catat semua tugas sekolahmu{'\n'}dengan mudah! ✨
          </Text>

          <Text style={styles.subtitle}>
            Atur jadwal, pantau progres, dan jangan pernah{'\n'}
            lupa mengerjakan tugas lagi.
          </Text>
        </Animated.View>

        {/* Features Section dengan Staggered Animation */}
        <View style={styles.features}>
          <FeatureItem icon="📝" text="Catat tugas dengan mudah" delay={300} />
          <FeatureItem icon="🔔" text="Pengingat waktu otomatis" delay={500} />
          <FeatureItem icon="✅" text="Pantau progres belajarmu" delay={700} />
        </View>

      </View>

      {/* CTA Area */}
      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }
          ]}
          onPress={() => router.push('/(onboarding)/name')}
        >
          <Text style={styles.primaryBtnText}>Mulai Perjalanan →</Text>
        </Pressable>

        <Text style={styles.hint}>Langkah 1 dari 4</Text>
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
  headerSection: {
    alignItems: 'center',
    width: '100%',
  },
  iconContainer: {
    width: 100, // Disamakan ukurannya dengan halaman lain
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl, // Sedikit dikurangi agar proporsional
    ...Shadows.md,
  },
  heroEmoji: {
    fontSize: 48, // Disesuaikan dengan wadahnya
  },
  appName: {
    fontSize: FontSize.hero,
    fontWeight: '900', // Ditebalkan sedikit untuk kesan logo
    color: Colors.primary,
    letterSpacing: -1.5, // Lebih rapat agar terlihat bold
    marginBottom: Spacing.sm,
  },
  divider: {
    width: 50,
    height: 5,
    borderRadius: 3,
    backgroundColor: Colors.coral,
    marginBottom: Spacing.xl,
  },
  tagline: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: Spacing.md,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.md,
  },
  features: {
    gap: Spacing.md,
    width: '100%', // Memastikan kotak fitur meregang dengan baik
    maxWidth: 300, // Membatasi lebar agar tidak terlalu panjang di layar tablet/besar
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.xl, // Dibuat lebih membulat
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)',
    ...Shadows.sm,
  },
  featureIcon: {
    fontSize: 22,
    marginRight: Spacing.md,
  },
  featureText: {
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    fontWeight: '600', // Ditebalkan sedikit agar lebih terbaca
  },
  bottom: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl, // Ruang aman bawah (Notch)
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