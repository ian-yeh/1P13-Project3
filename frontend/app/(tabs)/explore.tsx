import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getEvents } from '@/api/api';
import { useUser } from '@/store/useStore';

interface BackendEvent {
  name: string;
  date: string;
  location?: string;
  arrival_time?: string;
  departure_time?: string;
}

async function insertIntoGoogleCalendar(token: string, ev: BackendEvent) {
  let startDate = new Date(ev.arrival_time || ev.date);
  let endDate = new Date(ev.departure_time || ev.date);

  if (endDate <= startDate) {
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  }

  const res = await fetch(
    "https://www.googleapis.com/calendar/v3/calendars/351ee7846ff13923dc09b40377d0e5e0a731cc2f7c5c99113c343d4154000170@group.calendar.google.com/events",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        summary: ev.name,
        location: ev.location,
        start: { dateTime: startDate.toISOString() },
        end: { dateTime: endDate.toISOString() },
      }),
    }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Google Calendar API error: ${JSON.stringify(err)}`);
  }
}

async function syncBackendEvents(token: string, userId: string) {
  const list: BackendEvent[] = await getEvents(userId);
  console.log(`Syncing ${list.length} events...`);

  let success = 0;
  let failed = 0;

  for (const ev of list) {
    try {
      await insertIntoGoogleCalendar(token, ev);
      success++;
    } catch (err) {
      console.warn(`Failed to insert "${ev.name}" at ${ev.location}:`, err);
      failed++;
    }
  }

  console.log(`Sync complete: ${success} inserted, ${failed} failed`);
}

GoogleSignin.configure({
  webClientId: '48917778841-n64b7ricc7kun7o528oi1qijgfk9p3a7.apps.googleusercontent.com',
  scopes: [
    'https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/calendar',
    'openid',
  ],
});

const signIn = async (): Promise<string | null> => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn(); // This throws if user cancels or 403
    if (!response) return null;

    const tokens = await GoogleSignin.getTokens(); // Only called if signIn succeeded
    return tokens.accessToken;
  } catch (error) {
    console.error('Google Sign-In error:', error);
    return null;
  }
};

export default function ExploreScreen() {
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const userId = useUser((state) => state.userId);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      setSyncing(true);
      const token = await signIn();
      if (token) {
        await syncBackendEvents(token, userId);
        setSynced(true);
      }
      setSyncing(false);
    })();
  }, [userId]);

  return (
    <ThemedView style={styles.background}>
      <ThemedText type="title" style={styles.headerText}>Calendar</ThemedText>
      <ThemedText style={styles.statusText}>
        {syncing ? 'Syncing events...' : synced ? 'Events synced ✓' : ''}
      </ThemedText>
      <ThemedView style={styles.topbox}>
        <ThemedView style={styles.container}>
          <WebView
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            style={styles.webview}
            source={{ uri: 'https://calendar.google.com/calendar/embed?src=351ee7846ff13923dc09b40377d0e5e0a731cc2f7c5c99113c343d4154000170%40group.calendar.google.com&ctz=America%2FToronto' }} />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#9676E5' },
  headerText: {
    fontFamily: Fonts.rounded,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: '10%',
    fontSize: 60,
    padding: 20,
    height: 100,
  },
  statusText: {
    color: '#ffffff',
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 8,
  },
  topbox: {
    marginTop: 40,
    backgroundColor: '#9676E5',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
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
  webview: { flex: 1 },
});