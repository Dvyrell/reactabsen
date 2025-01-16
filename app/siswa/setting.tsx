import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router'; 

const SettingScreen = () => {
    const router = useRouter(); 
    const handleLogout = () => {
      Alert.alert('Logout', 'Are you sure you want to logout?', [
        {text: 'Batal', style: 'cancel'},
        {text: 'Logout', onPress: logout},
      ]);
    }

    const logout = () => {
      router.replace('/login');
    }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Setting</Text>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
        //   source={require('./assets/profile.png')}
          style={styles.profileImage}
        />
        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Farrell</Text>
          <Text style={styles.profileRole}>User</Text>
        </View>
      </View>

      {/* Menu Settings */}
      <View style={styles.menuContainer}>
        {/* Log out */}
        <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
          <View style={styles.menuLeft}>
            <Ionicons name="log-out-outline" size={24} color="#FF0000" />
            <Text style={styles.logoutText}>Log out</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 16,
    paddingTop: 50,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 25,
    fontWeight: '600',
    fontFamily: 'comBold',
    color: '#2A8579',
  },
  profileSection: {
    flexDirection: 'row',
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#E5E5E5',
  },
  profileInfo: {
    marginLeft: 15,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2A8579',
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  menuContainer: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#2A8579',
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: '#FF0000',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E5E5',
  },
  navItem: {
    alignItems: 'center',
    padding: 8,
  },
  navText: {
    fontSize: 12,
    marginTop: 4,
    color: '#2A8579',
  },
  activeNavText: {
    fontWeight: '600',
  },
});

export default SettingScreen;