import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUser, getTasks, updateTask, deleteTask, UserProfile, Task } from '@/utils/storage';
import { cancelTaskReminder } from '@/utils/notifications';
import TaskCard from '@/components/TaskCard';
import EmptyState from '@/components/EmptyState';

export default function DashboardScreen() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  async function loadData() {
    const [userData, taskData] = await Promise.all([getUser(), getTasks()]);
    setUser(userData);
    setTasks(taskData);
  }

  async function onRefresh() {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }

  // Greeting based on time of day
  function getGreeting(): { text: string; icon: keyof typeof Ionicons.glyphMap } {
    const hour = new Date().getHours();
    if (hour < 10) return { text: 'Selamat Pagi', icon: 'sunny-outline' };
    if (hour < 15) return { text: 'Selamat Siang', icon: 'sunny' };
    if (hour < 18) return { text: 'Selamat Sore', icon: 'partly-sunny-outline' };
    return { text: 'Selamat Malam', icon: 'moon-outline' };
  }

  function getLevelLabel(level: string): string {
    const map: Record<string, string> = {
      SD: 'Siswa SD',
      SMP: 'Siswa SMP',
      SMA: 'Siswa SMA',
      SMK: 'Siswa SMK',
      Mahasiswa: 'Mahasiswa',
    };
    return map[level] || level;
  }

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);
  const displayTasks = showCompleted ? completedTasks : activeTasks;

  async function handleToggleComplete(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;
    const updated = await updateTask(id, { completed: !task.completed });
    setTasks(updated);
  }

  async function handleDelete(id: string) {
    Alert.alert(
      'Hapus Tugas',
      'Yakin ingin menghapus tugas ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: async () => {
            const task = tasks.find((t) => t.id === id);
            if (task?.notificationId) {
              await cancelTaskReminder(task.notificationId);
            }
            const updated = await deleteTask(id);
            setTasks(updated);
          },
        },
      ]
    );
  }

  const greeting = getGreeting();

  const renderHeader = () => (
    <View style={styles.header}>
      {/* Greeting */}
      <View style={styles.greetingRow}>
        <View style={styles.greetingContent}>
          <View style={styles.greetingLine}>
            <Ionicons name={greeting.icon} size={18} color={Colors.amber} style={{ marginRight: 6 }} />
            <Text style={styles.greeting}>{greeting.text},</Text>
          </View>
          <Text style={styles.userName}>{user?.name || 'Teman'}</Text>
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{getLevelLabel(user?.level || '')}</Text>
          </View>
        </View>
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarEmoji}>
            {user?.name ? user.name[0].toUpperCase() : '?'}
          </Text>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: Colors.primarySoft }]}>
          <Text style={styles.statNumber}>{activeTasks.length}</Text>
          <Text style={styles.statLabel}>Tugas Aktif</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.mintSoft }]}>
          <Text style={styles.statNumber}>{completedTasks.length}</Text>
          <Text style={styles.statLabel}>Selesai</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: Colors.amberSoft }]}>
          <Text style={styles.statNumber}>{tasks.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
      </View>

      {/* Motivational Banner */}
      {activeTasks.length > 0 && (
        <View style={styles.motivBanner}>
          <View style={styles.motivContent}>
            <Ionicons name="flame-outline" size={18} color={Colors.coral} style={{ marginRight: 6 }} />
            <Text style={styles.motivText}>
              Semangat! Kamu punya {activeTasks.length} tugas yang menunggu.
            </Text>
          </View>
        </View>
      )}

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={[styles.filterTab, !showCompleted && styles.filterTabActive]}
          onPress={() => setShowCompleted(false)}
        >
          <View style={styles.filterContent}>
            <Ionicons
              name="list-outline"
              size={15}
              color={!showCompleted ? Colors.primary : Colors.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterText,
                !showCompleted && styles.filterTextActive,
              ]}
            >
              Aktif ({activeTasks.length})
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterTab, showCompleted && styles.filterTabActive]}
          onPress={() => setShowCompleted(true)}
        >
          <View style={styles.filterContent}>
            <Ionicons
              name="checkmark-circle-outline"
              size={15}
              color={showCompleted ? Colors.primary : Colors.textMuted}
              style={{ marginRight: 4 }}
            />
            <Text
              style={[
                styles.filterText,
                showCompleted && styles.filterTextActive,
              ]}
            >
              Selesai ({completedTasks.length})
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={displayTasks}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={
          <EmptyState
            type={
              tasks.length === 0
                ? 'all'
                : showCompleted
                ? 'completed'
                : 'active'
            }
          />
        }
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <TaskCard
              id={item.id}
              title={item.title}
              description={item.description}
              deadline={item.deadline}
              completed={item.completed}
              reminder={item.reminder}
              onToggleComplete={handleToggleComplete}
              onDelete={handleDelete}
            />
          </View>
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.primary}
            colors={[Colors.primary]}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  listContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.md,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  greetingContent: {
    flex: 1,
  },
  greetingLine: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greeting: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  userName: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  levelBadge: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  levelText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.primary,
  },
  avatarContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.md,
  },
  avatarEmoji: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.white,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  statLabel: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  motivBanner: {
    backgroundColor: Colors.coralSoft,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
  },
  motivContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  motivText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.coral,
    flex: 1,
  },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: 4,
    marginBottom: Spacing.md,
    ...Shadows.sm,
  },
  filterTab: {
    flex: 1,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    borderRadius: BorderRadius.sm,
  },
  filterTabActive: {
    backgroundColor: Colors.primarySoft,
  },
  filterContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  filterTextActive: {
    color: Colors.primary,
  },
  cardWrapper: {
    paddingHorizontal: Spacing.xl,
  },
});
