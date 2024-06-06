import React,{useState, useEffect} from 'react';
import { Alert, View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
// import { MaterialIcons } from '@expo/vector-icons';
// import MapView, { Marker } from 'react-native-maps';
// import * as Location from 'expo-location';
import DrawerMenu from './DrawerMenu';
import { db, storage, auth } from '../firebase/firebase.config';
import { collection, query, where, getDocs } from "firebase/firestore"; 
import { onSnapshot, doc } from "firebase/firestore";
import * as Permissions from 'expo-permissions';

const { width, height } = Dimensions.get('window');

const LocationScreen = ({ navigation }) => {
  const [userData, setUserData] = useState(null); 


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
}, []);

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/Icons/SkyGeo.png')} 
        style={styles.citySkyline}
        resizeMode="contain"
      />
      <Text style={styles.greeting}>Hi, nice to meet you {userData ? userData.name :'Loading...'}!</Text>
      <Text style={styles.instruction}>Choose your location to start find mechanic around you.</Text>
      <TouchableOpacity style={styles.locationButton} onPress={()=>navigation.navigate("DrawerNavigation")}>
      <Image
        source={require('../assets/Icons/Path.png')} 
        style={styles.iconLocation}
        resizeMode="contain"
      />
        <Text style={styles.locationButtonText}>Use current location</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
    backgroundColor: '#425DA0',
  },
  citySkyline: {
    width: width,
    height: height * 0.3, 
    
  },
  greeting: {
    fontSize: 22,
    color: '#FFFFFF',
    fontWeight: 'bold',
    textAlign: 'center',
    
  },
  instruction: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    paddingHorizontal: 20, 
   
  },
  locationButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#425DA0', 
    paddingHorizontal: 20, // Horizontal padding
    paddingVertical: 10, // Vertical padding
    borderRadius: 10, // Rounded corners
    borderWidth: 2, // Border width
    borderColor: '#FF7A00',
    width: '80%', // Set the width
    alignSelf: 'center', 
  },
  locationButtonText: {
    fontSize: 23,
    color: '#FF7A00', // Button text color
    fontWeight: 'bold',
    marginLeft:30,
  },
});

export default LocationScreen;
