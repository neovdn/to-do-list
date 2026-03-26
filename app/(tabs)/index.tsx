import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAppContext } from '@/app/_layout';
import { getUser, getTasks, updateTask, deleteTask, logoutLocal, UserProfile, Task } from '@/utils/storage';
import { cancelTaskReminder } from '@/utils/notifications';
import TaskCard from '@/components/TaskCard';
import EmptyState from '@/components/EmptyState';

export default function DashboardScreen() {
  const router = useRouter();
  const context = useAppContext(); // Memanggil "otak" aplikasi
  
  const [user, setUser] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // --- LOGIKA DATA ---
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

  // --- LOGIKA LOGOUT LOKAL (DIPERBARUI) ---
  async function handleLogout() {
    Alert.alert(
      'Keluar Aplikasi',
      'Yakin ingin keluar? Kamu harus memasukkan data dirimu lagi nanti.',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Keluar',
          style: 'destructive',
          onPress: async () => {
            // 1. Hapus data lokal di memori HP
            if (logoutLocal) {
              await logoutLocal();
            }
            
            // 2. Hapus memori di "Otak" Context agar pintu Welcome terbuka lagi
            if (context?.resetOnboarding) {
              context.resetOnboarding();
            }

            // 3. Lempar langsung ke welcome!
            router.replace('/(onboarding)/welcome');
          },
        },
      ]
    );
  }

  function getGreeting(): { text: string; icon: keyof typeof Ionicons.glyphMap } {
    const hour = new Date().getHours();
    if (hour < 10) return { text: 'Selamat Pagi', icon: 'sunny' };
    if (hour < 15) return { text: 'Selamat Siang', icon: 'sunny' };
    if (hour < 18) return { text: 'Selamat Sore', icon: 'partly-sunny' };
    return { text: 'Selamat Malam', icon: 'moon' };
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

  // --- HEADER (TOP SECTION + BANNER + FILTER) ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* 1. Header Putih Melengkung */}
      <View style={styles.topSection}>
        <View style={styles.greetingRow}>
          <View style={styles.greetingContent}>
            <View style={styles.greetingLine}>
              <Ionicons name={greeting.icon} size={20} color={Colors.amber} style={{ marginRight: 6 }} />
              <Text style={styles.greeting}>{greeting.text}</Text>
            </View>
            <Text style={styles.userName}>{user?.name ? `${user.name} 👋` : 'Hai Teman 👋'}</Text>
            
            {user?.level && (
               <View style={styles.levelBadge}>
                 <Text style={styles.levelText}>{getLevelLabel(user.level)}</Text>
               </View>
            )}
          </View>
          
          {/* TOMBOL LOGOUT (Avatar yang bisa diklik) */}
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={handleLogout}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarEmoji}>
              {user?.name ? user.name[0].toUpperCase() : '👤'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* 2. Panel Statistik Clean */}
        <View style={styles.statsPanel}>
          <View style={styles.statItem}>
            <View style={[styles.statIconBox, { backgroundColor: Colors.primarySoft }]}>
              <Ionicons name="document-text" size={20} color={Colors.primary} />
            </View>
            <View>
              <Text style={styles.statNumber}>{activeTasks.length}</Text>
              <Text style={styles.statLabel}>Aktif</Text>
            </View>
          </View>
          
          <View style={styles.statDivider} />

          <View style={styles.statItem}>
            <View style={[styles.statIconBox, { backgroundColor: Colors.mintSoft }]}>
              <Ionicons name="checkmark-done" size={20} color={Colors.mint} />
            </View>
            <View>
              <Text style={styles.statNumber}>{completedTasks.length}</Text>
              <Text style={styles.statLabel}>Selesai</Text>
            </View>
          </View>

          <View style={styles.statDivider} />

          <View style={styles.statItem}>
             <View style={[styles.statIconBox, { backgroundColor: Colors.skySoft }]}>
              <Ionicons name="apps" size={20} color={Colors.sky} />
            </View>
            <View>
              <Text style={styles.statNumber}>{tasks.length}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
          </View>
        </View>
      </View>

      {/* 3. Banner Motivasi Premium */}
      {activeTasks.length > 0 && (
        <View style={styles.motivBanner}>
          <View style={styles.motivIconWrapper}>
            <Ionicons name="flame" size={20} color={Colors.white} />
          </View>
          <Text style={styles.motivText}>
            Semangat! Ada <Text style={{fontWeight: '800', color: Colors.textPrimary}}>{activeTasks.length} tugas</Text> yang perlu diselesaikan.
          </Text>
        </View>
      )}

      {/* 4. Filter Tugas (Model Pill) */}
      <View style={styles.filterContainer}>
        <Text style={styles.sectionTitle}>Daftar Tugas</Text>
        
        <View style={styles.pillContainer}>
          <TouchableOpacity
            style={[styles.pill, !showCompleted && styles.pillActive]}
            onPress={() => setShowCompleted(false)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, !showCompleted && styles.pillTextActive]}>
              Aktif ({activeTasks.length})
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.pill, showCompleted && styles.pillActive]}
            onPress={() => setShowCompleted(true)}
            activeOpacity={0.8}
          >
            <Text style={[styles.pillText, showCompleted && styles.pillTextActive]}>
              Selesai ({completedTasks.length})
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />
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

// --- STYLE UI PREMIUM ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background, 
  },
  listContent: {
    paddingBottom: 120, 
  },
  headerContainer: {
    paddingBottom: Spacing.md,
  },
  
  // -- Top Section (Sapaan & Statistik) --
  topSection: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 36, 
    borderBottomRightRadius: 36,
    paddingHorizontal: Spacing.xl,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.04,
    shadowRadius: 15,
    elevation: 4, 
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  greetingContent: {
    flex: 1,
  },
  greetingLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  greeting: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  userName: {
    fontSize: 28, 
    fontWeight: '900', 
    color: Colors.textPrimary,
    letterSpacing: -1,
  },
  levelBadge: {
    backgroundColor: Colors.primarySoft,
    paddingHorizontal: Spacing.md,
    paddingVertical: 6,
    borderRadius: BorderRadius.full,
    alignSelf: 'flex-start',
    marginTop: Spacing.sm,
  },
  levelText: {
    fontSize: FontSize.xs,
    fontWeight: '700',
    color: Colors.primary,
    textTransform: 'uppercase', 
    letterSpacing: 1,
  },
  avatarContainer: {
    width: 60, 
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: Colors.primarySoft, 
    ...Shadows.md,
  },
  avatarEmoji: {
    fontSize: 26,
    color: Colors.white,
    fontWeight: '800',
  },

  // -- Stats Panel --
  statsPanel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.04)', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  statItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  statIconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statNumber: {
    fontSize: FontSize.lg,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 22,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  statDivider: {
    width: 1,
    height: 28,
    backgroundColor: Colors.border,
  },

  // -- Motivational Banner --
  motivBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.coralSoft,
    marginHorizontal: Spacing.xl,
    padding: Spacing.md,
    borderRadius: BorderRadius.xl,
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  motivIconWrapper: {
    backgroundColor: Colors.coral,
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  motivText: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    flex: 1,
    lineHeight: 20,
  },

  // -- Filter Area (Pill Design) --
  filterContainer: {
    paddingHorizontal: Spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSize.xl,
    fontWeight: '800',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  pillContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.04)', 
    borderRadius: BorderRadius.full,
    padding: 4,
  },
  pill: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: 8, 
    borderRadius: BorderRadius.full,
  },
  pillActive: {
    backgroundColor: Colors.white,
    ...Shadows.sm, 
  },
  pillText: {
    fontSize: FontSize.xs,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  pillTextActive: {
    color: Colors.primary,
    fontWeight: '800',
  },

  // -- Wrapper untuk List Kartu --
  cardWrapper: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: 4, 
  },
});