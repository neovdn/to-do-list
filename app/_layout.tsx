import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'; // 1. Import library splash screen
import { getUser } from '@/utils/storage';
import { Colors } from '@/constants/theme';

// Mencegah Splash Screen tertutup otomatis agar kita bisa kontrol durasinya
SplashScreen.preventAutoHideAsync();

interface AppContextType {
  completeOnboarding: () => void;
  resetOnboarding: () => void; 
}

const AppContext = createContext<AppContextType>({ 
  completeOnboarding: () => {},
  resetOnboarding: () => {} 
});

export const useAppContext = () => useContext(AppContext);

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  // Inisialisasi data dan pengaturan Splash Screen
  useEffect(() => {
    async function prepare() {
      try {
        // Cek status user dari storage
        const user = await getUser();
        setIsOnboarded(!!user?.onboarded);
        
        // BERI JEDA: Menahan splash screen selama 2 detik agar estetikanya terlihat
        await new Promise(resolve => setTimeout(resolve, 3000));
        
      } catch (e) {
        console.warn("Gagal memuat status onboarding:", e);
      } finally {
        // Tandai aplikasi siap dan sembunyikan Splash Screen
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  // Penjaga Pintu Navigasi
  useEffect(() => {
    if (!isReady) return;

    const inOnboarding = segments[0] === '(onboarding)';

    if (!isOnboarded && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (isOnboarded && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isReady, isOnboarded, segments]);

  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    setIsOnboarded(false);
  }, []);

  // Tampilan fallback (Loading Spinner) jika splash screen sudah hilang tapi navigasi belum selesai
  if (!isReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <AppContext.Provider value={{ completeOnboarding, resetOnboarding }}>
      <StatusBar style="dark" />
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: Colors.background },
          animation: 'slide_from_right',
        }}
      >
        <Stack.Screen name="(onboarding)" />
        <Stack.Screen name="(tabs)" />
      </Stack>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
});