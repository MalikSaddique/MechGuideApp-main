import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, Dimensions, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRegistrationData } from '../../hooks/RegistrationDataContext';
import Icon from 'react-native-vector-icons/Ionicons';
import SuccessMessage from '../../hooks/SuccessMessage';
import { storage } from '../../firebase/firebase.config';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const {width, height}= Dimensions.get('window')

const CNICScreen = ({ navigation }) => {
  const { registrationData, updateRegistrationData } = useRegistrationData();
  const [cnicFront, setCnicFront] = useState(registrationData.cnicFront);
  const [cnicBack, setCnicBack] = useState(registrationData.cnicBack);
  const [successVisible, setSuccessVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = async (side) => {
    let result = await ImagePicker.launchImageLibraryAsync({
    //  mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
        if (result.assets && result.assets.length > 0 ) {
            const imageUri = result.assets[0].uri;
            if (side === 'front') {
              setCnicFront(imageUri);
              updateRegistrationData({ cnicFront: imageUri });
            } else {
              setCnicBack(imageUri);
              updateRegistrationData({ cnicBack: imageUri });
            }
            if (cnicFront && cnicBack) {
              setSuccessVisible(true);
              setTimeout(() => setSuccessVisible(false), 3000); 
            }
          }
    }
  };



  const handleNext = async () => {
    try {
      setIsLoading(true); // Set loading to true when starting image upload

      // Upload images to Firebase Storage
      const frontImageUrl = await uploadImageToStorage(cnicFront, 'cnic_front.jpg');
      const backImageUrl = await uploadImageToStorage(cnicBack, 'cnic_back.jpg');

      // Update registration data with image URLs
      updateRegistrationData({ cnicFront: frontImageUrl, cnicBack: backImageUrl });

      navigation.navigate('SelfieWithId'); 
    }
    // if (!cnicFront || !cnicBack) {
    //   Alert.alert('Error', 'Please upload both front and back sides of your CNIC.');
    //   return;
    // }
    catch (error) {
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
      <SuccessMessage visible={successVisible} message="Image Sucessfully Uploaded!" />
      <Text style={styles.headerText}>CNIC (front side)</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('front')}>
          <Image source={cnicFront? { uri: cnicFront } : require('../../assets/Icons/CNICFront.png')} style={styles.image} />
          {/* <Text style={styles.addPhotoText}>Add a photo</Text> */}
      </TouchableOpacity>

      <Text style={styles.headerText}>CNIC (back side)</Text>
      <TouchableOpacity style={styles.imagePicker} onPress={() => pickImage('back')}>
        {/* {cnicBack ? ( */}
          <Image source={cnicBack? { uri: cnicBack }: require('../../assets/Icons/CNICBack.png')} style={styles.image} />
        {/* ) : ( */}
          {/* <Text style={styles.addPhotoText}>Add a photo</Text> */}
        {/* )} */}
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
      {isLoading ? (
          <ActivityIndicator  color="white" />
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
  addPhotoText: {
    color: '#C0C0C0',
    fontSize: 16,
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

export default CNICScreen;
