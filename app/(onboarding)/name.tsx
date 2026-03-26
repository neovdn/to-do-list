import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, BorderRadius, FontSize, Shadows } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { saveUser, getUser } from '@/utils/storage';

export default function NameScreen() {
  const router = useRouter();
  const [name, setName] = useState('');

  const handleNext = async () => {
    if (!name.trim()) return;
    // Save name temporarily (will save level on next screen)
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
      >
        <View style={styles.content}>
          {/* Header */}
          <View style={styles.iconContainer}>
            <Text style={styles.emoji}>👋</Text>
          </View>

          <Text style={styles.title}>Siapa namamu?</Text>
          <Text style={styles.subtitle}>
            Kami ingin kenal kamu lebih dekat agar pengalaman belajarmu lebih personal 😊
          </Text>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ketik namamu di sini..."
              placeholderTextColor={Colors.textMuted}
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoFocus
              returnKeyType="next"
              onSubmitEditing={handleNext}
            />
          </View>
        </View>

        {/* CTA */}
        <View style={styles.bottom}>
          <TouchableOpacity
            style={[styles.primaryBtn, !name.trim() && styles.primaryBtnDisabled]}
            onPress={handleNext}
            activeOpacity={0.85}
            disabled={!name.trim()}
          >
            <Text style={styles.primaryBtnText}>Lanjutkan →</Text>
          </TouchableOpacity>

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
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: Colors.amberSoft,
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
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xxxl,
  },
  inputContainer: {
    width: '100%',
  },
  input: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    fontSize: FontSize.lg,
    color: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.primarySoft,
    ...Shadows.sm,
  },
  bottom: {
    paddingHorizontal: Spacing.xxl,
    paddingBottom: Spacing.xxl,
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
  primaryBtnDisabled: {
    backgroundColor: Colors.primaryLight,
    opacity: 0.6,
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
  },
});
