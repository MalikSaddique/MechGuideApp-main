import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = () => {
  const navigation = useNavigation();

  const handleNavigation = (screen) => {
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('ChangePassword')}>
        <Text style={styles.optionText}>Change Password</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('NotificationScreen')}>
        <Text style={styles.optionText}>Notifications</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('PrivacyPolicy')}>
        <Text style={styles.optionText}>Privacy Policy</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('ContactUs')}>
        <Text style={styles.optionText}>Contact Us</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.option} onPress={() => handleNavigation('DeleteAccount')}>
        <Text style={styles.optionText}>Delete Account</Text>
        <Ionicons name="chevron-forward" size={24} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    paddingHorizontal: 20,
    paddingTop: 60,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
    
  },
  backButton: {
    color: '#000',
    fontSize: 18,
    marginRight: 20,
  },
  headerTitle: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft:85,

  },
  option: {
    padding: 15,
    borderWidth: 1,
    borderColor: '#FF7A00',
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionText: {
    color: '#000',
    fontSize: 18,
  },
});

export default SettingsScreen;
