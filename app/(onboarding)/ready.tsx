import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated, Easing } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUser, getUser } from '@/utils/storage';
import { useAppContext } from '@/app/_layout';

export default function ReadyScreen() {
  const router = useRouter();
  const { completeOnboarding } = useAppContext();
  const [userName, setUserName] = useState('');

  // Setup Animasi Entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    loadName();
    
    // Menjalankan animasi saat halaman dimuat
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        easing: Easing.out(Easing.exp), // Efek melambat di akhir agar terlihat natural
        useNativeDriver: true,
      }),
    ]).start();
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
        
        {/* Konten Utama yang Dianimasikan */}
        <Animated.View 
          style={[
            styles.animatedWrapper, 
            { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
          ]}
        >
          {/* Celebration Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>🚀</Text>
          </View>

          <Text style={styles.title}>
            Siap menaklukkan{'\n'}tugasmu, {userName ? userName : 'Kawan'}? 💪
          </Text>

          <Text style={styles.subtitle}>
            Semua sudah disiapkan! Mulai catat dan atur{'\n'}
            tugas sekolahmu sekarang juga.
          </Text>

          {/* Motivational Cards */}
          <View style={styles.cards}>
            <View style={[styles.motivCard, { backgroundColor: Colors.coralSoft }]}>
              <View style={styles.motivIconWrapper}>
                <Text style={styles.motivEmoji}>💡</Text>
              </View>
              <Text style={styles.motivText}>
                "Sedikit-sedikit, lama-lama menjadi bukit"
              </Text>
            </View>
            
            <View style={[styles.motivCard, { backgroundColor: Colors.mintSoft }]}>
              <View style={styles.motivIconWrapper}>
                <Text style={styles.motivEmoji}>🌟</Text>
              </View>
              <Text style={styles.motivText}>
                Kerjakan tugasmu tepat waktu, raih prestasi!
              </Text>
            </View>
          </View>
        </Animated.View>

      </View>

      {/* CTA Area */}
      <View style={styles.bottom}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryBtn,
            pressed && { opacity: 0.85, transform: [{ scale: 0.98 }] }
          ]}
          onPress={handleStart}
        >
          <Text style={styles.primaryBtnText}>🎯 Mulai Sekarang</Text>
        </Pressable>

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
    paddingHorizontal: Spacing.xxl,
    justifyContent: 'center',
  },
  animatedWrapper: {
    alignItems: 'center',
  },
  iconContainer: {
    width: 100, // Disamakan ukurannya dengan halaman sebelumnya agar konsisten
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.primarySoft,
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
    textAlign: 'center',
    lineHeight: 38, // Diberi ruang bernapas lebih
    marginBottom: Spacing.sm,
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
  cards: {
    width: '100%',
    gap: Spacing.md,
  },
  motivCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
    borderRadius: BorderRadius.xl, // Dibuat lebih membulat
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.03)', // Border super tipis untuk dimensi
  },
  motivIconWrapper: {
    backgroundColor: Colors.white,
    padding: Spacing.sm,
    borderRadius: BorderRadius.lg,
    marginRight: Spacing.md,
    ...Shadows.sm, // Memberikan kedalaman pada icon
  },
  motivEmoji: {
    fontSize: 22,
  },
  motivText: {
    flex: 1,
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  bottom: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl, // Ruang aman bawah
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
    textAlign: 'center',
  },
});