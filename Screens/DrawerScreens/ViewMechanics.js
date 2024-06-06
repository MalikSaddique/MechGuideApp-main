import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from "../../firebase/firebase.config";
import { collection, getDocs } from "firebase/firestore";
import P2PChat from '../../ChatMessaging/P2PChat';

const MechanicsListScreen = ({ navigation }) => {
  const [mechanics, setMechanics] = useState([]);

  useEffect(() => {
    const fetchMechanics = async () => {
      try {
        const mechanicsRef = collection(db, 'Mechanicprofile_details');
        const snapshot = await getDocs(mechanicsRef);
        const mechanicsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setMechanics(mechanicsData);
        console.log(mechanicsData)
      } catch (error) {
        console.error('Error fetching mechanics:', error);
      }
    };

    fetchMechanics();
  }, []);

  const handleChatPress = (mechanicId) => {
    const userId = auth.currentUser.uid;
    const roomId = `${userId}_${mechanicId}`;
    navigation.navigate('Chatting', { roomId, userId, mechanicId });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mechanics List</Text>
      </View>
      <FlatList
        data={mechanics}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
            <TouchableOpacity 
            style={styles.mechanicItem} 
            onPress={() => navigation.navigate('ViewMechanicsDetail', { mechanicId: item.id })}>
            <Text style={styles.title}>{item.name} - {item.shopName}</Text>
            <Text style={styles.details}>Services Offered: {item.servicesOffered}</Text>
            <Text style={styles.details}>Location: {item.location}</Text>
            <Text style={styles.details}>Pricing: {item.pricing}</Text>
            <Text style={styles.details}>Availability: {item.availability ? 'Available' : 'Not Available'}</Text>
            <View style={styles.actions}>
              <TouchableOpacity 
                style={styles.chatButton} 
                onPress={() => handleChatPress(item.id)}
              >
                <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />
                <Text style={styles.chatButtonText}>Chat</Text>
              </TouchableOpacity>
            </View>
            </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f4f4',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7A00',
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginTop: 30,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    marginLeft: 20,
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 10,
  },
  mechanicItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 20,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  details: {
    fontSize: 16,
    color: '#666',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF7A00',
    borderRadius: 5,
    padding: 10,
  },
  chatButtonText: {
    color: '#fff',
    marginLeft: 5,
  },
});

export default MechanicsListScreen;
