// MechanicRegistrationConfirmationScreen.js
import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore'; // Import Firestore modules
import { auth, db } from '../../firebase/firebase.config'; // Import Firebase authentication and Firestore instances
import Icon from 'react-native-vector-icons/Ionicons';

const MechanicRegistrationConfirmationScreen = ({ navigation }) => {
  const [mechanicData, setMechanicData] = useState(null); // State variable to store mechanic data
  const rejectionReasons = [
    "Your skills and experience don't match our requirements.",
    "We have reached the maximum capacity for mechanics at the moment.",
    "There were inconsistencies in the information provided in your application.",
  ];

  useEffect(() => {
    const fetchMechanicData = async () => {
      try {
        const userId = auth.currentUser.uid; // Get current user's UID
        // Query Firestore collection for mechanic data where userId equals
        const q = query(collection(db, "Mechdata"), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);

        // Check if querySnapshot has any documents
        if (!querySnapshot.empty) {
          // If there are documents set mechanic data state to the first document's data
          querySnapshot.forEach((doc) => {
            setMechanicData(doc.data());
          });
        } else {
          // If no documents found, handle accordingly
          console.log("No mechanic data found for user");
        }
      } catch (e) {
        console.error("Error fetching mechanic data:", e);
        // Handle error
      }
    };

    fetchMechanicData(); // Call the function to fetch mechanic data

  }, []);

  const handleNextSteps = () => {
    navigation.navigate("Drawer")
  };

  return (
    <View style={styles.container}>
       <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={30} color="#000" />
            </TouchableOpacity>
      {mechanicData && (
        <View>
          {mechanicData.status === 'pending' && (
            <View style={styles.subcontainer}>
              <Text style={styles.title}>Registration Submitted! <MaterialIcons name="check-circle" size={24} color="green" /></Text>
            </View>
          )}
          {mechanicData.status === 'pending' && (
            <Text style={styles.description}>
              Your application to join as a mechanic is under review. You will receive a notification once your registration has been approved.
            </Text>
          )}
          {mechanicData.status === 'accepted' && (

          <> 
           
          <Text style={styles.status}>Your request is accepted <MaterialIcons name="check-circle" size={24} color="green" /></Text>
          
                <TouchableOpacity style={styles.button} onPress={handleNextSteps}>
          <Text style={styles.buttonText}>Go to Dashboard</Text>
        </TouchableOpacity>
        </> 
          )}
          {mechanicData.status === 'rejected' && (
            <View>
              <View style={styles.subcontainer}>
                
                <Text style={styles.title}>Registration Rejected! <MaterialIcons name="cancel" size={24} color="red" /></Text>
              </View>
              <Text style={styles.rejected}>Application is rejected with reason: {rejectionReasons[Math.floor(Math.random() * rejectionReasons.length)]}</Text>
            </View>
          )}
        </View>
      )}
      {/* <Text style={styles.info}>
        In the meantime, you can check out the following resources:
      </Text> */}
      

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 300,  
    backgroundColor: '#FFFFFF', 
  },
  backButton: {
    position: 'absolute',
    top: 50,  
    left: 20,
    zIndex: 10,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  subcontainer: {
    flexDirection: 'row',
    backgroundColor: '#daf5e1',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
    color: 'green',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#FF7A00',
    paddingVertical: 15,
    paddingHorizontal: 100,
    borderRadius: 25,
    marginTop: 20,
    width:'90%',
    marginLeft:20,

  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  rejected: {
    fontSize: 16,
    textAlign: 'center',
    color: 'red',
    marginTop: 20,
  }
});

export default MechanicRegistrationConfirmationScreen;
