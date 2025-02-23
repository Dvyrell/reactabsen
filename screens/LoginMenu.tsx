import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type RootStackParamList = {
  LoginForm: undefined;
};

type NavigationProps = NativeStackNavigationProp<RootStackParamList>;

export default function LoginMenu() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SiHadir</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginForm')}
      >
        <Text style={styles.buttonText}>Guru</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('LoginForm')}
      >
        <Text style={styles.buttonText}>Siswa</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 50,
  },
  button: {
    backgroundColor: '#2B7267',
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderRadius: 10,
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
