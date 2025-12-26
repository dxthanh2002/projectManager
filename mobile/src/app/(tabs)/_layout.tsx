import { Tabs, useRouter } from 'expo-router';
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Modal, Pressable, SafeAreaView } from 'react-native';
import { Portal } from 'react-native-paper';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { AppHeader } from '@/components/AppHeader';
import { TeamDrawer } from '@/components/TeamDrawer';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [drawerVisible, setDrawerVisible] = useState(false);

  const openDrawer = useCallback(() => setDrawerVisible(true), []);
  const closeDrawer = useCallback(() => setDrawerVisible(false), []);

  return (
    <View style={styles.container}>
      {/* Custom Header with Menu Button */}
      <AppHeader onMenuPress={openDrawer} showMenu={true} />

      {/* Tab Navigator */}
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="rectangle.grid.1x2.fill" color={color} />,
          }}
        />
        <Tabs.Screen
          name="tasks"
          options={{
            title: 'My Tasks',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="checklist" color={color} />,
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            title: 'Alerts',
            tabBarIcon: ({ color }) => <IconSymbol size={28} name="bell.fill" color={color} />,
          }}
        />
      </Tabs>

      {/* Drawer Modal */}
      <Portal>
        <Modal
          visible={drawerVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={closeDrawer}
        >
          <View style={styles.drawerOverlay}>
            <Pressable style={styles.drawerBackdrop} onPress={closeDrawer} />
            <SafeAreaView style={styles.drawerContent}>
              <TeamDrawer onClose={closeDrawer} />
            </SafeAreaView>
          </View>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawerOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  drawerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  drawerContent: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '75%',
    maxWidth: 300,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
});
