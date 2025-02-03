import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

  const getUserToken = async () => {
    try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
            console.log('User Token:', token);
            return token;
        } else {
            console.log('No token found');
            return null;
        }
    } catch (error) {
        console.error('Error retrieving token:', error);
        return null;
    }
  };

  const getUser = async () => {
    try {
        const userData = await AsyncStorage.getItem('userData');
        return userData ? JSON.parse(userData) : null;
    } catch (error) {
        console.error('Error retrieving user data:', error);
        return null;
    }
  };

  const checkUserAuth = async () => {
    try {
        const userToken = await getUserToken();
        if (!userToken) {
            console.log('No token found.');
            return;
        }

        const userData = await getUser();
        if (!userData) {
            console.log('User data not found.');
            return;
        }

        if (userData.role === 'guru') {
            router.replace('/guru/DashboardGuru');
        } else if (userData.role === 'siswa') {
            router.replace('/siswa/DashboardSiswa');
        } else {
            console.log('Unknown role, redirecting to login...');
            router.replace('/login');
        }
    } catch (error) {
        console.error('Error checking user auth:', error);
    }
};
``
checkUserAuth();

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/unnamed.png')} style={styles.logo} />
      <Text style={styles.title}>SiHadir</Text>
      <TouchableOpacity style={styles.button} onPress={() => router.replace('/login')}>
        <Text style={styles.buttonText}>Masuk</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 120,
    height: 165,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'comBold',
    color: '#2A8579',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#2A8579',
    paddingVertical: 15,
    paddingHorizontal: 120,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
