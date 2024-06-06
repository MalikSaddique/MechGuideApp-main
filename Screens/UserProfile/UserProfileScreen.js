import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker'; // Import ImagePicker
import { LinearGradient } from 'expo-linear-gradient';
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import Icon from 'react-native-vector-icons/Ionicons';

import { auth, db, storage } from "../../firebase/firebase.config";

const { width, height } = Dimensions.get('window');

const UserProfileScreen = ({ navigation }) => {

    const [userData, setUserData] = useState(null); // Initialize as null to indicate data is loading
    const [profileImage, setProfileImage] = useState(null); // Profile image state

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            const unsubscribe = onSnapshot(doc(db, "users", user.uid), (doc) => {
                if (doc.exists()) {
                    setUserData(doc.data());
                } else {
                    console.log("No such document!");
                }
            });

            return () => unsubscribe(); // Unsubscribe when component unmounts
        }
    }, []); // Run only once when component mounts

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
            // console.log('Error picking image: ', error);
        }
    };

    const handleProfileImageUpload = async () => {
        if (profileImage) {
            try {
                const imageUrl = await uploadImageToStorage(profileImage, 'profileImage.jpg');
                console.log('Image uploaded successfully:', imageUrl);

                // Update profile image URL in Firestore
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, {
                    profileImageUrl: imageUrl // Update profileImageUrl field in Firestore
                });

                // Update profile image URL in userData state
                setUserData(prevUserData => ({
                    ...prevUserData,
                    profileImageUrl: imageUrl
                }));
            } catch (error) {
                // console.error('Error uploading image:', error);
                // Handle error
            }
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
                (snapshot) => { },
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

    if (!userData) {
        return (
            <View style={styles.loadingContainer}>
                <Text>Loading...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
            <LinearGradient
                colors={['#FFA726', '#FB8C00', '#FF6F00']}
                style={styles.linearGradient}>
                <View style={styles.headerContainer}>
                    <TouchableOpacity style={styles.profileContainer} onPress={pickProfileImage}>
                        <Image
                            source={profileImage ? { uri: profileImage } : userData.profileImageUrl ? { uri: userData.profileImageUrl } : require('../../assets/Icons/userDefault.png')}
                            style={styles.profileImage}
                        />
                    </TouchableOpacity>
                    <Text style={styles.userName}>{userData.name}</Text>
                </View>
            </LinearGradient>
            <View style={styles.detailSection}>
                <Text style={styles.sectionTitle}>My Details</Text>
                <Text style={styles.detailText}>Username: {userData.name}</Text>
                <Text style={styles.detailText}>Email: {userData.email}</Text>
                <Text style={styles.detailText}>Phone: {userData.phone}</Text>
                <Text style={styles.detailText}>Location: {userData.location}</Text>
                <TouchableOpacity style={styles.button} onPress={handleProfileImageUpload}>
                    <Text style={styles.buttonText}>Upload Profile Image</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('EditDetails')}>
                    <Text style={styles.buttonText}>Edit Details</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    linearGradient: {
        width: '100%',
        alignItems: 'center',
    },
    backButton: {
        marginLeft: width * 0.03,
        marginTop: height * 0.04,
    },
    headerContainer: {
        paddingVertical: 20,
        alignItems: 'center',
        width: '100%'
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginTop: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFFFFF',
    },
    detailSection: {
        backgroundColor: '#FFFFFF',
        padding: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    detailText: {
        fontSize: 16,
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#FF7A00',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        fontSize: 18,
        color: '#FFFFFF',
        fontWeight: 'bold',
    },
});

export default UserProfileScreen;
