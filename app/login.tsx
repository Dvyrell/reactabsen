import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import axios from 'axios';

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const apiHost = 'https://104e-114-5-222-198.ngrok-free.app';
  const apiLink = apiHost + '/api/login';
  
  const router = useRouter();

  const storeUserData = async (userData, userClass, userToken) => {
      try {
          await AsyncStorage.multiSet([
              ['userData', JSON.stringify(userData)],  // Store user data as JSON string
              ['userClass', JSON.stringify(userClass)], // Store class info as JSON string
              ['userToken', userToken] // Store token as a string
          ]);
          console.log('User data stored successfully!');
      } catch (error) {
          console.error('Error storing user data:', error);
      }
  };

  // Fungsi Login
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email dan password harus diisi');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(apiLink, {
        email: email.toLowerCase().trim(),
        password: password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      // Log the response for debugging
      // console.log('API Response:', response.data);

      // Check if response.data exists and has the expected structure
      if (response.data) {
        // Assuming the API returns { user: { role: 'guru' | 'siswa', ... } }
        // or directly returns { role: 'guru' | 'siswa', ... }
        const userRole = response.data.users.role;
        
        console.log('Request login success.');
        console.log('User Role:', userRole);

        if (userRole === 'guru') {
            storeUserData(response.data.users, response.data.class_id, response.data.token);
            router.replace('/guru/DashboardGuru');
        } else if (userRole === 'siswa') {
            storeUserData(response.data.users, response.data.class_id, response.data.token);
            router.replace('/siswa/DashboardSiswa');
        } else {
            console.log('Invalid Role Value:', userRole);
            Alert.alert('Error', `Role tidak valid: ${userRole}`);
        }
      } else {
        Alert.alert('Error', 'Data login tidak valid');
      }
    } catch (error) {
      let errorMessage = 'Terjadi kesalahan saat login';
      
      // Log the full error for debugging
      // console.error('Full error:', error);
      // console.error('Error response:', error.response?.data);
      
      if (error.response) {
        switch (error.response.status) {
          case 401:
            errorMessage = 'Email atau password salah';
            break;
          case 404:
            errorMessage = 'User tidak ditemukan';
            break;
          case 500:
            errorMessage = 'Server error, silakan coba lagi nanti';
            break;
          // default:
            // errorMessage = `Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`;
        }
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        editable={!loading}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        editable={!loading}
      />
      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Login...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontFamily: 'comBold',
    color: '#2A8579',
    textAlign: 'left',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    borderColor: '#CCCCCC',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#2A8579',
    paddingVertical: 15,
    paddingHorizontal: 140,
    borderRadius: 8,
  },
  buttonDisabled: {
    backgroundColor: '#88B4AE',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default LoginScreen;