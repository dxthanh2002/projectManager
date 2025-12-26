import { Tabs } from 'expo-router';
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { HapticTab } from '@/components/haptic-tab';
import { AppHeader } from '@/components/AppHeader';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <View style={styles.container}>
      {/* Custom Header - Slack style */}
      <AppHeader />

      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarStyle: {
            paddingTop: 8,
            paddingBottom: 8,
            height: 60,
          },
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: '500',
          },
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "home" : "home-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'Tasks',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "checkbox-marked-circle" : "checkbox-marked-circle-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="members"
          options={{
            title: 'Team',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "account-group" : "account-group-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Activity',
            tabBarIcon: ({ color, focused }) => (
              <MaterialCommunityIcons
                name={focused ? "bell" : "bell-outline"}
                size={26}
                color={color}
              />
            ),
          }}
        />
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
