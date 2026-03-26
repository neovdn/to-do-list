import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '@/constants/theme';

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
    icon: 'clipboard-outline' as const,
    color: Colors.sky,
    bg: Colors.skySoft,
    title: 'Belum ada tugas selesai',
    subtitle: 'Selesaikan tugas pertamamu dengan mencentang checkbox!',
  },
};

export default function EmptyState({ type }: EmptyStateProps) {
  const cfg = iconConfig[type];

  return (
    <View style={styles.container}>
      <View style={[styles.iconCircle, { backgroundColor: cfg.bg }]}>
        <Ionicons name={cfg.icon} size={48} color={cfg.color} />
      </View>
      <Text style={styles.title}>{cfg.title}</Text>
      <Text style={styles.subtitle}>{cfg.subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.huge,
    paddingHorizontal: Spacing.xxl,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: FontSize.xl,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
});
