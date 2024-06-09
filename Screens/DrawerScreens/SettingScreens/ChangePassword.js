import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from '../../../firebase/firebase.config';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';

const ChangePasswordScreen = ({ navigation }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [oldPasswordVisible, setOldPasswordVisible] = useState(false);
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New password and confirm password do not match.');
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      const credential = EmailAuthProvider.credential(user.email, oldPassword);
      
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      
      Alert.alert('Success', 'Password changed successfully.');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" style={styles.backButton}/>
      </TouchableOpacity>
      <Text style={styles.title}>Change Password</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Old Password"
          secureTextEntry={!oldPasswordVisible}
          onChangeText={setOldPassword}
          value={oldPassword}
        />
        <TouchableOpacity onPress={() => setOldPasswordVisible(!oldPasswordVisible)}>
          <FontAwesome5 name={oldPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#6D6A6A" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry={!newPasswordVisible}
          onChangeText={setNewPassword}
          value={newPassword}
        />
        <TouchableOpacity onPress={() => setNewPasswordVisible(!newPasswordVisible)}>
          <FontAwesome5 name={newPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#6D6A6A" />
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry={!confirmPasswordVisible}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
        />
        <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
          <FontAwesome5 name={confirmPasswordVisible ? 'eye' : 'eye-slash'} size={20} color="#6D6A6A" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleChangePassword} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'Saving...' : 'Save'}</Text>
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
    color: '#000',
    marginRight: 20,
    marginTop:30
  },
  backButtonText: {
    color: '#FF7A00',
    fontSize: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft:70
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ChangePasswordScreen;
