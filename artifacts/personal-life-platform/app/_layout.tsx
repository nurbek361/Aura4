import React, { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { LifeProvider } from '@/context/LifeContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: 'Назад', headerTintColor: '#E1E2EC', headerTitleStyle: { fontWeight: '700' }, headerStyle: { backgroundColor: '#0B0E15' }, headerShadowVisible: false, contentStyle: { backgroundColor: '#10131A' } }}>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="settings" options={{ presentation: 'card' }} />
      <Stack.Screen name="surahs" options={{ presentation: 'card' }} />
      <Stack.Screen name="reminders" options={{ presentation: 'card' }} />
      <Stack.Screen name="calendar" options={{ presentation: 'card' }} />
      <Stack.Screen name="shopping" options={{ presentation: 'card' }} />
      <Stack.Screen name="debts" options={{ presentation: 'card' }} />
      <Stack.Screen name="subscriptions" options={{ presentation: 'card' }} />
      <Stack.Screen name="payments" options={{ presentation: 'card' }} />
      <Stack.Screen name="achievements" options={{ presentation: 'card' }} />
      <Stack.Screen name="music" options={{ presentation: 'card', title: 'Музыка' }} />
      <Stack.Screen name="movies" options={{ presentation: 'card', title: 'Кино' }} />
      <Stack.Screen name="movie/[id]" options={{ presentation: 'card', title: 'Фильм' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <LifeProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <KeyboardProvider>
                <RootLayoutNav />
              </KeyboardProvider>
            </GestureHandlerRootView>
          </LifeProvider>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
