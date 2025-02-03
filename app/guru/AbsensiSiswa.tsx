import React, { useState, useRef, useEffect } from 'react'; 
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput, Keyboard } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { Alert } from 'react-native';

const DaftarAbsensi = () => {
  const [selectedKelas, setSelectedKelas] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({});
  const [statusNotes, setStatusNotes] = useState({});  
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [currentStudentId, setCurrentStudentId] = useState(null);
  const [tempNote, setTempNote] = useState(''); 
  const [classData, setClassData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [attendanceData, setAttendanceData] = useState([]);
  const searchInputRef = useRef(null);
  const apiHost = 'https://104e-114-5-222-198.ngrok-free.app';
  const apiLink = apiHost + '/api/getClasses';
  const apiattendLink = apiHost + '/api/getClassAttendances';
  const apiUpdateAttendance = apiHost + '/api/test';

  useEffect(() => {
    fetchClassData();
  }, []);

  useEffect(() => {
    if (showStatusModal && currentStudentId) {
      setTempNote(statusNotes[currentStudentId] || '');
    }
  }, [showStatusModal, currentStudentId]);

  const fetchClassData = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(apiLink);
      
      if (response.data.success) {
        setClassData(response.data.data);
      } else {
        console.error('Failed to fetch class data:', response.data.message);
      }
    } catch (error) {
      console.error('Error fetching class data:', error.response?.data || error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const fetchAttendanceData = async (classId) => {
    try {
        setIsLoading(true);

        const requestBody = {
            class_id: classId,
            date: new Date().toISOString().split('T')[0],
        };

        const response = await axios.post(apiattendLink, requestBody, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            timeout: 10000,
        });

        console.log('data absen : ',JSON.stringify(response.data.data.attendances, null, 2));
        
        const responseData = response.data.data.attendances;
        if (Array.isArray(responseData)) {
            setAttendanceData(responseData);
            
            // Initialize selectedStatus with current attendance statuses
            const initialStatus = {};
            const initialNotes = {};
            responseData.forEach(student => {
                initialStatus[student.User_Id] = student.Attendance_Status;
                if (student.Attendance_description) {
                    initialNotes[student.User_Id] = student.Attendance_description;
                }
            });
            setSelectedStatus(initialStatus);
            setStatusNotes(initialNotes);
        } else {
            console.error('Invalid response format:', responseData);
            Alert.alert('Error', 'Unexpected response format received from API');
        }

    } catch (error) {
        console.error('Full Error Object:', JSON.stringify(error, null, 2));

        if (error.response) {
            console.error('Error Response Data:', error.response.data);
            Alert.alert(
                'API Error',
                `Status ${error.response.status}: ${JSON.stringify(error.response.data)}`
            );
        } else if (error.request) {
            console.error('No response received:', error.request);
            Alert.alert(
                'Network Error',
                'No response received from server. Check your internet connection.'
            );
        } else {
            console.error('Error Message:', error.message);
            Alert.alert('Request Error', `Error: ${error.message}`);
        }
    } finally {
        setIsLoading(false);
    }
  };

  const kelasData = classData.map(kelas => kelas.class_name);

  const filteredKelas = kelasData.filter(kelas =>
    kelas.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getCurrentClass = () => {
    return classData.find(kelas => kelas.class_name === selectedKelas);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus({
      ...selectedStatus,
      [currentStudentId]: status,
    });
    
    // Update the attendanceData when status changes
    const updatedAttendanceData = attendanceData.map(student => {
      if (student.User_Id === currentStudentId) {
        return {
          ...student,
          Attendance_Status: status,
          Attendance_description: tempNote.trim()
        };
      }
      return student;
    });
    
    setAttendanceData(updatedAttendanceData);
    console.log('Updated Attendance Data:', JSON.stringify(updatedAttendanceData, null, 2));
    
    if (status === 'Izin' || status === 'Sakit') {
      setStatusNotes({
        ...statusNotes,
        [currentStudentId]: tempNote.trim()
      });
    } else {
      const { [currentStudentId]: removedNote, ...remainingNotes } = statusNotes;
      setStatusNotes(remainingNotes);
    }
    
    setShowStatusModal(false);
  };

  const renderStatus = (studentId) => {
    const status = selectedStatus[studentId] || 'Hadir';
    const note = statusNotes[studentId];
    
    if ((status === 'Izin' || status === 'Sakit') && note) {
      return `${status}`;
    }
    return status;
  };

  const handleKelasSelect = (kelas) => {
    setSelectedKelas(kelas);
    setSearchQuery(kelas);
    setShowSearchResults(false);
    setSelectedStatus({});
    setStatusNotes({});
    
    const selectedClassData = classData.find(c => c.class_name === kelas);
    if (selectedClassData?.id) {
      fetchAttendanceData(selectedClassData.id);
    }
    
    Keyboard.dismiss();
  };

  const handleStatusPress = (studentId) => {
    Keyboard.dismiss();
    if (searchInputRef.current) {
      searchInputRef.current.blur();
    }
    setCurrentStudentId(studentId);
    setTempNote(statusNotes[studentId] || '');
    setShowStatusModal(true);
  };

  const submitAttendanceUpdates = async () => {
    try {
      const currentClass = getCurrentClass();
      if (!currentClass?.id) {
        Alert.alert('Error', 'No class selected');
        return;
      }

      // Prepare the attendance data for submission
      const updatedAttendances = attendanceData.map(student => ({
        attendance_id: student.Attendance_Id,
        user_id: student.User_Id,
        status: selectedStatus[student.User_Id] || student.Attendance_Status,
        description: statusNotes[student.User_Id] || student.Attendance_description || ''
      }));

      console.log('Submitting attendance updates:', JSON.stringify(updatedAttendances, null, 2));

      const response = await axios.post(apiUpdateAttendance, {
        class_id: currentClass.id,
        attendances: updatedAttendances
      }, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (response.data.success) {
        Alert.alert('Success', 'Attendance updated successfully');
        // Refresh attendance data after successful update
        fetchAttendanceData(currentClass.id);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update attendance');
      }

    } catch (error) {
      console.error('Error submitting attendance:', error);
      Alert.alert(
        'Error',
        error.response?.data?.message || 'Failed to update attendance'
      );
    }
  };

  // console.log('attendance data : ', attendanceData);
  
  
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
          <Text style={styles.selectedClassSubText}>
            ID Kelas: {getCurrentClass()?.id}
          </Text>
        </View>
      )}

      {/* Student List or Loading/Empty State */}
      {isLoading ? (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>Loading...</Text>
        </View>
      ) : !selectedKelas ? (
        <View style={styles.emptyStateContainer}>
          <Ionicons 
            name="search-circle-outline" 
            size={80} 
            color="#2A8579" 
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateText}>
            Silahkan pilih kelas terlebih dahulu
          </Text>
          <Text style={styles.emptyStateSubText}>
            Gunakan kolom pencarian di atas untuk memilih kelas
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.studentList}>
          <View style={styles.studentItemm}>
            <Text style={styles.studentNumber}>No</Text>
            <Text style={styles.studentName}>Nama</Text>
            <Text style={styles.statusButt}>Status</Text>
          </View>
          
          {attendanceData.length > 0 ? (
              attendanceData.map((student, index) => (
                  <View key={student.Attendance_Id} style={styles.studentItem}>
                      <Text style={styles.studentNumber}>{index + 1}</Text>
                      <Text style={styles.studentName}>{student.Student_Name}</Text>
                      <TouchableOpacity
                          style={styles.statusButton}
                          onPress={() => handleStatusPress(student.User_Id)}
                      >
                          <Text style={styles.statusText}>
                              {renderStatus(student.User_Id)}
                          </Text>
                          <Ionicons name="chevron-down" size={20} color="#fff" />
                      </TouchableOpacity>
                  </View>
              ))
          ) : (
              <Text >No attendance data available.</Text>
          )}

        </ScrollView>
      )}

      {/* Status Modal */}
      <Modal
        visible={showStatusModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowStatusModal(false);
          Keyboard.dismiss();
        }}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => {
            setShowStatusModal(false);
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
                  onChangeText={(text) => setTempNote(text)}
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
        onPress={submitAttendanceUpdates}
      >
        <Text style={styles.enterButtonText}>Simpan</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity 
        style={styles.enterButton}
        onPress={async () => {
          try {
            const currentClass = getCurrentClass();
            if (!currentClass?.id) return;

            const attendancePayload = {
              class_id: currentClass.id,
              attendance_data: Object.entries(selectedStatus).map(([studentId, status]) => ({
                student_id: studentId,
                status,
                note: statusNotes[studentId] || ''
              }))
            };

            console.log('Submitting attendance data:', attendancePayload);
            
            Add your API call to submit attendance data here
            const response = await fetch(submitAttendanceEndpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(attendancePayload)
            });

            Keyboard.dismiss();
          } catch (error) {
            console.error('Error submitting attendance:', error);
          }
        }}
      >
        <Text style={styles.enterButtonText}>Simpan</Text>
      </TouchableOpacity> */}
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
  selectedClassSubText: {
    fontFamily: 'conReg',
    fontSize: 14,
    color: '#666',
    marginTop: 4,
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
    // padding: 20,
    paddingLeft : 20,
    paddingRight : 20,
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