import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Switch,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addTask, Task } from '@/utils/storage';
import { scheduleTaskReminder } from '@/utils/notifications';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';
import { id as idLocale } from 'date-fns/locale';

export default function AddTaskScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState(new Date(Date.now() + 24 * 60 * 60 * 1000)); // tomorrow
  const [reminder, setReminder] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [saving, setSaving] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      // Preserve existing time, update date
      const newDeadline = new Date(deadline);
      newDeadline.setFullYear(selectedDate.getFullYear());
      newDeadline.setMonth(selectedDate.getMonth());
      newDeadline.setDate(selectedDate.getDate());
      setDeadline(newDeadline);

      // On Android, show time picker next
      if (Platform.OS === 'android') {
        setTimeout(() => setShowTimePicker(true), 300);
      }
    }
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (event.type === 'set' && selectedTime) {
      const newDeadline = new Date(deadline);
      newDeadline.setHours(selectedTime.getHours());
      newDeadline.setMinutes(selectedTime.getMinutes());
      setDeadline(newDeadline);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Oops!', 'Judul tugas tidak boleh kosong ya');
      return;
    }

    if (deadline <= new Date()) {
      Alert.alert('Perhatian', 'Tenggat waktu harus di masa depan');
      return;
    }

    setSaving(true);

    try {
      const taskId = `task_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

      let notificationId: string | null = null;
      if (reminder) {
        notificationId = await scheduleTaskReminder(title.trim(), deadline);
        if (!notificationId) {
          Alert.alert(
            'Info',
            'Pengingat tidak dapat dijadwalkan. Pastikan notifikasi diizinkan di pengaturan perangkatmu.'
          );
        }
      }

      const newTask: Task = {
        id: taskId,
        title: title.trim(),
        description: description.trim(),
        deadline: deadline.toISOString(),
        reminder,
        completed: false,
        notificationId: notificationId || undefined,
        createdAt: new Date().toISOString(),
      };

      await addTask(newTask);

      // Reset form
      setTitle('');
      setDescription('');
      setDeadline(new Date(Date.now() + 24 * 60 * 60 * 1000));
      setReminder(false);

      Alert.alert(
        'Berhasil!',
        `Tugas "${newTask.title}" berhasil ditambahkan.`,
        [
          {
            text: 'Lihat Daftar Tugas',
            onPress: () => router.navigate('/(tabs)'),
          },
          { text: 'Tambah Lagi', style: 'cancel' },
        ]
      );
    } catch (error) {
      Alert.alert('Gagal', 'Terjadi kesalahan saat menyimpan tugas. Coba lagi ya.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Ionicons name="create-outline" size={32} color={Colors.primary} />
            </View>
            <Text style={styles.headerTitle}>Tugas baru nih!</Text>
            <Text style={styles.headerSubtitle}>
              Isi detailnya biar nggak lupa ya
            </Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            {/* Title */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="pencil-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.label}>Judul Tugas</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Mau ngerjain apa hari ini?"
                placeholderTextColor={Colors.textMuted}
                value={title}
                onChangeText={setTitle}
                maxLength={100}
              />
            </View>

            {/* Description */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="document-text-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.label}>Deskripsi</Text>
              </View>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Ceritain detail tugasnya di sini... (opsional)"
                placeholderTextColor={Colors.textMuted}
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={500}
              />
            </View>

            {/* Deadline */}
            <View style={styles.field}>
              <View style={styles.labelRow}>
                <Ionicons name="calendar-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                <Text style={styles.label}>Tenggat waktunya kapan nih?</Text>
              </View>
              <TouchableOpacity
                style={styles.dateBtn}
                onPress={() => setShowDatePicker(true)}
                activeOpacity={0.7}
              >
                <View style={styles.dateRow}>
                  <Ionicons name="calendar" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.dateText}>
                    {format(deadline, 'EEEE, d MMMM yyyy', { locale: idLocale })}
                  </Text>
                </View>
                <View style={styles.dateRow}>
                  <Ionicons name="time-outline" size={18} color={Colors.primary} style={{ marginRight: 8 }} />
                  <Text style={styles.timeText}>
                    {format(deadline, 'HH:mm')} WIB
                  </Text>
                </View>
              </TouchableOpacity>

              {Platform.OS === 'ios' && (
                <DateTimePicker
                  value={deadline}
                  mode="datetime"
                  display="spinner"
                  onChange={(event, date) => {
                    if (date) setDeadline(date);
                  }}
                  minimumDate={new Date()}
                  locale="id"
                  style={styles.iosPicker}
                />
              )}
            </View>

            {/* Date Picker (Android) */}
            {showDatePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={deadline}
                mode="date"
                display="default"
                onChange={onDateChange}
                minimumDate={new Date()}
              />
            )}

            {/* Time Picker (Android) */}
            {showTimePicker && Platform.OS === 'android' && (
              <DateTimePicker
                value={deadline}
                mode="time"
                display="default"
                onChange={onTimeChange}
                is24Hour
              />
            )}

            {/* Reminder Toggle */}
            <View style={styles.field}>
              <View style={styles.switchRow}>
                <View style={styles.switchLabel}>
                  <View style={styles.labelRow}>
                    <Ionicons name="notifications-outline" size={16} color={Colors.primary} style={{ marginRight: 6 }} />
                    <Text style={styles.label}>Ingatkan Saya</Text>
                  </View>
                  <Text style={styles.switchHint}>
                    Biar nggak kelewat tenggat waktunya
                  </Text>
                </View>
                <Switch
                  value={reminder}
                  onValueChange={setReminder}
                  trackColor={{
                    false: Colors.border,
                    true: Colors.primaryLight,
                  }}
                  thumbColor={reminder ? Colors.primary : Colors.textMuted}
                />
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Save Button */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={saving}
          >
            <Ionicons
              name={saving ? 'hourglass-outline' : 'checkmark-circle'}
              size={22}
              color={Colors.white}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.saveBtnText}>
              {saving ? 'Menyimpan...' : 'Simpan Tugas'}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.xxxl,
    paddingBottom: Spacing.xl,
  },
  headerIconContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  headerSubtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  form: {
    gap: Spacing.xxl,
  },
  field: {},
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.md,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  textArea: {
    minHeight: 110,
    paddingTop: Spacing.lg,
  },
  dateBtn: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: Spacing.sm,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  timeText: {
    fontSize: FontSize.sm,
    color: Colors.primary,
    fontWeight: '600',
  },
  iosPicker: {
    height: 160,
    marginTop: Spacing.sm,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  switchLabel: {
    flex: 1,
    marginRight: Spacing.md,
  },
  switchHint: {
    fontSize: FontSize.xs,
    color: Colors.textMuted,
    marginTop: 4,
    marginLeft: 22,
  },
  bottom: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxl,
    paddingTop: Spacing.md,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    ...Shadows.lg,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: FontSize.lg,
    fontWeight: '700',
  },
});
