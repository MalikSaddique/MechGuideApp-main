import React, { useState , useEffect} from 'react';

import { View, Text, TouchableOpacity, Image, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useImagePicker } from '../../../hooks/ImagePickerHook';
import { db, storage, auth } from '../../../firebase/firebase.config.js';
import { onSnapshot, doc } from "firebase/firestore";

const ProfileSettings = ({ }) => {
  const navigation=useNavigation();
  const { profileImage, handleProfileImagePress } = useImagePicker();
  const [userData , setUserData]=useState();
  const [email, setEmail] = useState();
  const [mech, setmech]=useState();


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
  
    if (user) {
      const unsubscribe = onSnapshot(doc(db, "Mechdata", user.uid), (doc) => {
        if (doc.exists()) {
          setmech(doc.data());
          console.log(doc.data())
        } else {
          console.log("No such document!");
        }
      });
  
      return () => unsubscribe(); // Unsubscribe when component unmounts
    }
  }, []);
  


  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={34} color="#000" />
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.profileSection}>
        <Text style={styles.headerTitle}>Profile Management</Text>
        <TouchableOpacity style={styles.profileContainer} onPress={handleProfileImagePress}>
    <Image
        source={
            profileImage ? { uri: profileImage } :
            (userData && userData.profileImageUrl) ? { uri: userData.profileImageUrl } :
            require('../../../assets/Icons/userDefault.png')
        }
        style={styles.profileImage}
    />
</TouchableOpacity>

          <Text style={styles.userName}> {userData ? userData.name :'Loading...'}</Text>
          <Text style={styles.userEmail}>{userData ? userData.email :'Loading...'}</Text>
        </View>
        <View style={styles.optionContainer}>
          <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('MechEditDetails')}>
            <Ionicons name="person-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Edit profile information</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => {}}>
            <Ionicons name="notifications-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => {}}>
            <Ionicons name="language-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Language</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => {}}>
            <Ionicons name="lock-closed-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Security</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => {}}>
            <Ionicons name="color-palette-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Theme</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.option} onPress={() => {}}>
            <Ionicons name="help-circle-outline" size={24} color="#666" />
            <Text style={styles.optionText}>Help & Support</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        },
        header: {
        marginTop:50,
        marginLeft:20,
        },
        backButton: {
        marginRight: 15, 
        },
        headerTitle: {
        color: '#000',
        fontSize: 25,
        fontWeight: 'bold',
        marginBottom:10, 
        },
        profileSection: {
        alignItems: 'center',
        marginVertical: 20
        },
        profileImage: {
        width: 80,
        height: 80,
        borderRadius: 40
        },
        userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 8
        },
        userEmail: {
        fontSize: 16,
        color: '#666'
        },
        optionContainer: {
        padding: 20
        },
        option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10
        },
        optionText: {
        fontSize: 18,
        marginLeft: 10
        }
        });

export default ProfileSettings;
