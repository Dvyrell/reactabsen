// DaftarAbsensiSiswa.tsx
import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const  DaftarAbsensiSiswa = () => {
  const [selectedKelas, setSelectedKelas] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchInputRef = useRef(null);

  // Data dummy absensi per tanggal dan kelas
  const absensiData = {
    'XII - RPL - 1': {
      '2025-01-06': [
        { id: 1, name: 'Aditya Pratama', status: 'Hadir' },
        { id: 2, name: 'Budi Santoso', status: 'Alpha' },
        { id: 3, name: 'Citra Dewi', status: 'Sakit' },
      ],
      '2025-01-07': [
        { id: 1, name: 'Aditya Pratama', status: 'Izin' },
        { id: 2, name: 'Budi Santoso', status: 'Hadir' },
        { id: 3, name: 'Citra Dewi', status: 'Hadir' },
      ],
    },
    'XII - RPL - 2': {
      '2025-01-06': [
        { id: 1, name: 'Eko Widodo', status: 'Hadir' },
        { id: 2, name: 'Fajar Ramadhan', status: 'Hadir' },
        { id: 3, name: 'Gita Purnama', status: 'Alpha' },
      ],
      '2025-01-07': [
        { id: 1, name: 'Eko Widodo', status: 'Sakit' },
        { id: 2, name: 'Fajar Ramadhan', status: 'Izin' },
        { id: 3, name: 'Gita Purnama', status: 'Hadir' },
      ],
    },
  };

  // Format tanggal ke string YYYY-MM-DD
  const formatDate = (date) => {
    return date.toISOString().split('T')[0];
  };

  // Daftar kelas
  const kelasData = Object.keys(absensiData);

  // Filter kelas berdasarkan search query
  const filteredKelas = kelasData.filter(kelas =>
    kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

    // Get data absensi berdasarkan kelas dan tanggal
    const getAbsensiData = () => {
        if (!selectedKelas) return [];
        
        const formattedDate = formatDate(selectedDate);
        return absensiData[selectedKelas]?.[formattedDate] || [];
    };
    

  const handleKelasSelect = (kelas) => {
    setSelectedKelas(kelas);
    setSearchQuery(kelas);
    setShowSearchResults(false);
  };

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Daftar Absensi Siswa</Text>
      </View>
  
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>Silahkan memilih kelas!</Text>
        <View style={styles.searchBoxContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons name="search" size={24} color="#2A8579" style={styles.searchIcon} />
            <TextInput
              ref={searchInputRef}
              style={styles.searchInput}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowSearchResults(true);
              }}
              placeholder="Cari kelas..."
              onFocus={() => setShowSearchResults(true)}
            />
          </View>
          {showSearchResults && searchQuery.length > 0 && (
            <View style={styles.searchResults}>
              {filteredKelas.map((kelas, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.searchResultItem}
                  onPress={() => handleKelasSelect(kelas)}
                >
                  <Text style={styles.searchResultText}>{kelas}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Date Picker Section */}
      <View style={styles.datePickerContainer}>
        <Text style={styles.searchTitle}>Silahkan memilih tanggal!</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowDatePicker(true)}
        >
          <Ionicons name="calendar-outline" size={24} color="#2A8579" />
          <Text style={styles.dateText}>
            {selectedDate.toLocaleDateString('id-ID')}
          </Text>
        </TouchableOpacity>
        {showDatePicker && (
          <DateTimePicker
            value={selectedDate}
            mode="date"
            onChange={handleDateChange}
          />
        )}
      </View>

      {/* Absensi List */}
      <ScrollView style={styles.studentList}>
        <View style={styles.studentItemHeader}>
          <Text style={styles.headerNo}>No</Text>
          <Text style={styles.headerNama}>Nama</Text>
          <Text style={styles.headerStatus}>Status</Text>
        </View>
        
        {selectedKelas ? (
          getAbsensiData().map((student) => (
            <View key={student.id} style={styles.studentItem}>
              <Text style={styles.studentNumber}>{student.id}</Text>
              <Text style={styles.studentName}>{student.name}</Text>
              <View style={[
                styles.statusIndicator,
                { backgroundColor: 
                  student.status === 'Hadir' ? '#4CAF50' :
                  student.status === 'Sakit' ? '#FFC107' :
                  student.status === 'Izin' ? '#2196F3' : '#F44336'
                }
              ]}>
                <Text style={styles.statusText}>{student.status}</Text>
              </View>
            </View>
          ))
        ) : (
            <View style={styles.emptyStateContainer}>
                <Ionicons 
                    name="search-circle-outline" 
                    size={80} 
                    color="#2A8579" 
                    style={styles.emptyStateIcon}
                />
                <Text style={styles.emptyStateText}>
                    Silahkan pilih kelas terlebih dahulu untuk melihat daftar absensi siswa
                </Text>
                <Text style={styles.emptyStateSubText}>
                    Gunakan kolom tanggal di atas untuk memilih tanggal yang ingin dilihat
                </Text>
            </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerContainer: {
    width: '100%',
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 23,
    paddingTop: 15,
    paddingBottom: 20,
    fontFamily: 'comBold',
    color: '#2A8579',
  },
  searchContainer: {
    padding: 20,
  },
  searchTitle: {
    fontFamily: 'conReg',
    fontSize: 18,
    color: '#2A8579',
    marginBottom: 10,
  },
  selectedClassContainer: {
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  selectedClassText: {
    fontFamily: 'conReg',
    fontSize: 16,
    color: '#2A8579',
    fontWeight: 'bold',
  },
  searchBoxContainer: {
    position: 'relative',
    zIndex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#F6F6F6',
    borderRadius: 5,
    height: 50,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    fontFamily: 'conReg',
  },
  searchIcon: {
    padding: 10,
  },
  searchResults: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    zIndex: 2,
  },
  searchResultItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  searchResultText: {
    fontFamily: 'conReg',
    color: '#2A8579',
  },
  studentList: {
    flex: 1,
    padding: 20,
  },
  studentItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  studentItemm: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#2A8579',
  },
  studentNumber: {
    width: 30,
    fontFamily: 'conReg',
    color: '#2A8579',
  },
  studentName: {
    flex: 1,
    marginLeft: 10,
    fontFamily: 'conReg',
    color: '#2A8579',
  },
  statusButton: {
    backgroundColor: '#2A8579',
    padding: 5,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    width: 75,
    justifyContent: 'space-evenly',
  },
  statusButt: {
    color: '#2A8579',
    padding: 5,
    fontFamily: 'conReg',
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  statusText: {
    color: '#fff',
    marginRight: 5,
  },
  enterButton: {
    backgroundColor: '#2A8579',
    padding: 15,
    margin: 20,
    borderRadius: 5,
    alignItems: 'center',
  },
  enterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '80%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  emptyStateIcon: {
    marginBottom: 20,
  },
  emptyStateText: {
    fontFamily: 'conReg',
    fontSize: 16,
    color: '#2A8579',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptyStateSubText: {
    fontFamily: 'conReg',
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  datePickerContainer: {
    padding: 20,
    paddingTop: -20,
    paddingBottom: -20,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dateText: {
    marginLeft: 20,
    fontFamily: 'conReg',
    color: '#2A8579',
  },
  studentItemHeader: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2A8579',
    backgroundColor: '#fff',
  },
  headerNo: {
    width: 40,
    fontFamily: 'conReg',
    color: '#2A8579',
    fontWeight: 'bold',
  },
  headerNama: {
    flex: 1,
    fontFamily: 'conReg',
    color: '#2A8579',
    fontWeight: 'bold',
  },
  headerStatus: {
    width: 80,
    fontFamily: 'conReg',
    color: '#2A8579',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  statusIndicator: {
    width: 80,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default DaftarAbsensiSiswa;