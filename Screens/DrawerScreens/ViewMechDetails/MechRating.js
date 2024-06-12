import React, { useState } from 'react';
import { View, Text, StyleSheet, Button, Alert, TextInput } from 'react-native';
import StarRating from 'react-native-star-rating';
import { auth, db } from '../../../firebase/firebase.config';
import { collection, getDocs, addDoc, getDoc, query, where, doc } from "firebase/firestore";
import { ViewPropTypes } from 'deprecated-react-native-prop-types';
const MechRating = ({ route, navigation }) => {
  const { mechanicId } = route.params;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  // Function to handle the submission of the rating and comment
  const handleRatingSubmit = async () => {
    if (rating === 0) {
      Alert.alert('Please provide a rating before submitting.');
      return;
    }

    try {
      // Check if the user has already rated this mechanic
      const existingRatingQuery = query(
        collection(db, 'MechanicRatings'),
        where('mechanicId', '==', mechanicId),
        where('userId', '==', auth.currentUser.uid)
      );
      const existingRatingSnapshot = await getDocs(existingRatingQuery);

      if (!existingRatingSnapshot.empty) {
        Alert.alert('You have already rated this mechanic.');
        return;
      }

      // Get user data to include with the rating
      const userRef = doc(db, 'users', auth.currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        // Add the new rating and comment to the 'MechanicRatings' collection
        await addDoc(collection(db, 'MechanicRatings'), {
          mechanicId,
          userId: auth.currentUser.uid,
          userName: userData.name,
          rating,
          comment,
          createdAt: new Date().toISOString(),
        });

        Alert.alert('Thank you!', 'Your rating and comment have been submitted.');
        navigation.goBack();
      } else {
        console.log('No user document!');
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      Alert.alert('Error', 'Failed to submit your rating.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rate the Mechanic's Service</Text>
      <StarRating
        disabled={false}
        maxStars={5}
        rating={rating}
        selectedStar={(rating) => setRating(rating)}
        fullStarColor={'#FFD700'}
        starSize={30}
      />
      <TextInput
        style={styles.commentInput}
        placeholder="Leave a comment"
        value={comment}
        onChangeText={setComment}
        multiline
      />
      <Button title="Submit Rating" onPress={handleRatingSubmit} color="#FF7A00" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  commentInput: {
    height: 100,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    marginTop: 20,
    marginBottom: 20,
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
});

export default MechRating;
