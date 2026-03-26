import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '@/constants/theme';

export default function OnboardingLayout() {
  return (
    <>
      {/* 1. Status Bar Immersive: Membuat tampilan menyatu sampai ke ujung atas layar */}
      <StatusBar style="dark" backgroundColor="transparent" translucent={true} />

      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { 
            backgroundColor: Colors.background 
          },
          // 2. Animasi Transisi: 'fade' memberikan efek perpindahan layar yang jauh lebih halus
          animation: 'fade', 
          // 3. Native Gesture: Mengizinkan pengguna melakukan swipe untuk kembali
          gestureEnabled: true,
          gestureDirection: 'horizontal',
        }}
      >
        {/* Opsional: Daftarkan screen jika butuh opsi spesifik per layar nantinya */}
        {/* <Stack.Screen name="index" /> */}
        {/* <Stack.Screen name="step-two" /> */}
      </Stack>
    </>
  );
}