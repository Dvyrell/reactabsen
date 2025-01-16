import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [fontLoaded, error] = useFonts({
    'comBold': require('../assets/fonts/Comfortaa-Bold.ttf'),
    'comLight': require('../assets/fonts/Comfortaa-Light.ttf'),
    'comMed': require('../assets/fonts/Comfortaa-Medium.ttf'),
    'comReg': require('../assets/fonts/Comfortaa-Regular.ttf'),
    'comSem': require('../assets/fonts/Comfortaa-SemiBold.ttf'),
    'conReg': require('../assets/fonts/ConcertOne-Regular.ttf'),
  });

  useEffect(() => {
    if (error) throw error;
    if (fontLoaded) SplashScreen.hideAsync();
  }, [fontLoaded, error]);

  if (!fontLoaded) return null;

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="guru" options={{ headerShown: false }} />
        <Stack.Screen name="siswa" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
