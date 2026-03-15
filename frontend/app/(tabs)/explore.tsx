import { StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Fonts } from '@/constants/theme';
import { useState, useEffect } from 'react';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { getEvents } from '@/api/api';


interface BackendEvent {
  name: string;
  date: string;
  location?: string;
  arrival_time?: string;
  departure_time?: string;
}

async function insertIntoGoogleCalendar(token: string, ev: BackendEvent) {
  const start = `${ev.date}T${ev.arrival_time ?? "00:00"}:00`;
  const end = `${ev.date}T${ev.departure_time ?? "23:59"}:00`;

  await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: ev.name,
      location: ev.location,
      start: { dateTime: start },
      end: { dateTime: end },
    }),
  });
}

async function syncBackendEvents(token: string, userId: string) {
  const r = await getEvents(userId);
  const list: BackendEvent[] = await r.json();
  for (const ev of list) {
    try {
      await insertIntoGoogleCalendar(token, ev);
    } catch (err) {
      ``
      console.warn("failed to insert event", ev, err);
    }
  }
}

GoogleSignin.configure({
  webClientId: '48917778841-pkre4vjbug3u4i3vrveok241jocfj9m3.apps.googleusercontent.com',
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

export default function TabTwoScreen() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const t = await signIn();
      if (t) {
        setToken(t);
        await syncBackendEvents(t, "1");
      }
    })();
  }, []);

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
  container: {
    backgroundColor: '#ffffff',
    height: '70%',
    width: '80%',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#9676E5',
  },
  headerText: {
    fontFamily: Fonts.rounded,
    textAlign: 'center',
    color: '#ffffff',
    marginTop: '10%',
    fontSize: 60,
    padding: 20,
    height: 100,
  },
  topbox: {
    backgroundColor: '#9676E5',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  webview: {
    flex: 1,
  }



});
