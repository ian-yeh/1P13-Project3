import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { View } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          height: 80,
          paddingBottom: 20,
          paddingHorizontal: 70,
        }
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: 5, paddingBottom: 2 }}>
              <IconSymbol size={28} name="house.fill" color={color} />
            </View>),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Calendar',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: 5, paddingBottom: 2 }}>
              <IconSymbol size={28} name="calendar" color={color} />
            </View>),
        }}
      />
      <Tabs.Screen
        name="setting"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => (
            <View style={{ marginTop: 5, paddingBottom: 2 }}>
              <IconSymbol size={28} name="seal" color={color} />
            </View>),
        }}

      />
    </Tabs >
  );
}
