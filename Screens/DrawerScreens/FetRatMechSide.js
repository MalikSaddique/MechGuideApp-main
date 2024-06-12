import { View, Text, StyleSheet, FlatList, Image,TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { db,auth } from '../../firebase/firebase.config';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { useImagePicker } from '../../hooks/ImagePickerHook';

const FetRatMechSide = () => {
  const [ratings, setRatings] = useState([]);
  const { profileImage, handleProfileImagePress } = useImagePicker();
  const [userData , setUserData]=useState();
const mechanicId=auth.currentUser.uid
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingsQuery = query(
          collection(db, 'MechanicRatings'),
          where('mechanicId', '==', mechanicId)
        );
        const querySnapshot = await getDocs(ratingsQuery);
        const fetchedRatings = querySnapshot.docs.map(doc => doc.data());
        setRatings(fetchedRatings);
      } catch (error) {
        console.error('Error fetching ratings:', error);
      }
    };

    fetchRatings();
  }, [mechanicId]);
  const renderRating = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.userInfo}>
        <TouchableOpacity style={styles.profileContainer} onPress={handleProfileImagePress}>
    <Image
        source={
            profileImage ? { uri: profileImage } :
            (userData && userData.profileImageUrl) ? { uri: userData.profileImageUrl } :
            require('../../assets/Icons/userDefault.png')
        }
        style={styles.profileImage}
    />
</TouchableOpacity>

          <Text style={styles.userName}>{item.userName}</Text>
        </View>
        <Text style={{ ...styles.rating, color: 'red' }}>
          {Array(item.rating).fill('\u2605').join('')}
        </Text>
      </View>
      <Text style={styles.comment}>{item.comment}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mechanic Ratings</Text>
      {ratings.length > 0 ? (
        <FlatList
          data={ratings}
          renderItem={renderRating}
          keyExtractor={(item, index) => index.toString()}
        />
      ) : (
        <Text>No ratings available</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f4f4f4',
    marginTop:60
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  profileImage: {
    width: 30,
    height: 30,
    borderRadius: 40,
    
    },
  card: {
    padding: 15,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePicture: {
    width: 20,
    height: 20,
    borderRadius: 15,
    marginRight: 10,
    borderColor:'black',
    borderWidth:2,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft:10
  },
  rating: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  comment: {
    marginTop: 10,
    fontSize: 14,
    color: '#555',
  },
});

export default FetRatMechSide;