import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const DashboardGuru = () => {
  const router = useRouter(); 

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>SiHadir</Text>
      </View>
      <Text style={styles.welcomeText}>Welcome, Farrell !</Text>

      {/* Content Container */}
      <View style={styles.contentContainer}>
        {/* Absensi Card */}
        <View style={styles.card}>
          <Image
            // source={require('../../assets/images/female.png')}
            style={styles.cardImage}
          />
          <Text style={styles.cardTitle}>Absensi murid terbaru</Text>
          <Text style={styles.cardSubtitle}>Lorem ipsum</Text>
        </View>

        {/* Menu Button */}
        <View style={styles.menuButton}>
          <Text style={styles.menuTitle}>Absensi Siswa</Text>
        </View>

        {/* Menu Items */}
        <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/siswa/DaftarAbsensi ')}>
          <View style={styles.menuIcon}>
            <Ionicons name="school-outline" size={24} color="#2A8579" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Absensi Siswa</Text>
            <Ionicons name="chevron-forward" size={20} color="#2A8579" />
          </View>
        </TouchableOpacity>
        
        {/* <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/guru/DaftarAbsensi')}>
          <View style={styles.menuIcon}>
            <Ionicons name="list-outline" size={24} color="#2A8579" />
          </View>
          <View style={styles.menuTextContainer}>
            <Text style={styles.menuText}>Daftar Absensi Siswa</Text>
            <Ionicons name="chevron-forward" size={20} color="#2A8579" />
          </View>
        </TouchableOpacity> */}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 25,
    paddingTop: 20,
    paddingBottom: 20,
    fontFamily: 'comBold',
    color: '#2A8579',
  },
  welcomeText: {
    fontSize: 20,
    color: '#2A8579',
    fontFamily: 'conReg',
    marginHorizontal: 16,
    marginTop: 8,
  },
  contentContainer: {
    padding: 16,
  },
  card: {
    backgroundColor: '#2A8579',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  cardImage: {
    width: 120,
    height: 120,
    alignSelf: 'flex-end',
    marginTop: -30,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 8,
  },
  cardSubtitle: {
    fontSize: 14,
    color: 'white',
    marginTop: 4,
  },
  menuButton: {
    backgroundColor: '#2A8579',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  menuTitle: {
    fontSize: 17,
    textAlign: 'center',
    fontFamily: 'conReg',
    fontWeight: '700',
    color: 'white',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F3F1',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuText: {
    fontSize: 14,
    color: '#2A8579',
    fontFamily: 'comReg',
  },
});

export default DashboardGuru;
