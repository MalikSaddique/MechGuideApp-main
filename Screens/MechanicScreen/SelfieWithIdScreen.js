import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions, Platform, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRegistrationData } from '../../hooks/RegistrationDataContext';
import Icon from 'react-native-vector-icons/Ionicons';
import SuccessMessage from '../../hooks/SuccessMessage';
import { storage } from '../../firebase/firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { width, height } = Dimensions.get('window');

const SelfieWithIDScreen = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistrationData();
  const [selfieImage, setSelfieImage] = useState(null);
  const [successVisible, setSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // State to manage loading indicator

  const pickSelfieImage = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets) {
      const imageUri = result.assets[0].uri;
      setSelfieImage(imageUri);
      updateRegistrationData({ holdingCnicImage: imageUri });
      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);
    }
  };

  const handleNext = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting image upload

      // Upload image to Firebase Storage
      const imageUrl = await uploadImageToStorage(selfieImage, 'selfie_with_id.jpg');
      console.log("Selfie with ID image URL:", imageUrl);

      // Update registration data with image URL
      updateRegistrationData({ holdingCnicImage: imageUrl });

      // Navigate to the next screen
      navigation.navigate('CertificateScreenMech');

    } catch (error) {
      console.error("Error: ", error);
      // Handle error here
      Alert.alert('Error', 'Failed to proceed. Please try again later.');
    } finally {
      setIsLoading(false); // Set loading to false when image upload is complete or fails
    }
  };

  const uploadImageToStorage = async (imageUri, imageName) => {
    const fileExtension = imageName.split('.').pop(); // Get the file extension
    const uniqueFileName = `${Date.now()}_${Math.floor(Math.random() * 100000)}.${fileExtension}`; // Generate a unique file name

    const storageRef = ref(storage, 'images/' + uniqueFileName);    const response = await fetch(imageUri);
    const blob = await response.blob();
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
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
      <SuccessMessage visible={successVisible} message="Image Successfully Uploaded!" />
      <Text style={styles.title}>Selfie with ID</Text>
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructions}>
          Please take a clear selfie with your ID card in hand.
        </Text>
        <Image source={selfieImage ? { uri: selfieImage } : require('../../assets/Icons/SelfiePhoto.png')} style={styles.selfieImage} />
        <TouchableOpacity onPress={pickSelfieImage} style={styles.addButton}>
          <Text style={styles.addButtonText}>Add a photo</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        {isLoading ? (
          <ActivityIndicator color="#FFFFFF" />
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
  instructionsContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  instructions: {
    fontSize: 16,
    textAlign: 'center',
  },
  selfieImage: {
    width: width - 40,
    height: height / 3,
    marginTop: 20,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 30,
    paddingVertical: 20,
    borderRadius: 20,
    marginTop: 30,
 
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  nextButton: {
    backgroundColor: '#FF7A00',
    padding: 15,
    borderRadius: 8,
    width: '90%',
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SelfieWithIDScreen;
