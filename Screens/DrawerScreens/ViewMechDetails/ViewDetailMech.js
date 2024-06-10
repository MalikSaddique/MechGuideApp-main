import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { auth, db } from "../../../firebase/firebase.config";
import { collection, getDoc, doc, addDoc, getDocs, query, where, updateDoc } from "firebase/firestore";
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

const MechanicDetailsScreen = ({ route, navigation }) => {
  const { mechanicId } = route.params;
  const [mechanic, setMechanic] = useState(null);
  const [userData, setUserData] = useState(null);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const mechanicRef = doc(db, 'Mechanicprofile_details', mechanicId);
        const userRef = doc(db, 'users', auth.currentUser.uid);
        
        const [mechanicDoc, userDoc] = await Promise.all([
          getDoc(mechanicRef),
          getDoc(userRef),
        ]);
        
        if (mechanicDoc.exists() && userDoc.exists()) {
          setMechanic(mechanicDoc.data());
          setUserData(userDoc.data());
          console.log(mechanicId)
          console.log("userdata", userDoc.data());
        } else {
          console.log('No document!');
        }
    
        // Fetch data from User_Request_of_services collection for current user
        const requestSnapshot = await getDocs(query(collection(db, "User_Request_of_services"),  where("mechanicId", "==", mechanicId), where("userid", "==", auth.currentUser.uid)));
        const requestData = requestSnapshot.docs.map(doc => doc.data());
        console.log("Request data:", requestData);

        setServices(requestData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [mechanicId]);
  
  if (!mechanic || !userData || services === null) {
    return <Text>Loading...</Text>; 
  }

  // Handle Request
  const handleRequest = async () => {
    try {
      let location;
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          return;
        }

        location = await Location.getCurrentPositionAsync({});
      } catch (error) {
        Alert.alert('Error', 'Failed to get your location.');
        console.error(error);
        return;
      }

      const userLocation = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const requestSnapshot = await getDocs(query(collection(db, "User_Request_of_services"), where("mechanicId", "==", mechanicId), where("userid", "==", auth.currentUser.uid)));
      
      if (requestSnapshot.empty) {
        // No existing request, add a new one
        const docRef = await addDoc(collection(db, "User_Request_of_services"), {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          serviceNeed: mechanic.servicesOffered,
          mechanicId: mechanicId,
          userid: auth.currentUser.uid,
          status: "pending",
          createdAt: new Date().toISOString(),
          location: userLocation
        });

        const docId = docRef.id; // Get the ID of the added document

        // Update the document with its own ID
        await updateDoc(doc(db, "User_Request_of_services", docId), { id: docId });

        console.log("Document written with ID: ", docId);
      } else {
        // Existing request, update it with new location
        const docId = requestSnapshot.docs[0].id;
        await updateDoc(doc(db, "User_Request_of_services", docId), { location: userLocation });

        console.log("Document updated with ID: ", docId);
      }

      Alert.alert('Your request has been submitted', 'You will be notified soon about request approval!');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit your request.');
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{mechanic.shopName}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.shopName}>{mechanic.shopName}</Text>
        <Text style={styles.info}>Services: {mechanic.servicesOffered}</Text>
        <Text style={styles.info}>Location: {mechanic.location}</Text>
        <Text style={styles.info}>Pricing: {mechanic.pricing}</Text>
        {userData.someData && <Text style={styles.info}>User Data: {userData.someData}</Text>}
        
        {services && services.length > 0 && services[0].status === "pending" ? (
          <Text style={styles.pendingInfo}>Your request is sent to the mechanic.</Text>
        ) : services && services.length > 0 && services[0].status === "accepted" ? (
          <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ViewMechLoction',{ mechlocation: mechanic.location })}>
            <Text style={styles.buttonText}>Mechanic's Live Location</Text>
          </TouchableOpacity>
        ) : services && services.length > 0 && services[0].status === "rejected" ? (
          <Text style={[styles.info, styles.rejectedText]}>Your request is rejected.</Text>
        ) : (
          <TouchableOpacity style={styles.button} onPress={handleRequest}>
            <Text style={styles.buttonText}>Request a Service</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    marginTop: 25,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7A00',
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  backButton: {
    marginRight: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    margin: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  shopName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 16,
    marginBottom: 5,
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    marginVertical: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  rejectedText: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
  pendingInfo: {
    color: 'orange',
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 20,
  },
});

export default MechanicDetailsScreen;
