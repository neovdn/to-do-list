import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
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

  const getDeadlineLabel = () => {
    if (isToday(deadlineDate)) return 'Hari ini';
    if (isTomorrow(deadlineDate)) return 'Besok';
    return format(deadlineDate, 'd MMM yyyy, HH:mm', { locale: id });
  };

  const getDeadlineColor = () => {
    if (completed) return Colors.success;
    if (isOverdue) return Colors.danger;
    if (isToday(deadlineDate)) return Colors.amber;
    return Colors.primary;
  };

  return (
    <View style={[styles.card, completed && styles.cardCompleted]}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => onToggleComplete(taskId)}
        activeOpacity={0.7}
      >
        {/* Checkbox */}
        <View
          style={[
            styles.checkbox,
            completed && styles.checkboxChecked,
          ]}
        >
          {completed && (
            <Ionicons name="checkmark" size={16} color={Colors.white} />
          )}
        </View>

        {/* Content */}
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

          <View style={styles.metaRow}>
            {/* Deadline badge */}
            <View
              style={[
                styles.badge,
                { backgroundColor: getDeadlineColor() + '18' },
              ]}
            >
              <View style={styles.badgeContent}>
                <Ionicons
                  name="time-outline"
                  size={12}
                  color={getDeadlineColor()}
                  style={{ marginRight: 3 }}
                />
                <Text style={[styles.badgeText, { color: getDeadlineColor() }]}>
                  {getDeadlineLabel()}
                </Text>
              </View>
            </View>

            {/* Reminder indicator */}
            {reminder && (
              <View style={[styles.badge, { backgroundColor: Colors.skySoft }]}>
                <View style={styles.badgeContent}>
                  <Ionicons
                    name="notifications-outline"
                    size={12}
                    color={Colors.sky}
                    style={{ marginRight: 3 }}
                  />
                  <Text style={[styles.badgeText, { color: Colors.sky }]}>
                    Pengingat
                  </Text>
                </View>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      {/* Delete button */}
      <TouchableOpacity
        style={styles.deleteBtn}
        onPress={() => onDelete(taskId)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="trash-outline" size={18} color={Colors.danger} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    ...Shadows.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardCompleted: {
    backgroundColor: Colors.successSoft,
    borderColor: Colors.mint + '40',
    opacity: 0.85,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    marginTop: 2,
  },
  checkboxChecked: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: 2,
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
    gap: Spacing.xs,
  },
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: BorderRadius.full,
  },
  badgeContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
  },
  deleteBtn: {
    position: 'absolute',
    top: Spacing.md,
    right: Spacing.md,
  },
});
