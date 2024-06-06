import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const MechanicRegistrationScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Join as a Mechanic</Text>
      <Text style={styles.description}>
        Become part of our community and offer your services to a wide range of clients.
      </Text>
      <TouchableOpacity
        style={styles.registerButton}
        onPress={() => navigation.navigate('BasicInformationScreen')}>
        <Text style={styles.buttonText}>Register Now</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  backButton:{
    position: 'absolute', // Position absolutely so it can be placed over other content
    top: Platform.OS === 'ios' ? 44 : 20, // Spacing from the top, adjust for different platforms if needed
    left: 10, // Spacing from the left
    zIndex: 10, // Ensure it sits above other content
    backgroundColor: 'transparent', // No background color
    padding: 20, // Add padding to increase the touchable area
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  registerButton: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default MechanicRegistrationScreen;
