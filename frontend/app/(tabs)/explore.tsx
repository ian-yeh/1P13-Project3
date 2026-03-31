import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useState, useEffect } from 'react';
import { getEvents } from '@/api/api';
import { useUser } from '@/store/useStore';

const CALENDAR_ID = 'suerderin@gmail.com';
const ACCESS_TOKEN = 'ya29.a0Aa7MYio11LLWQuobWwnX8RepSwlrVOfc0QeRMLapzIbgpV30zTHcFbi7P-Kw8deK-c5U3z0fTIloc-yoUDeLeVLRbetNjMhC5SNtPUdGLcuwUIUmUnyQZJ8uNq__hg3GKdOgVEyooQBRzCm_1dKSsfi8pQ86UGHo2ek_vxuVsXyNh33ebX55sdJu4-Kr1bsOPoEWRHAaCgYKAbESARISFQHGX2Mi9v44ZvuiUiqFHYOgeY3J4Q0206';

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

export default function ExploreScreen() {
  const [synced, setSynced] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const userId = useUser((state) => state.userId);

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
            source={{ uri: `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(CALENDAR_ID)}&ctz=America%2FToronto` }}
          />
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, backgroundColor: '#9676E5' },
  headerText: {
    fontFamily: 'System',
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