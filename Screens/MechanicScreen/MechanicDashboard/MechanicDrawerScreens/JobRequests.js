import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from "../../../../firebase/firebase.config";
import { collection, getDocs, getDoc, query, where, doc, updateDoc } from "firebase/firestore";

const JobRequestsScreen = ({ navigation }) => {
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added state for loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true); // Set loading to true while fetching data
        // Fetch data from User_Request_of_services collection for current user
        const requestSnapshot = await getDocs(query(collection(db, "User_Request_of_services"), where("mechanicId", "==", auth.currentUser.uid)));
        const requestData = requestSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Request data:", requestData);

        setServices(requestData);
        setIsLoading(false); 
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleAccept = async (item) => { // Use the entire item object
    try {
      console.log(item.userid)
      const docRef = doc(db, "User_Request_of_services", item.id);
      await updateDoc(docRef, {
        status: "accepted",
      });
      const updatedData = services.map((service) => {
        if (service.userid === item.userid) {
          return { ...service, status: "accepted" };
        }
        return service;
      });
      setServices(updatedData);
    } catch (error) {
      console.error("Error accepting application: ", error);
    }
  };

  const handleReject = async (item) => {
    try {
      // Check if the document exists
      const docRef = doc(db, "User_Request_of_services", item.id);
      const docSnapshot = await getDoc(docRef);

      if (docSnapshot.exists()) {
        // Update the document
        await updateDoc(docRef, {
          status: "rejected",
        });

        // Update the local state
        const updatedServices = services.map((service) => {
          if (service.userid === item.userid) {
            return { ...service, status: "rejected" };
          }
          return service;
        });

        setServices(updatedServices);
      } else {
        console.log("Document does not exist");
      }
    } catch (error) {
      console.error("Error rejecting application: ", error);
    }
  };

  const handleChatPress = (item) => {
    const mechanicId = auth.currentUser.uid;
    const roomId = `${item.userid}_${mechanicId}`; // Create a unique room ID based on user and mechanic IDs
    navigation.navigate('MechanicChat', { roomId, mechanicId });
  };

  const renderServiceItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.title}>{item.name}</Text>
      <Text style={styles.detail}>Service Need: {item.serviceNeed}</Text>
      <Text style={styles.detail}>Email: {item.email}</Text>
      <Text style={styles.detail}>Phone: {item.phone}</Text>
      {item.status === "accepted" ? (
        <>
          <Text style={[styles.status, styles.acceptedStatus]}>You Accept this Request.</Text>
          <TouchableOpacity style={[styles.button, styles.rejectButton2]} onPress={() => handleReject(item)}>
            <Text style={styles.buttonText}>View the user Location</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.chatButton]} onPress={() => handleChatPress(item)}>
            <Text style={styles.buttonText}>Chat</Text>
          </TouchableOpacity>
        </>
      ) : item.status === "rejected" ? (
        <>
          <Text style={[styles.status, styles.rejectedStatus]}>You Reject this Request.</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(item)}>
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item)}>
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.acceptButton]} onPress={() => handleAccept(item)}>
            <Text style={styles.buttonText}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.rejectButton]} onPress={() => handleReject(item)}>
            <Text style={styles.buttonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>User's Requests</Text>
      </View>
      {isLoading ? (
        // Display loading indicator while data is being fetched
        <Text>Loading requests...</Text>
      ) : (
        <FlatList
          data={services}
          keyExtractor={(item) => item.userid} // Use unique identifier (e.g., userid)
          renderItem={renderServiceItem}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  acceptedStatus: {
    color: 'green',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  rejectedStatus: {
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center'
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
  card: {
    backgroundColor: '#fff',
    padding: 20,
    marginVertical: 8,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  detail: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 5,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    backgroundColor: '#F44336',
  },
  rejectButton2: {
    marginTop: 20,
    backgroundColor: 'blue',
  },
  chatButton: {
    marginTop: 10,
    backgroundColor: '#FF7A00',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default JobRequestsScreen;
