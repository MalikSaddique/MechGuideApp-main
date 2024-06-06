import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, Platform, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRegistrationData } from '../../hooks/RegistrationDataContext';
import Icon from 'react-native-vector-icons/Ionicons';
import SuccessMessage from '../../hooks/SuccessMessage';
import { collection, addDoc } from "firebase/firestore"; 
import { db, storage, auth } from '../../firebase/firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const { width, height } = Dimensions.get('window');

const CertificateScreen = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistrationData();
  const [certificateImageFront, setCertificateImageFront] = useState(registrationData.certificateImageFront);
  const [certificateImageBack, setCertificateImageBack] = useState(registrationData.certificateImageBack);
  const [successVisible, setSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (side) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      console.log('Picked image uri:', imageUri);
      if (side === 'front') {
        setCertificateImageFront(imageUri);
        updateRegistrationData({ certificateImageFront: imageUri });
      } else {
        setCertificateImageBack(imageUri);
        updateRegistrationData({ certificateImageBack: imageUri });
      }
    }
  };

  const handleNext = async () => {
    try {
      setIsLoading(true);

      const user = auth.currentUser;
      const userId = user.uid;

      const frontImageUrl = await uploadImageToStorage(certificateImageFront, 'certificate_front.jpg');
      const backImageUrl = await uploadImageToStorage(certificateImageBack, 'certificate_back.jpg');

      updateRegistrationData({
        certificateImageFront: frontImageUrl,
        certificateImageBack: backImageUrl
      });

      await saveRegistrationDataToFirestore(frontImageUrl, backImageUrl, userId);

      setSuccessVisible(true);
      setTimeout(() => setSuccessVisible(false), 3000);

      navigation.navigate('LicenseScreenMech');
    } catch (error) {
      console.error("Error: ", error);
      Alert.alert('Error', 'Failed to proceed. Please try again later.');
    } finally {
      setIsLoading(false);
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

  const saveRegistrationDataToFirestore = async (frontImageUrl, backImageUrl, userId) => {
    try {
      await addDoc(collection(db, "Mechdata"), {
        userId: userId,
        firstName: registrationData.firstName,
        lastName: registrationData.lastName,
        profileImage: registrationData.profileImage,
        cnicFront: registrationData.cnicFront,
        cnicBack: registrationData.cnicBack,
        holdingCnicImage: registrationData.holdingCnicImage,
        certificateImageFront: frontImageUrl,
        certificateImageBack: backImageUrl,
        drivingLicense: registrationData.drivingLicense,
        status: "pending"
      });
      console.log("Registration data saved successfully to Firestore");
    } catch (error) {
      console.error("Error adding document: ", error);
      throw error;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <SuccessMessage visible={successVisible} message="Image Successfully Uploaded!" />
      <Text style={styles.headerText}>Certificate (front side)</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('front')}>
        <Image source={certificateImageFront? { uri: certificateImageFront  } : require('../../assets/Icons/CertificateFront.png')} style={styles.image} />
      </TouchableOpacity>

      <Text style={styles.headerText}>Certificate (back side)</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('back')}>
      <Image source={certificateImageBack? { uri: certificateImageBack  } : require('../../assets/Icons/CertificateBack.png')} style={styles.image} />
      </TouchableOpacity>

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
    padding: 20,
  },
  backButton:{
    position: 'absolute', 
    top: Platform.OS === 'ios' ? 44 : 20, 
    left: 10, 
    zIndex: 10, 
    backgroundColor: 'transparent', 
    padding: 20, 
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 60,
    marginVertical:20,
  },
  imagePicker: {
    width: '90%',
    height: 200,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
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

export default CertificateScreen;
