import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { getUser } from '@/utils/storage';
import { Colors } from '@/constants/theme';

// Context so child screens (e.g. ready.tsx) can tell the root layout
// that onboarding is finished without a full AsyncStorage round-trip.
interface AppContextType {
  completeOnboarding: () => void;
}
const AppContext = createContext<AppContextType>({ completeOnboarding: () => {} });
export const useAppContext = () => useContext(AppContext);

export default function RootLayout() {
  const [isReady, setIsReady] = useState(false);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    checkOnboardingStatus();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inOnboarding = segments[0] === '(onboarding)';

    if (!isOnboarded && !inOnboarding) {
      router.replace('/(onboarding)/welcome');
    } else if (isOnboarded && inOnboarding) {
      router.replace('/(tabs)');
    }
  }, [isReady, isOnboarded, segments]);

  async function checkOnboardingStatus() {
    const user = await getUser();
    setIsOnboarded(!!user?.onboarded);
    setIsReady(true);
  }

  // Called by the ready screen after saving the user profile
  const completeOnboarding = useCallback(() => {
    setIsOnboarded(true);
  }, []);

  if (!isReady) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <AppContext.Provider value={{ completeOnboarding }}>
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
