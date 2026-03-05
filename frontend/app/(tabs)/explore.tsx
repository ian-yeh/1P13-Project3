import { Image } from 'expo-image';
import { Platform, StyleSheet, StatusBar } from 'react-native';
import { WebView } from 'react-native-webview';

import { Collapsible } from '@/components/ui/collapsible';
import { ExternalLink } from '@/components/external-link';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Fonts } from '@/constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/hello-wave';

export default function TabTwoScreen() {
  return (
    <ThemedView style={styles.background}>
      <ThemedText type="title" style={styles.headerText}>Calendar</ThemedText>

      <ThemedView style={styles.topbox}>
        <ThemedView style={styles.container}>
          <WebView
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.51 Safari/537.36"
            style={styles.webview}
            source={{ uri: 'https://calendar.google.com/calendar/embed?src=351ee7846ff13923dc09b40377d0e5e0a731cc2f7c5c99113c343d4154000170%40group.calendar.google.com&ctz=America%2FToronto' }}
          />
        </ThemedView>
      </ThemedView>

    </ThemedView>

  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    backgroundColor: '#9676E5',
    color: "9676E5",
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  container: {
    backgroundColor: '#ffffff',
    height: 500,
    width: 350,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#9676E5',
  },
  headerText: {
    fontFamily: Fonts.rounded,
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 44,
    marginTop: 80
  },
  topbox: {
    marginTop: 40,
    backgroundColor: '#9676E5',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  }



});
