import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { auth } from '../../../firebase/firebase.config';
import { reauthenticateWithCredential, EmailAuthProvider, deleteUser } from 'firebase/auth';

const DeleteAccountScreen = ({ navigation }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeleteAccount = async () => {
    setLoading(true);

    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, password);

      await reauthenticateWithCredential(user, credential);
      await deleteUser(user);

      Alert.alert('Success', 'Your account has been deleted.');
      navigation.navigate('Login'); 
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = () => {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account?',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: handleDeleteAccount,
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" style={styles.backButton}/>
      </TouchableOpacity>
      <Text style={styles.title}>Delete Account</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        secureTextEntry={true}
        onChangeText={setPassword}
        value={password}
      />

      <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete} disabled={loading}>
        {loading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.deleteButtonText}>Delete Account</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginBottom: 20,
    marginTop:30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft:80
  },
  input: {
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  deleteButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default DeleteAccountScreen;


