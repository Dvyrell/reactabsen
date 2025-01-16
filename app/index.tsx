import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';

const SplashScreen = () => {
  const router = useRouter();

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
