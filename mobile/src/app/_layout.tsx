import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, Redirect, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSession } from '@/lib/auth-client';

export const unstable_settings = {
  anchor: '(tabs)',
};

function LoadingScreen() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#0a7ea4" />
    </View>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const { data: session, isPending } = useSession();
  const segments = useSegments();

  // Show loading screen while checking session
  if (isPending) {
    return (
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <LoadingScreen />
        <StatusBar style="auto" />
      </ThemeProvider>
    );
  }

  const inAuthGroup = segments[0] === '(auth)';

  // Handle redirects using Redirect component (safer than router.replace)
  // Redirect to login if not authenticated and not in auth group
  if (!session && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  // Redirect to main app if authenticated but in auth group
  if (session && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
