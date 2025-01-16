import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';

const DaftarAbsensiSiswa = () => {
  const [filterType, setFilterType] = useState(null);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [showMonthModal, setShowMonthModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [absensiData, setAbsensiData] = useState(null);

  const filterTypes = [
    { label: 'Per Hari', value: 'daily' },
    { label: 'Per Bulan', value: 'monthly' }
  ];

  const months = [
    { label: 'Januari', value: '01' },
    { label: 'Februari', value: '02' },
    { label: 'Maret', value: '03' },
    { label: 'April', value: '04' },
    { label: 'Mei', value: '05' },
    { label: 'Juni', value: '06' },
    { label: 'Juli', value: '07' },
    { label: 'Agustus', value: '08' },
    { label: 'September', value: '09' },
    { label: 'Oktober', value: '10' },
    { label: 'November', value: '11' },
    { label: 'Desember', value: '12' }
  ];

  // Daftar hari libur nasional 2025 (contoh)
  const holidays = {
    '2025-01-01': 'Tahun Baru',
    '2025-01-02': 'Tahun Baru Imlek',
    '2025-03-11': 'Isra Miraj',
    '2025-03-29': 'Hari Raya Nyepi',
    '2025-03-31': 'Wafat Isa Almasih',
    '2025-04-10': 'Hari Raya Idul Fitri',
    '2025-04-11': 'Hari Raya Idul Fitri',
    '2025-05-01': 'Hari Buruh Internasional',
    '2025-05-15': 'Hari Raya Waisak',
    '2025-06-01': 'Hari Lahir Pancasila',
    '2025-06-17': 'Hari Raya Idul Adha',
    '2025-07-07': 'Tahun Baru Islam',
    '2025-08-17': 'Hari Kemerdekaan RI',
    '2025-09-25': 'Maulid Nabi Muhammad',
    '2025-12-25': 'Hari Raya Natal'
  };

  const isWeekday = (date) => {
    const day = new Date(date).getDay();
    return day !== 0 && day !== 6; // 0 = Minggu, 6 = Sabtu
  };

  const isHoliday = (dateStr) => {
    return holidays[dateStr];
  };

  const getDayName = (date) => {
    const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
    return days[new Date(date).getDay()];
  };

  useEffect(() => {
    const generateDummyData = () => {
      const studentInfo = {
        id: 1,
        name: 'Farrell'
      };
    
      const statusOptions = ['Hadir', 'Sakit', 'Izin', 'Alpha'];
      const dailyData = {};
      const monthlyData = {};
    
      for (let month = 1; month <= 12; month++) {
        const monthStr = month.toString().padStart(2, '0');
        monthlyData[monthStr] = [];
        
        const daysInMonth = new Date(2025, month, 0).getDate();
        
        for (let day = 1; day <= daysInMonth; day++) {
          const dateStr = `2025-${monthStr}-${day.toString().padStart(2, '0')}`;
          const date = new Date(dateStr);
          
          let status;
          if (!isWeekday(date)) {
            status = 'Libur'; // Weekend
          } else if (isHoliday(dateStr)) {
            status = 'Libur'; // Holiday
          } else {
            const randomIndex = Math.floor((day * month) % 4);
            status = statusOptions[randomIndex];
          }
          
          dailyData[dateStr] = {
            date: day,
            dayName: getDayName(date),
            status: status,
            holiday: isHoliday(dateStr)
          };

          monthlyData[monthStr].push({
            date: day,
            fullDate: dateStr,
            dayName: getDayName(date),
            status: status,
            holiday: isHoliday(dateStr)
          });
        }
      }
    
      return {
        studentInfo,
        daily: dailyData,
        monthly: monthlyData
      };
    };

    setAbsensiData(generateDummyData());
  }, []);

  const handleDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
    }
  };

  const CustomFilterDropdown = () => (
    <TouchableOpacity
      style={[styles.dropdownButton, styles.shadowEffect]}
      onPress={() => setShowFilterModal(true)}
    >
      <Text style={styles.dropdownButtonText}>
        {filterType ? filterTypes.find(f => f.value === filterType)?.label : 'Pilih Filter'}
      </Text>
      <Ionicons name="chevron-down" size={24} color="#2A8579" />
    </TouchableOpacity>
  );

  const CustomMonthDropdown = () => (
    <TouchableOpacity
      style={[styles.dropdownButton, styles.shadowEffect]}
      onPress={() => setShowMonthModal(true)}
    >
      <Text style={styles.dropdownButtonText}>
        {selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'Pilih Bulan'}
      </Text>
      <Ionicons name="chevron-down" size={24} color="#2A8579" />
    </TouchableOpacity>
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'Hadir': return '#4CAF50';
      case 'Sakit': return '#FFC107';
      case 'Izin': return '#2196F3';
      case 'Alpha': return '#F44336';
      case 'Libur': return '#757575';
      default: return '#666666';
    }
  };

  const getDailyData = (date) => {
    if (!absensiData) return null;
    const formattedDate = date.toISOString().split('T')[0];
    return absensiData.daily[formattedDate];
  };

  const getMonthlyData = (month) => {
    if (!absensiData) return [];
    return absensiData.monthly[month] || [];
  };

  const renderDailyData = () => {
    const dateStr = selectedDate.toISOString().split('T')[0];
    const dailyData = absensiData?.daily[dateStr];
    
    if (!dailyData) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Tidak ada data absensi untuk tanggal ini
          </Text>
        </View>
      );
    }

    return (
      <View style={[styles.studentItem, styles.shadowEffect]}>
        <View style={styles.dateInfoContainer}>
          <Text style={styles.dateInfoText}>{dailyData.dayName}</Text>
          <Text style={styles.dateInfoText}>{dateStr}</Text>
        </View>
        {/* <Text style={styles.studentName}>{absensiData?.studentInfo.name}</Text> */}
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(dailyData.status) }]}>
          <Text style={styles.statusText}>
            {dailyData.holiday ? `Libur (${dailyData.holiday})` : dailyData.status}
          </Text>
        </View>
      </View>
    );
  };

  const renderMonthlyData = () => {
    if (!selectedMonth) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Silahkan pilih bulan terlebih dahulu
          </Text>
        </View>
      );
    }

    const monthlyData = getMonthlyData(selectedMonth);
    
    if (monthlyData.length === 0) {
      return (
        <View style={styles.emptyStateContainer}>
          <Text style={styles.emptyStateText}>
            Tidak ada data absensi untuk bulan ini
          </Text>
        </View>
      );
    }

    return monthlyData.map((day) => (
      <View key={day.date} style={[styles.studentItem, styles.shadowEffect]}>
        <View style={styles.dateInfoContainer}>
          <Text style={styles.dateInfoText}>{day.dayName}</Text>
          <Text style={styles.dateInfoText}>{day.fullDate}</Text>
        </View>
        <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(day.status) }]}>
          <Text style={styles.statusText}>
            {day.holiday ? `Libur (${day.holiday})` : day.status}
          </Text>
        </View>
      </View>
    ));
  };

  const renderContent = () => {
    if (!filterType) {
      return (
        <View style={styles.emptyStateContainer}>
          <Ionicons 
            name="filter-outline" 
            size={80} 
            color="#2A8579" 
            style={styles.emptyStateIcon}
          />
          <Text style={styles.emptyStateText}>
            Silahkan pilih filter terlebih dahulu
          </Text>
        </View>
      );
    }

    if (filterType === 'daily') {
      return (
        <>
          <View style={styles.datePickerContainer}>
            <Text style={styles.searchTitle}>Silahkan memilih tanggal!</Text>
            <TouchableOpacity 
              style={[styles.dateButton, styles.shadowEffect]}
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
          <View style={styles.studentInfo}>
            <Text style={styles.studentInfoText}>Nama: {absensiData?.studentInfo.name}</Text>
          </View>
          <ScrollView style={styles.studentList}>
            {renderDailyData()}
          </ScrollView>
        </>
      );
    }

    if (filterType === 'monthly') {
      return (
        <>
          <View style={styles.monthPickerContainer}>
            <Text style={styles.searchTitle}>Silahkan pilih bulan!</Text>
            <CustomMonthDropdown />
          </View>
          <View style={styles.studentInfo}>
            <Text style={styles.studentInfoText}>Nama: {absensiData?.studentInfo.name}</Text>
          </View>
          <ScrollView style={styles.studentList}>
            {renderMonthlyData()}
          </ScrollView>
        </>
      );
    }
  };

  return (
    <View style={styles.container}>
      <View style={[styles.headerContainer, styles.shadowEffect]}>
        <Text style={styles.headerTitle}>Daftar Absensi Siswa</Text>
      </View>

      <View style={styles.filterContainer}>
        <Text style={styles.searchTitle}>Silahkan memilih filter!</Text>
        <CustomFilterDropdown />
      </View>

      {renderContent()}

      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowFilterModal(false)}
        >
          <View style={[styles.modalContent, styles.shadowEffect]}>
            {filterTypes.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.modalItem}
                onPress={() => {
                  setFilterType(item.value);
                  setShowFilterModal(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  filterType === item.value && styles.modalItemTextSelected
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      <Modal
        visible={showMonthModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowMonthModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowMonthModal(false)}
        >
          <View style={[styles.modalContent, styles.shadowEffect]}>
            {months.map((item) => (
              <TouchableOpacity
                key={item.value}
                style={styles.modalItem}
                onPress={() => {
                  setSelectedMonth(item.value);
                  setShowMonthModal(false);
                }}
              >
                <Text style={[
                  styles.modalItemText,
                  selectedMonth === item.value && styles.modalItemTextSelected
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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
  filterContainer: {
    padding: 20,
    zIndex: 2,
  },
  monthPickerContainer: {
    padding: 20,
    paddingTop: 0,
    zIndex: 1,
  },
  searchTitle: {
    fontFamily: 'conReg',
    fontSize: 18,
    color: '#2A8579',
    marginBottom: 10,
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F6F6F6',
    padding: 12,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownButtonText: {
    fontFamily: 'conReg',
    color: '#2A8579',
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
    width: '80%',
    maxHeight: '80%',
  },
  modalItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalItemText: {
    fontFamily: 'conReg',
    color: '#2A8579',
    fontSize: 16,
  },
  modalItemTextSelected: {
    color: '#2A8579',
    fontWeight: 'bold',
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
  dateInfoContainer: {
    flex: 1,
  },
  dateInfoText: {
    fontFamily: 'conReg',
    fontSize: 14,
    color: '#2A8579',
  },
  dateText: {
    marginLeft: 20,
    fontFamily: 'conReg',
    color: '#2A8579',
  },
  studentInfo: {
    padding: 20,
    paddingTop: 0,
    paddingBottom: 10,
  },
  studentInfoText: {
    fontFamily: 'conReg',
    fontSize: 18,
    color: '#2A8579',
  },
  studentList: {
    flex: 1,
    // padding: 20,
    paddingLeft : 10,
    paddingRight : 10,
  },
  studentItemHeader: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1.5,
    borderBottomColor: '#2A8579',
    backgroundColor: '#fff',
  },
  headerTanggal: {
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
  studentItem: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  studentNumber: {
    width: 40,
    fontFamily: 'conReg',
    color: '#2A8579',
  },
  studentName: {
    flex: 1,
    fontFamily: 'conReg',
    color: '#2A8579',
  },
  statusIndicator: {
    width: 80,
    padding: 5,
    borderRadius: 5,
    alignItems: 'center',
  },
  statusText: {
    color: '#fff',
    fontFamily: 'conReg',
  },
  emptyStateContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
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
  }
});

export default DaftarAbsensiSiswa;