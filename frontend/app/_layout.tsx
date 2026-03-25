import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import './global.css';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  return (
    <ThemeProvider value={DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
        <Stack.Screen name="booking" options={{ headerShown: false, title: "Book a Ride" }} />
        <Stack.Screen name="voice" options={{ headerShown: true, title: "Voice Assistant" }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}
