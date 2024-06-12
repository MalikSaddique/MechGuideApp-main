import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, FlatList, TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebase/firebase.config';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const Skill_and_service = () => {
  const [mechanic, setMechanic] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMechanicDetails = async () => {
      try {
        const userId = auth.currentUser.uid;
        const mechanicDoc = doc(db, 'Mechanicprofile_details', userId);
        const mechanicSnapshot = await getDoc(mechanicDoc);

        if (mechanicSnapshot.exists()) {
          setMechanic(mechanicSnapshot.data());
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching mechanic details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMechanicDetails();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#FF7A00" style={styles.loader} />;
  }

  if (!mechanic) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Mechanic details not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{mechanic.shopName}</Text>
      <FlatList
        data={[
          { key: 'Services Offered', value: mechanic.servicesOffered },
          { key: 'Location', value: mechanic.location },
          { key: 'Pricing', value: mechanic.pricing },
          { key: 'Availability', value: mechanic.availability ? 'Available' : 'Not Available' },
        ]}
        renderItem={({ item }) => (
          <View style={styles.listItem}>
            <Text style={styles.listKey}>{item.key}</Text>
            <Text style={styles.listValue}>{item.value}</Text>
          </View>
        )}
        keyExtractor={(item) => item.key}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            navigation.navigate('MechEditDetails')
        }}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#FF0000' }]}
          onPress={() => {

        }}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
    padding: 20,
    marginTop:60
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  listKey: {
    fontSize: 18,
    color: '#666',
    width: '40%',
  },
  listValue: {
    fontSize: 18,
    color: '#333',
    width: '60%',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',

  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
});

export default Skill_and_service;
