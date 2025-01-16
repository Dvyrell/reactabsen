import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const SplashScreen = ({ navigation }: { navigation: any }) => {
  useEffect(() => {
    // Navigasi otomatis ke LoginMenu setelah 3 detik
    const timer = setTimeout(() => {
      navigation.replace('LoginMenu'); // Ganti halaman ke LoginMenu
    }, 3000);

    // Membersihkan timer jika komponen dihentikan
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/logo.png')} style={styles.logo} />
      <Text style={styles.appName}>SiHadir</Text>
      <Text style={styles.subtitle}>App Absensi Sekolah</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2B7267',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  appName: {
    fontSize: 30,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    color: '#FFFFFF',
  },
});

export default SplashScreen;

