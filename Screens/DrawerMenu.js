import React,  { useEffect, useState } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Dimensions, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { LinearGradient } from 'expo-linear-gradient';
import { signOut } from "firebase/auth";
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useImagePicker } from '../hooks/ImagePickerHook';
import MechanicRegistrationScreen from './MechanicScreen/MechanicRegistrationScreen';
import { db, storage, auth } from '../firebase/firebase.config';
import { collection, query, where, getDocs } from "firebase/firestore"; 
import AsyncStorage from '@react-native-async-storage/async-storage';
import handleLogout from './DrawerScreens/LogOut';
const { width, height } = Dimensions.get('window');
import { onSnapshot, doc } from "firebase/firestore";


const DrawerMenu = (props) => {
  // const [profileImage, setProfileImage] = React.useState(null);
  const { profileImage, handleProfileImagePress } = useImagePicker();
  const [userData, setUserData] = useState(null); // Initialize as null to indicate data is loading

  const navigation= useNavigation();
 
  //Mechanics registration function 

  const Mechanic_registration = async () => {
    try {
      const userId = auth.currentUser.uid;
      
      // Perform the database query to check if the current user's ID exists in the backend data
      const q = query(collection(db, "Mechdata"), where("userId", "==", userId));
      const querySnapshot = await getDocs(q);
  
      // Check if the querySnapshot has any documents
      if (!querySnapshot.empty) {
        // If the query result is not empty, navigate to 'MechRegistrationConfirmation'
        navigation.navigate('MechRegistrationConfirmation');
      } else {
        // If the query result is empty, navigate to 'MechanicScreen'
        navigation.navigate('MechanicScreen');
      }
    } catch (e) {
      console.error("Error checking mechanic registration: ", e);
      // Handle error, maybe show a toast or alert
    }
  };
  
  
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
  
  return (
    <DrawerContentScrollView {...props}>
      <LinearGradient
    // colors={['#4c669f', '#3b5998', '#192f6a']} 
    colors={['#FFA726', '#FB8C00', '#FF6F00']}
    style={styles.linearGradient}>
      <View style={styles.userInfoSection}>
      <TouchableOpacity onPress={handleProfileImagePress}>
    <Image
        source={
            profileImage ? 
            { uri: profileImage } : 
            (userData && userData.profileImageUrl) ? 
            { uri: userData.profileImageUrl } : 
            require('../assets/Icons/userDefault.png')
        }
        style={styles.userImage}
    />
</TouchableOpacity>

      <TouchableOpacity style={styles.profileTextContainer} onPress={()=>navigation.navigate('UserProfile')}>
          <Text style={styles.userName}>{userData ? userData.name : 'Loading...'}</Text>
          <Icon name="arrow-forward" style={styles.arrowIcon} />
        </TouchableOpacity>
      </View>
      </LinearGradient>

      {/* <DrawerItemList {...props} /> */}

      <DrawerItem
        label="Home"
        onPress={() => {}}
        icon={({ color, size }) => (
          <Icon name="home-outline" color={color} size={size} />
        )}
      />
         <DrawerItem
        label="Privacy Policy"
        onPress={() => props.navigation.navigate('PrivacyPolicy')}
        icon={({ color, size }) => (
          <Icon name="lock-closed-outline" color={color} size={size} />
        )}
      />
       {/* <DrawerItem
        label="Feedback & Complaints"
        onPress={() => { /* navigate to mechanic mode */ }
        {/* icon={({ color, size }) => (
          <Icon name="wallet-outline" color={color} size={size} />
        )} */}
      <DrawerItem
        label="View Mechanics"
        onPress={() => props.navigation.navigate('ViewMechanics')}
        icon={({ color, size }) => (
          <Icon name="build-outline" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="Notifications"
        onPress={() => { /* navigate to mechanic mode */ }}
        icon={({ color, size }) => (
          <Icon name="notifications-outline" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="FAQs"
        onPress={() => { props.navigation.navigate('FAQScreen') }}
        icon={({ color, size }) => (
          <Icon name="alert-circle-outline" color={color} size={size} />
        )}
      />
      <DrawerItem
        label="Settings"
        onPress={() => { props.navigation.navigate('UserSettingScreen')}}
        icon={({ color, size }) => (
          <Icon name="settings-outline" color={color} size={size} />
        )}
      />
       <DrawerItem
        label="Feedback & Complaints"
        onPress={() => props.navigation.navigate('FeedbackComplaints')}
        icon={({ color, size }) => (
          <Icon name="chatbubble-outline" color={color} size={size} />
        )}
      />
       <DrawerItem
        label="Log Out"
        onPress={()=>handleLogout(navigation)}
        icon={({ color, size }) => (
          <Icon name="log-out-outline" color={color} size={size} />
        )}
      />
      <TouchableOpacity style={styles.mechMode} onPress={Mechanic_registration}>
        <Text style={styles.buttonText}>Mechanic Mode</Text>
      </TouchableOpacity>

      
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  userInfoSection: {
    paddingLeft: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
  userImage: {
    width: 90,
    height: 90,
    borderRadius: 70,
    marginBottom: 10,
alignItems:'center',
  },
  profileTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor:'#FFFFFF',
    padding:10,
    borderRadius:10,
    marginEnd: width* 0.05,
  },
  userName: {
    color: '#FF7A00',
    fontSize: 20,
    fontWeight: 'bold',
  },
  arrowIcon: {
    fontSize: 24,
    color: '#FF7A00',
    marginLeft: 10,
  },
  mechMode:{
    width: '90%',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7A00',
    marginLeft:width* 0.04, 
    marginBottom: 10,
    marginTop:height*0.05
  },
  buttonText:{
    fontSize: width * 0.07, 
    color: '#FFFFFF',
    fontWeight: 'bold',
  }
  
});

export default DrawerMenu;