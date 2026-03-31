import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import { WebView } from 'react-native-webview';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Fonts } from '@/constants/theme';
import { useState, useEffect } from 'react';
import { getEvents } from '@/api/api';
import { useUser } from '@/store/useStore';

const CALENDAR_ID = process.env.EXPO_PUBLIC_GOOGLE_CALENDAR_ID || '';
const ACCESS_TOKEN = process.env.EXPO_PUBLIC_GOOGLE_OAUTH_TOKEN || '';

interface BackendEvent {
  name: string;
  date: string;
  location?: string;
  arrival_time?: string;
  departure_time?: string;
}

async function getExistingEvents(token: string): Promise<Set<string>> {
  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events?maxResults=2500`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  if (!res.ok) {
    const err = await res.text();
    console.error('Failed to fetch existing events:', err);
    return new Set();
  }
  const data = await res.json();
  // Build a set of "title|startISO" keys to check for duplicates
  const keys = new Set<string>();
  for (const item of data.items || []) {
    const start = item.start?.dateTime || item.start?.date || '';
    keys.add(`${item.summary}|${start}`);
  }
  return keys;
}

async function insertIntoGoogleCalendar(token: string, ev: BackendEvent) {
  let startDate = new Date(ev.arrival_time || ev.date);
  let endDate = new Date(ev.departure_time || ev.date);

  if (endDate <= startDate) {
    endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
  }

  const res = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(CALENDAR_ID)}/events`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
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
    const err = await res.text();
    throw new Error(`Calendar API error: ${err}`);
  }
}

async function syncBackendEvents(token: string, userId: string) {
  const [list, existingKeys] = await Promise.all([
    getEvents(userId) as Promise<BackendEvent[]>,
    getExistingEvents(token),
  ]);

  console.log(`Fetched ${list.length} events from DB`);
  console.log(`Found ${existingKeys.size} existing calendar events`);

  let success = 0;
  let skipped = 0;
  let failed = 0;

  for (const ev of list) {
    try {
      let startDate = new Date(ev.arrival_time || ev.date);
      let endDate = new Date(ev.departure_time || ev.date);
      if (endDate <= startDate) {
        endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
      }

      const dupKey = `${ev.name}|${startDate.toISOString()}`;
      if (existingKeys.has(dupKey)) {
        console.log(`Skipping duplicate: ${ev.name} at ${ev.location}`);
        skipped++;
        continue;
      }

      await insertIntoGoogleCalendar(token, ev);
      existingKeys.add(dupKey); // prevent dupes within same sync
      success++;
    } catch (err) {
      console.warn(`Failed: ${ev.name} at ${ev.location}:`, err);
      failed++;
    }
  }

  console.log(`Sync complete: ${success} inserted, ${skipped} skipped, ${failed} failed`);
}

GoogleSignin.configure({
  webClientId: '48917778841-pkre4vjbug3u4i3vrveok241jocfj9m3.apps.googleusercontent.com',
  iosClientId: '48917778841-pkre4vjbug3u4i3vrveok241jocfj9m3.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/calendar.events',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
  ],
});

const signIn = async (): Promise<string | null> => {
  try {
    await GoogleSignin.hasPlayServices();
    const response = await GoogleSignin.signIn();
    if (response) {
      const tokens = await GoogleSignin.getTokens();
      console.log('Access Token:', tokens.accessToken);
      return tokens.accessToken;
    }
  } catch (error) {
    console.error('Detailed Login Error:', error);
  }
  return null;
};

export default function ExploreScreen() {
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const userId = useUser((state) => state.userId);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      if (!userId) return;
      setSyncing(true);
      try {
        await syncBackendEvents(ACCESS_TOKEN, userId);
        setSynced(true);
      } catch (err) {
        console.error('Sync failed:', err);
      }
      setSyncing(false);
    })();
  }, [userId]);

  return (
    <View style={styles.background}>
      <View className="bg-[#9676E5] pt-16 pb-6 z-10">
        <Text className='text-white text-5xl font-bold mx-auto text-center mt-4'>Calendar</Text>

        <View className="bg-[#CDD3EF] mx-6 mt-6 p-4 rounded-xl flex-row justify-center items-center border border-[#8C6ED6]">
          {syncing ? (
            <>
              <ActivityIndicator color="#453B5F" />
              <Text className="text-[#453B5F] text-base font-semibold ml-3">Syncing events with Google...</Text>
            </>
          ) : synced ? (
            <Text className="text-[#453B5F] text-base font-bold">Google Calendar Sync Complete!</Text>
          ) : (
            <Text className="text-[#453B5F] text-base font-medium">Waiting to sync...</Text>
          )}
        </View>
      </View>

      <View style={styles.topbox}>
        <View style={styles.container}>
          <WebView
            userAgent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            style={styles.webview}
            source={{ uri: `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=America%2FToronto` }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#F0F2FA' },
  headerText: {
    fontFamily: 'System',
    textAlign: 'center',
    color: '#ffffff',
    marginTop: '10%',
    fontSize: 60,
    padding: 20,
    height: 100,
  },
  topbox: {
    marginTop: -20,
    paddingTop: 40,
    backgroundColor: '#F0F2FA',
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  container: {
    backgroundColor: '#ffffff',
    height: 550,
    width: 360,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#9676E5',
  },
  webview: { flex: 1 },
});