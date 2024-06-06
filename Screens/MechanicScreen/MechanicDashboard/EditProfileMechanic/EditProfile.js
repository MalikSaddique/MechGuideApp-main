import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { auth, db } from "../../../../firebase/firebase.config";
import { collection, addDoc, doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
const EditMechanicProfileScreen = ({ navigation }) => {
    const [shopName, setShopName] = useState('');
    const [servicesOffered, setServicesOffered] = useState('');
    const [pricing, setPricing] = useState('');
    const [availability, setAvailability] = useState(false);
    const [location, setLocation] = useState('');
    const [mapVisible, setMapVisible] = useState(false);
    const [region, setRegion] = useState(null);


    const fetchAddress = async (coords) => {
        try {
            const result = await Location.reverseGeocodeAsync(coords);
            if (result.length > 0) {
                const { street, name, city, postalCode, region } = result[0];
                return ` ${city}, ${region} `;
            }
            return "No address found";
        } catch (error) {
            console.error("Error fetching address: ", error);
            return "Error fetching address";
        }
    };


    const getLocation = async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access location was denied');
            return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
    const address = await fetchAddress({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
            longitudeDelta: 0.005,
    });
        // setLocation(`Lat: ${currentLocation.coords.latitude}, Lon: ${currentLocation.coords.longitude}`);
        setLocation(address);
        setMapVisible(false);
    };

    const handleSave = async () => {
        try {
            const user = auth.currentUser;
            if (user) {
                const docRef = doc(db, 'Mechanicprofile_details', user.uid);
                const docSnap = await getDoc(docRef);
    
                if (docSnap.exists()) {
                    // Document exists, update details
                    await updateDoc(docRef, {
                        shopName: shopName,
                        servicesOffered: servicesOffered,
                        pricing: pricing,
                        availability: availability,
                        location: location,
                        mechid:user.uid
                        // Add other fields as needed
                    });
                    Alert.alert("Profile Updated", "Your info has been updated!");
                } else {
                    // Document doesn't exist, add new details
                    await setDoc(docRef, {
                        shopName: shopName,
                        servicesOffered: servicesOffered,
                        pricing: pricing,
                        availability: availability,
                        location: location,
                        mechid:user.uid

                        // Add other fields as needed
                    });
                    Alert.alert("Profile Created", "Your profile has been created!");
                }
            } else {
                console.error("User not found or not logged in.");
            }
        } catch (error) {
            console.error("Error saving user profile:", error);
        }
    };
    

    return (
        <ScrollView style={styles.container}>
            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
            <Text style={styles.title}>Edit Profile</Text>
            <TextInput
                style={styles.input}
                onChangeText={setShopName}
                value={shopName}
                placeholder="Enter shop name"
            />
            <TextInput
                style={styles.input}
                onChangeText={setServicesOffered}
                value={servicesOffered}
                placeholder="Services offered"
            />
            <TextInput
                style={styles.input}
                onChangeText={setPricing}
                value={pricing}
                placeholder="Pricing information"
            />
            {/* <TextInput
                style={styles.input}
                onChangeText={setLocation}
                value={location}
                placeholder="Location"
            /> */}
            <View style={styles.switchContainer}>
                <Text style={styles.label}>Availability:</Text>
                <Switch
                    trackColor={{ false: "#767577", true: "#f5dd4b" }}
                    thumbColor={availability ? "#FF7A00" : "#f4f3f4"}
                    onValueChange={() => setAvailability(previousState => !previousState)}
                    value={availability}
                />
            </View>
            <Text style={styles.label}>Current Location:</Text>
            <TouchableOpacity onPress={() => setMapVisible(true)} style={styles.locationButton}>
                <Text style={styles.locationText}>{location || 'Set Location'}</Text>
            </TouchableOpacity>

            {mapVisible && (
                <View style={styles.mapContainer}>
                    <MapView
                        style={styles.map}
                        initialRegion={region}
                        onRegionChangeComplete={setRegion}
                    >
                        {region && <Marker coordinate={region} />}
                    </MapView>
                    <TouchableOpacity style={styles.button} onPress={getLocation}>
                        <Text style={styles.buttonText}>Confirm Location</Text>
                    </TouchableOpacity>
                </View>
            )}

            <TouchableOpacity style={styles.button} onPress={handleSave}>
                <Text style={styles.buttonText}>SUBMIT</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        marginBottom: 5,
        marginTop:25,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#CCCCCC',
        padding: 10,
        fontSize: 16,
        borderRadius: 5,
        marginBottom: 15,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    label: {
        fontSize: 18,
        color: '#000',
    },
    locationButton: {
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#DDD',
        borderRadius: 5,
    },
    locationText: {
        fontSize: 16,
        color: '#000',
    },
    mapContainer: {
        height: 200,
        marginBottom: 20,
    },
    map: {
        flex: 1,
    },
    button: {
        backgroundColor: '#FF7A00',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
    }
});

export default EditMechanicProfileScreen;