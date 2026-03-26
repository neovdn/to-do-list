import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUser, getUser } from '@/utils/storage';

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  // Tambahan state untuk mendeteksi apakah keyboard/input sedang aktif
  const [isFocused, setIsFocused] = useState(false);

  const handleNext = async () => {
    if (!name.trim()) return;
    const existing = await getUser();
    await saveUser({
      name: name.trim(),
      level: existing?.level || '',
      onboarded: false,
    });
    router.push('/(onboarding)/level');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
      >
        <View style={styles.content}>
          {/* Header Area */}
          <View style={styles.headerArea}>
            <View style={styles.iconContainer}>
              <Text style={styles.emoji}>👋</Text>
            </View>
            <Text style={styles.title}>Siapa namamu?</Text>
            <Text style={styles.subtitle}>
              Kami ingin kenal kamu lebih dekat agar pengalaman belajarmu lebih personal 😊
            </Text>
          </View>

          {/* Input Area dengan Dynamic Focus Styling */}
          <View style={styles.inputContainer}>
            <TextInput
              style={[
                styles.input,
                isFocused && styles.inputFocused // Efek menyala saat diklik
              ]}
              placeholder="Ketik namamu di sini..."
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoFocus
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              returnKeyType="next"
              onSubmitEditing={handleNext}
              selectionColor={Colors.primary} // Warna kursor menyesuaikan tema
            />
          </View>
        </View>

        {/* CTA Area */}
        <View style={styles.bottom}>
          <Pressable
            style={({ pressed }) => [
              styles.primaryBtn,
              !name.trim() && styles.primaryBtnDisabled,
              pressed && name.trim() && { opacity: 0.85, transform: [{ scale: 0.98 }] }
            ]}
            onPress={handleNext}
            disabled={!name.trim()}
          >
            <Text style={styles.primaryBtnText}>Lanjutkan →</Text>
          </Pressable>
          <Text style={styles.hint}>Langkah 2 dari 4</Text>
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
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center', // Tetap di tengah
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.huge, // Sedikit diangkat agar tidak menabrak keyboard
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: Spacing.xxl,
  },
  iconContainer: {
    width: 80, // Disamakan dengan LevelScreen agar konsisten
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.amberSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
    ...Shadows.sm,
  },
  emoji: {
    fontSize: 40,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
    letterSpacing: -0.5, // Tipografi rapat yang lebih modern
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.xl, // Dibuat lebih membulat (xl)
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    borderWidth: 1.5,
    borderColor: Colors.border, // Default abu-abu lembut
    ...Shadows.sm,
  },
  inputFocused: {
    borderColor: Colors.primary, // Berubah jadi warna utama saat diklik
    backgroundColor: Colors.primarySoft, // Opsional: Memberi hint warna tipis di background
    ...Shadows.md,
  },
  bottom: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxxl, // Ruang aman bawah
    paddingTop: Spacing.md,
    backgroundColor: Colors.background,
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
  primaryBtnDisabled: {
    backgroundColor: Colors.border, // Konsisten warna abu-abu mati
    opacity: 1,
    ...Shadows.none,
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