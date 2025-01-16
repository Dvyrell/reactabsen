import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DaftarAbsensi = () => {
  const [selectedKelas, setSelectedKelas] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [statusNotes, setStatusNotes] = useState({});  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [tempNote, setTempNote] = useState(''); 
  const searchInputRef = useRef(null);

  // Data kelas dan siswa
  const classData = {
    'XII - RPL - 1': [
      { id: 1, name: 'Aditya Pratama' },
      { id: 2, name: 'Budi Santoso' },
      { id: 3, name: 'Citra Dewi' },
      { id: 4, name: 'Dian Kusuma' },
    ],
    'XII - RPL - 2': [
      { id: 1, name: 'Eko Widodo' },
      { id: 2, name: 'Fajar Ramadhan' },
      { id: 3, name: 'Gita Purnama' },
      { id: 4, name: 'Hadi Nugroho' },
    ],
    'XII - RPL - 3': [
      { id: 1, name: 'Indah Permata' },
      { id: 2, name: 'Joko Susilo' },
      { id: 3, name: 'Kartika Sari' },
      { id: 4, name: 'Lutfi Rahman' },
    ],
    'XII - RPL - 4': [
      { id: 1, name: 'Maya Angelina' },
      { id: 2, name: 'Nanda Prasetya' },
      { id: 3, name: 'Oktavia Putri' },
      { id: 4, name: 'Putra Wijaya' },
    ],
    'XII - RPL - 5': [
      { id: 1, name: 'Qori Handayani' },
      { id: 2, name: 'Rahmat Hidayat' },
      { id: 3, name: 'Sinta Dewi' },
      { id: 4, name: 'Tono Saputra' },
    ],
  };

  // Get list of all class names
  const kelasData = Object.keys(classData);

  // Filter kelas based on search query
  const filteredKelas = kelasData.filter(kelas =>
    kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get current students based on selected class
  const currentStudents = selectedKelas ? classData[selectedKelas] : [];

  
  const handleStatusChange = (status) => {
    setSelectedStatus({
      ...selectedStatus,
      [currentStudentId]: status,
    });
    
    // Only save note if status is 'Izin' or 'Sakit' and there's a note
    if ((status === 'Izin' || status === 'Sakit') && tempNote.trim()) {
      setStatusNotes({
        ...statusNotes,
        [currentStudentId]: tempNote.trim()
      });
    }
    
    // Reset temporary note
    setTempNote('');
    setShowStatusModal(false);
    Keyboard.dismiss();
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
  };

  // Function to render the status with note if available
  const renderStatus = (studentId) => {
    const status = selectedStatus[studentId] || 'Status';
    const note = statusNotes[studentId];
    
    if ((status === 'Izin' || status === 'Sakit') && note) {
      return `${status} (${note})`;
    }
    return status;
  };


  const handleKelasSelect = (kelas) => {
    setSelectedKelas(kelas);
    setSearchQuery(kelas);
    setShowSearchResults(false);
    // Reset status when changing class
    setSelectedStatus({});
    Keyboard.dismiss();
  };

  const handleStatusPress = (studentId) => {
    Keyboard.dismiss();
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    setCurrentStudentId(studentId);
    setShowStatusModal(true);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Absensi</Text>
      </View>
      
      {/* Search Section */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchTitle}>Silahkan memilih kelas!</Text>
        <View style={styles.searchBoxContainer}>
          <View style={styles.searchInputContainer}>
            <Ionicons 
              name="search" 
              size={24} 
              color="#2A8579" 
              style={styles.searchIcon}
            />
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

      {/* Selected Class Display */}
      {selectedKelas && (
        <View style={styles.selectedClassContainer}>
          <Text style={styles.selectedClassText}>Kelas: {selectedKelas}</Text>
        </View>
      )}

       {/* Student List */}
       <ScrollView style={styles.studentList}>
        <View style={styles.studentItemm}>
          <Text style={styles.studentNumber}>No</Text>
          <Text style={styles.studentName}>Nama</Text>
          <Text style={styles.statusButt}>Status</Text>
        </View>
        
        {selectedKelas ? (
          currentStudents.map((student) => (
            <View key={student.id} style={styles.studentItem}>
              <Text style={styles.studentNumber}>{student.id}</Text>
              <Text style={styles.studentName}>{student.name}</Text>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleStatusPress(student.id)}
              >
                <Text style={styles.statusText}>
                  {selectedStatus[student.id] || 'Status'}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#fff" />
              </TouchableOpacity>
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
              Silahkan pilih kelas terlebih dahulu untuk melihat daftar siswa
            </Text>
            <Text style={styles.emptyStateSubText}>
              Gunakan kolom pencarian di atas untuk memilih kelas
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Status Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowStatusModal(false);
          setTempNote('');
          Keyboard.dismiss();
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowStatusModal(false);
            setTempNote('');
            Keyboard.dismiss();
          }}
        >
          <View style={styles.modalContent}>
            {['Hadir', 'Sakit', 'Izin', 'Alpha'].map((status) => (
              <TouchableOpacity
                key={status}
                style={styles.modalItem}
                onPress={() => {
                  if (status === 'Izin' || status === 'Sakit') {
                    // Don't close modal yet if Izin or Sakit is selected
                    setSelectedStatus({
                      ...selectedStatus,
                      [currentStudentId]: status,
                    });
                  } else {
                    handleStatusChange(status);
                  }
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedStatus[currentStudentId] === status && styles.selectedStatusText
                ]}>
                  {status}
                </Text>
              </TouchableOpacity>
            ))}
            
            {/* Conditional Note Input */}
            {selectedStatus[currentStudentId] && 
            (selectedStatus[currentStudentId] === 'Izin' || 
              selectedStatus[currentStudentId] === 'Sakit') && (
              <View style={styles.noteContainer}>
                <Text style={styles.noteLabel}>Keterangan:</Text>
                <TextInput
                  style={styles.noteInput}
                  value={tempNote}
                  onChangeText={setTempNote}
                  placeholder="Masukkan keterangan..."
                  multiline={true}
                  numberOfLines={3}
                />
                <TouchableOpacity
                  style={styles.submitButton}
                  onPress={() => handleStatusChange(selectedStatus[currentStudentId])}
                >
                  <Text style={styles.submitButtonText}>Simpan</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Footer Button */}
      <TouchableOpacity 
        style={styles.enterButton}
        onPress={() => Keyboard.dismiss()}
      >
        <Text style={styles.enterButtonText}>Enter</Text>
      </TouchableOpacity>
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
    fontSize: 25,
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
    paddingBottom: 0,
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
    marginLeft: 10,
    fontFamily: 'conReg',
    color: '#2A8579',
  },
  studentItemHeader: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2A8579',
    backgroundColor: '#F6F6F6',
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
  noteContainer: {
    marginTop: 15,
    // borderTopWidth: 1,
    // borderTopColor: '#ddd',
    paddingTop: 10,
  },
  noteLabel: {
    fontSize: 16,
    color: '#2A8579',
    marginBottom: 8,
    fontFamily: 'conReg',
  },
  noteInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    minHeight: 80,
    textAlignVertical: 'top',
    fontFamily: 'conReg',
  },
  modalItemText: {
    color: '#2A8579',
    fontSize: 16,
    fontFamily: 'conReg',
  },
  selectedStatusText: {
    color: '#2A8579',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#2A8579',
    padding: 12,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontFamily: 'conReg',
  },
});

export default DaftarAbsensi;