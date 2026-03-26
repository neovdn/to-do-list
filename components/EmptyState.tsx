import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, Shadows } from '@/constants/theme';

interface EmptyStateProps {
  type: 'active' | 'completed' | 'all';
}

const iconConfig = {
  all: {
    icon: 'document-text-outline' as const,
    color: Colors.primary,
    bg: Colors.primarySoft,
    title: 'Belum ada tugas',
    subtitle: 'Yuk mulai tambahkan tugas sekolahmu dengan menekan tombol + di bawah!',
  },
  active: {
    icon: 'trophy-outline' as const,
    color: Colors.amber,
    bg: Colors.amberSoft,
    title: 'Semua tugas selesai!',
    subtitle: 'Mantap! Kamu sudah menyelesaikan semua tugas. Istirahat dulu ya~',
  },
  completed: {
    icon: 'checkmark-circle-outline' as const, // Ganti icon agar lebih relevan
    color: Colors.mint || Colors.sky,
    bg: Colors.mintSoft || Colors.skySoft,
    title: 'Belum ada tugas selesai',
    subtitle: 'Selesaikan tugas pertamamu dengan mencentang bulatan di kiri tugas!',
  },
};

export default function EmptyState({ type }: EmptyStateProps) {
  const cfg = iconConfig[type];

  // Animasi Entrance
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  // Re-run animasi setiap kali tab/type berubah
  useEffect(() => {
    fadeAnim.setValue(0);
    slideAnim.setValue(30);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, [type]);

  return (
    <Animated.View 
      style={[
        styles.container, 
        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
      ]}
    >
      <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon} size={48} color={cfg.color} />
      </View>
      <Text style={styles.title}>{cfg.title}</Text>
      <Text style={styles.subtitle}>{cfg.subtitle}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.xxl,
    marginTop: Spacing.xl, // Sedikit diturunkan agar posisinya pas di tengah layar
  },
  iconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.md, // Efek shadow tipis pada icon
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});