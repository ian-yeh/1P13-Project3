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
import { GoogleSignin } from '@react-native-google-signin/google-signin';

import { Calendar } from 'react-native-calendars';
import { useState } from 'react';
import { useEffect } from 'react';



GoogleSignin.configure({
  webClientId: '48917778841-pkre4vjbug3u4i3vrveok241jocfj9m3.apps.googleusercontent.com',
  scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
});

const signIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();


    const response = await GoogleSignin.signIn();
    if (response.type === 'success') {
      const tokens = await GoogleSignin.getTokens();
      console.log("Access Token:", tokens.accessToken);
      return tokens.accessToken;
    } else {
      console.log("Sign in was cancelled or is already in progress");
    }
  } catch (error) {
    console.error("Detailed Login Error:", error);
  }
};

interface GoogleCalendarEvent {
  start: {
    date?: string;
    dateTime?: string;
  };
  summary?: string;
}

interface FormattedEvents {
  [date: string]: {
    marked: boolean;
    dotColor: string;
  };
}

const fetchCalendarEvents = async (accessToken: string): Promise<FormattedEvents> => {
  const response = await fetch(
    'https://www.googleapis.com/calendar/v3/calendars/primary/events',
    {
      headers: { Authorization: `Bearer ${accessToken}` },
    }
  );

  const data = await response.json();

  const formattedEvents: FormattedEvents = {};

  if (data.items) {
    data.items.forEach((event: GoogleCalendarEvent) => {
      const date = event.start.date || event.start.dateTime?.split('T')[0];
      if (date) {
        formattedEvents[date] = { marked: true, dotColor: '#9676E5' };
      }
    });
  }

  return formattedEvents;
};



export default function TabTwoScreen() {
  const [events, setEvents] = useState<FormattedEvents>({});

  useEffect(() => {
    (async () => {
      const token = await signIn();
      if (token) {
        const ev = await fetchCalendarEvents(token);
        setEvents(ev);
      }
    })();
  }, []);

  return (

    <ThemedView style={styles.background}>

      <SafeAreaView >
        <ThemedText type="title" style={styles.headerText}>Calendar</ThemedText>
      </SafeAreaView>

      <ThemedView style={styles.topbox}>

        <ThemedView style={styles.container}>
          <Calendar
            theme={{
              calendarBackground: '#ffffff',
              textSectionTitleColor: '#9676E5',
              selectedDayBackgroundColor: '#9676E5',
              todayTextColor: '#9676E5',
              arrowColor: '#9676E5',
            }}
            markedDates={events}
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
