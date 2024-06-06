// hooks/ImagePickerHook.js
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { ref, storage, uploadBytesResumable, getDownloadURL } from 'firebase/storage';

export const useImagePicker = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleProfileImagePress = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert("You've refused to allow this app to access your photos!");
      return;
    }

    const pickerResult = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(pickerResult);
    if (!pickerResult.canceled && pickerResult.assets) {
      const selectedImageUri = pickerResult.assets[0].uri;
      setProfileImage(selectedImageUri);
    }
  };

  const uploadImageToStorage = async (imageUri, imageName) => {
    const fileExtension = imageName.split('.').pop(); // Get the file extension
    const uniqueFileName = `${Date.now()}_${imageName}`; // Use a unique identifier for the image name

    const storageRef = ref(storage, 'images/' + uniqueFileName);
    const response = await fetch(imageUri);
    const blob = await response.blob();
    const uploadTask = uploadBytesResumable(storageRef, blob);

    return new Promise((resolve, reject) => {
      uploadTask.on(
        'state_changed',
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

  return {
    profileImage,
    handleProfileImagePress,
    uploadImageToStorage,
  };
};

