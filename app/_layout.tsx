import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import * as SplashScreen from 'expo-splash-screen'; 
import { getUser } from '@/utils/storage';
import { Colors } from '@/constants/theme';
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['expo-notifications']);

// Keep the splash screen visible while we fetch resources
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

  // 1. Logika Pemuatan Data (Fake Splash Screen)
  useEffect(() => {
    async function prepareData() {
      try {
        // Cek status user dari storage (proses asli)
        const user = await getUser();
        setIsOnboarded(!!user?.onboarded);
        
        // We no longer need the artificial 3-second delay, but testing with 1.5s purely for aesthetic transition
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (e) {
        console.warn("Gagal memuat data:", e);
      } finally {
        setIsReady(true);
      }
    }

    prepareData();
  }, []);

  // 2. Penjaga Pintu Navigasi (Sama seperti sebelumnya)
  useEffect(() => {
    if (!isReady) return;

    const inOnboarding = segments[0] === '(onboarding)';

    if (!isOnboarded && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (isOnboarded && inOnboarding) {
      router.replace('/(tabs)');
    }

    // Hide splash screen after navigation state has been set up
    setTimeout(async () => {
      await SplashScreen.hideAsync();
    }, 100);
  }, [isReady, isOnboarded, segments]);

  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
  }, []);

  const resetOnboarding = useCallback(() => {
    setIsOnboarded(false);
  }, []);

  return (
    <AppContext.Provider value={{ completeOnboarding, resetOnboarding }}>
      {/* StatusBar Utama Aplikasi */}
      <StatusBar style="dark" />
      
      {/* 3. LOGIKA RENDER UTAMA */}
      <View style={styles.container}>
        {/* Stack Navigator (Selalu dirender di belakang) */}
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
      </View>
    </AppContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Pastikan container utama full screen
  },
});