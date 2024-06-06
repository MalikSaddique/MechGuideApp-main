import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert, TouchableOpacity, Dimensions, ScrollView, 
    KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from "../../../../firebase/firebase.config.js";
import { collection, addDoc } from "firebase/firestore";

const { width } = Dimensions.get('window');
const emojis = ["😀", "😐", "😔"];

const FeedbackForm = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [suggestions, setSuggestions] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');

  const handleEmojiSelect = (emoji) => {
    setSelectedEmoji(emoji);
  };

  const handleSubmit = async () => {
    if (!username || !email || !selectedEmoji ) {
      Alert.alert('Error', 'Please fill out all fields before submitting.');
      return;
    }

    try {
      const docRef = await addDoc(collection(db, "MechanicsComplaint"), {
        username,
        email,
        selectedEmoji,
        suggestions,
        createdAt: new Date().toISOString()
      });
      console.log("Document written with ID: ", docRef.id);
      Alert.alert('Success', 'Thank you for your feedback!');
      setUsername('');
      setEmail('');
      setSelectedEmoji('');
      setSuggestions('');
    } catch (error) {
      Alert.alert('Error', 'Failed to submit your feedback.');
      console.error(error);
    }
  };

  return (
    <KeyboardAvoidingView
     behavior={Platform.OS === "android" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.title}>Feedback & Complaints</Text>
          <TextInput
            style={styles.input}
            onChangeText={setUsername}
            value={username}
            placeholder="Enter your username"
          />
          <TextInput
            style={styles.input}
            onChangeText={setEmail}
            value={email}
            placeholder="Enter your email"
          />
          <Text style={styles.label}>How was your experience?</Text>
          <View style={styles.emojiContainer}>
            {emojis.map((emoji, index) => (
                <TouchableOpacity key={index} style={styles.emojiButton} onPress={() => handleEmojiSelect(emoji)}>
                  <Text style={styles.emojiText}>{emoji}</Text>
                </TouchableOpacity>
              ))}
          </View>
          <Text style={styles.label}>Selected Mood: {selectedEmoji}</Text>

          <TextInput
            style={styles.inputLarge}
            onChangeText={setSuggestions}
            value={suggestions}
            placeholder="Write your complaint here..."
            multiline
          />
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    paddingTop: 20,
    marginBottom: 20,
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
  inputLarge: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    padding: 10,
    fontSize: 16,
    borderRadius: 5,
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  emojiContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  emojiText: {
    fontSize: 35,
  },
  label: {
    fontSize: 16,
    color: '#000',
    marginBottom: 10,
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

export default FeedbackForm;
