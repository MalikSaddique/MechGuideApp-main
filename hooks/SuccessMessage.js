// SuccessMessage.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SuccessMessage = ({ visible, message }) => {
  if (!visible) return null;

  return (
    <View style={styles.container}>
      <MaterialIcons name="check-circle" size={24} color="green" />
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#daf5e1', 
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  message: {
    color: 'green',
    fontSize: 16,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});

export default SuccessMessage;
