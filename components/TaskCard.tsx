import React, { useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { format, isPast, isToday, isTomorrow } from 'date-fns';
import { id } from 'date-fns/locale';

interface TaskCardProps {
  id: string;
  title: string;
  description: string;
  deadline: string;
  completed: boolean;
  reminder: boolean;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({
  id: taskId,
  title,
  description,
  deadline,
  completed,
  reminder,
  onToggleComplete,
  onDelete,
}: TaskCardProps) {
  const deadlineDate = new Date(deadline);
  const isOverdue = isPast(deadlineDate) && !completed;

  // --- Animasi Bouncy ---
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleAnim, { toValue: 0.96, useNativeDriver: true }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, { toValue: 1, friction: 5, tension: 40, useNativeDriver: true }).start();
  };

  const getDeadlineLabel = () => {
    if (isToday(deadlineDate)) return 'Hari ini';
    if (isTomorrow(deadlineDate)) return 'Besok';
    return format(deadlineDate, 'd MMM yyyy, HH:mm', { locale: id });
  };

  const getDeadlineColor = () => {
    if (completed) return Colors.textMuted; // Jika selesai, warna abu-abu netral
    if (isOverdue) return Colors.danger;
    if (isToday(deadlineDate)) return Colors.amber;
    return Colors.primary;
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <Pressable
        style={[styles.card, completed && styles.cardCompleted]}
        onPress={() => onToggleComplete(taskId)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <View style={styles.cardInner}>
          {/* 1. Checkbox Bulat */}
          <View style={[styles.checkbox, completed && styles.checkboxChecked]}>
            {completed && <Ionicons name="checkmark" size={16} color={Colors.white} />}
          </View>

          {/* 2. Konten Utama */}
          <View style={styles.content}>
            <Text
              style={[styles.title, completed && styles.titleCompleted]}
              numberOfLines={1}
            >
              {title}
            </Text>
            
            {description ? (
              <Text
                style={[styles.description, completed && styles.descCompleted]}
                numberOfLines={2}
              >
                {description}
              </Text>
            ) : null}

            {/* Area Lencana (Badges) */}
            <View style={styles.metaRow}>
              <View
                style={[
                  styles.badge,
                  { backgroundColor: completed ? Colors.border : getDeadlineColor() + '15' }, // Transparansi 15 hex
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={getDeadlineColor()}
                  style={{ marginRight: 4 }}
                />
                <Text style={[styles.badgeText, { color: getDeadlineColor() }]}>
                  {getDeadlineLabel()}
                </Text>
              </View>

              {reminder && (
                <View style={[styles.badge, { backgroundColor: Colors.skySoft }]}>
                  <Ionicons name="notifications" size={12} color={Colors.sky} style={{ marginRight: 4 }} />
                  <Text style={[styles.badgeText, { color: Colors.sky }]}>Pengingat</Text>
                </View>
              )}
            </View>
          </View>

          {/* 3. Tombol Delete (Dipisah agar tidak tumpang tindih) */}
          <Pressable
            style={({ pressed }) => [
              styles.deleteBtn,
              pressed && { opacity: 0.5, backgroundColor: Colors.danger + '20' }
            ]}
            onPress={() => onDelete(taskId)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="trash-outline" size={20} color={completed ? Colors.textMuted : Colors.danger} />
          </Pressable>
        </View>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, // Melengkung mulus
    marginBottom: Spacing.md,
    borderWidth: 1.5, // Border agar tegas tapi elegan
    borderColor: 'transparent', // Default transparan (pakai shadow)
    ...Shadows.sm,
  },
  cardCompleted: {
    backgroundColor: Colors.background, // Meredup menyatu dengan background utama
    borderColor: Colors.border,
    ...Shadows.none, // Hilangkan shadow saat selesai agar terlihat 'tenggelam'
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'center', // Diubah menjadi center agar layout sejajar indah
    padding: Spacing.lg,
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 14, // Dibuat bulat sempurna (setengah dari ukuran)
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    backgroundColor: Colors.white,
  },
  checkboxChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  content: {
    flex: 1, // Mengisi sisa ruang agar tombol delete terdorong ke paling kanan
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
    lineHeight: 18,
  },
  descCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
  },
  deleteBtn: {
    padding: Spacing.sm,
    marginLeft: Spacing.sm,
    borderRadius: BorderRadius.full,
    backgroundColor: 'transparent',
  },
});