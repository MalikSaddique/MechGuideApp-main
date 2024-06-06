import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRegistrationData } from '../../hooks/RegistrationDataContext';
import Icon from 'react-native-vector-icons/Ionicons';
import { storage } from '../../firebase/firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const BasicInformationScreen = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistrationData();
  const [firstName, setFirstName] = useState(registrationData.firstName);
  const [lastName, setLastName] = useState(registrationData.lastName);
  const [profileImage, setProfileImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const pickProfileImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setProfileImage(uri);
      }
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

  const handleNext = async () => {
    try {
      setIsLoading(true);

      const profileImageUrl = await uploadImageToStorage(profileImage, 'profile_image.jpg');

      updateRegistrationData({ firstName, lastName, profileImage: profileImageUrl });
      navigation.navigate('MechCNICScreen');
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert('Error', 'Failed to proceed. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const uploadImageToStorage = async (imageUri, imageName) => {
    const fileExtension = imageName.split('.').pop();
    const uniqueFileName = `${Date.now()}_${Math.floor(Math.random() * 100000)}.${fileExtension}`;

    const storageRef = ref(storage, 'images/' + uniqueFileName);
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {},
        (error) => {
          console.error("Error uploading image: ", error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              resolve(downloadURL);
            })
            .catch((error) => {
              console.error("Error getting download URL: ", error);
              reject(error);
            });
        }
      );
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.title}>Basic Information</Text>

      <TouchableOpacity onPress={pickProfileImage}>
        <View style={styles.imagePicker}>
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileImage} />
          ) : (
            <Image
              source={require('../../assets/Icons/userDefault.png')}
              style={styles.profileImage}
            />
          )}
          <Text style={styles.imagePickerText}>Upload a profile picture</Text>
        </View>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        onChangeText={setFirstName}
        value={firstName}
        placeholder="First Name"
      />

      <TextInput
        style={styles.input}
        onChangeText={setLastName}
        value={lastName}
        placeholder="Last Name"
      />

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        {isLoading ? (
          <ActivityIndicator size="small" color="#FFFFFF" />
        ) : (
          <Text style={styles.buttonText}>Next</Text>
        )}
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
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 44 : 20,
    left: 10,
    zIndex: 10,
    backgroundColor: 'transparent',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 50,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
  },
  nextButton: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  imagePicker: {
    marginBottom: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
    height: 150,
    borderRadius: 75,
    borderWidth: 1,
    borderColor: 'gray',
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  imagePickerText: {
    color: 'gray',
    textAlign: 'center',
  },
});

export default BasicInformationScreen;
