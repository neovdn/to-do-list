import AsyncStorage from '@react-native-async-storage/async-storage';

// ---- Types ----

export interface UserProfile {
  name: string;
  level: string;
  onboarded: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  deadline: string; // ISO date string
  reminder: boolean;
  completed: boolean;
  notificationId?: string;
  createdAt: string;
}

// ---- Storage Keys ----

const USER_KEY = '@tugasku_user';
const TASKS_KEY = '@tugasku_tasks';

// ---- User Profile ----

export async function getUser(): Promise<UserProfile | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export async function saveUser(user: UserProfile): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
}

export async function clearUser(): Promise<void> {
  await AsyncStorage.removeItem(USER_KEY);
}

// ---- Tasks ----

export async function getTasks(): Promise<Task[]> {
  try {
    const raw = await AsyncStorage.getItem(TASKS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function saveTasks(tasks: Task[]): Promise<void> {
  await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
}

export async function addTask(task: Task): Promise<Task[]> {
  const tasks = await getTasks();
  tasks.unshift(task);
  await saveTasks(tasks);
  return tasks;
}

export async function updateTask(id: string, updates: Partial<Task>): Promise<Task[]> {
  const tasks = await getTasks();
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...updates };
  }
  await saveTasks(tasks);
  return tasks;
}

export async function deleteTask(id: string): Promise<Task[]> {
  let tasks = await getTasks();
  tasks = tasks.filter((t) => t.id !== id);
  await saveTasks(tasks);
  return tasks;
}

export async function clearAllData(): Promise<void> {
  await AsyncStorage.multiRemove([USER_KEY, TASKS_KEY]);
}

// ---- Logika Logout Terintegrasi ----

export async function logoutLocal() {
  try {
    // 1. Ambil data user yang ada
    const existing = await getUser();
    
    // 2. Reset status user (Onboarded jadi false dan kosongkan nama)
    if (existing) {
      await saveUser({ ...existing, onboarded: false, name: '', level: '' });
    }

    // 3. Hapus seluruh daftar tugas agar dashboard bersih (Penting!)
    await AsyncStorage.removeItem(TASKS_KEY);

  } catch (error) {
    console.error('Gagal melakukan logout lokal:', error);
  }
}