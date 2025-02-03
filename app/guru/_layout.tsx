import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const GuruLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: 'white',
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
        tabBarShowLabel: true,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="DashboardGuru"  // Sesuaikan dengan nama file DashboardGuru.tsx
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="AbsensiSiswa"  // Sesuaikan dengan nama file DaftarAbsensi.tsx
        options={{
          tabBarLabel: 'Absensi Siswa',
          tabBarIcon: ({ color }) => (
            <Ionicons name="school-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="DaftarAbsensi"  // Sesuaikan dengan nama file DaftarAbsensi.tsx
        options={{
          tabBarLabel: 'Daftar Absensi',
          tabBarIcon: ({ color }) => (
            <Ionicons name="list-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="setting"  // Sesuaikan dengan nama file setting.tsx
        options={{
          tabBarLabel: 'Setting',
          tabBarIcon: ({ color }) => (
            <Ionicons name="settings-outline" size={24} color={color} />
          ),
        }}
      /> 
    </Tabs>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#2A8579',
    height: 65,
    paddingBottom: 10,
    paddingTop: 5,
    borderTopWidth: 0,
  },
  tabLabel: {
    fontSize: 12,
    // paddingBottom: 10,
    fontFamily: 'comLight',
  },
});

export default GuruLayout;