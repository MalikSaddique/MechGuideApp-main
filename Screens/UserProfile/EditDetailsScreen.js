import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../firebase/firebase.config";
import Icon from 'react-native-vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const EditDetailsScreen = ({ navigation }) => {
  const [name, setname] = useState('');
  const [email, setEmail] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const user = auth.currentUser;
        
        if (user) {
          const userRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setname(userData.name || '');
            setEmail(userData.email || '');
            setLocation(userData.location || '');
            setPhone(userData.phone || '');
          } else {
            console.log("No such document!");
          }
        } else {
          console.error("User not found or not logged in.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleSave = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          name: name,
          email: email,
          location: location,
          phone: phone,
        });
        // Update successful, navigate back
        navigation.goBack();
      } else {
        console.error("User not found or not logged in.");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" />
      </TouchableOpacity>
      <Text style={styles.header}>Profile settings</Text>
      <View style={styles.inputContainerPass}>
        <FontAwesome name="user" size={20} style={styles.inputIcon} />
        <TextInput
          value={name}
          onChangeText={setname}
          placeholder="Enter the name"
          style={styles.input}
        />
      </View>

      <View style={styles.inputContainerPass}>
        <FontAwesome name='envelope' size={20} style={styles.inputIcon} />
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          style={styles.input}
          keyboardType="email-address"
        />
      </View>
      <View style={styles.inputContainerPass}>
        <FontAwesome name="phone" size={20} style={styles.inputIcon} />
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone"
          style={styles.input}
          keyboardType="phone-pad"
        />
      </View>
      <View style={styles.inputContainerPass}>
        <FontAwesome name="map-marker" size={20} style={styles.inputIcon} />
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="Location"
          style={styles.input}
        />
      </View>
      <TouchableOpacity onPress={handleSave}>
        <View style={styles.button}>
          <Text style={styles.buttonText}>Save</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  backButton: {
    padding: 10,
  },
  header: {
    color: '#000',
    fontSize: 24,
    fontWeight: 'bold',
    padding: 20,
    textAlign: 'center'
  },
  inputContainerPass: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    width: '100%',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginLeft: 10,
    color: '#6D6A6A',
  },
  input: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    color: '#000',
    marginHorizontal: 20,
    margin: 10,
    paddingVertical: 5,
  },
  button: {
    width: '100%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF7A00',
    marginVertical: 10,
    marginBottom: 10,
  },
  buttonText: {
    fontSize: width * 0.05,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
});

export default EditDetailsScreen;
