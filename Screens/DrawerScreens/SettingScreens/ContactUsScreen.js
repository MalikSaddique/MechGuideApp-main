import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const ContactUsScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendEmail = () => {
    if (!name || !email || !message) {
      Alert.alert('Error', 'Please fill out all fields.');
      return;
    }

    setLoading(true);

    fetch('http://localhost:3000/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        email,
        message,
      }),
    })
      .then((response) => response.text())
      .then((responseText) => {
        setLoading(false);
        Alert.alert('Success', 'Your message has been sent.');
        setName('');
        setEmail('');
        setMessage('');
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert('Error', 'Failed to send your message. Please try again later.');
        console.error('Failed to send email:', error);
      });
  };

  // emailjs.send('service_5wusm6y', 'template_d2wmn0k', templateParams, 'z4dcRFK_pMr0F_2Vv')
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.title}>Contact Us</Text>

      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Message"
        value={message}
        onChangeText={setMessage}
        multiline
      />

      <TouchableOpacity style={styles.sendButton} onPress={handleSendEmail} disabled={loading}>
        <Text style={styles.sendButtonText}>{loading ? 'Sending...' : 'Send'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginBottom: 20,
    marginTop: 30
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft: 100
  },
  input: {
    height: 50,
    borderColor: '#DDD',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  sendButton: {
    backgroundColor: '#FF7A00',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ContactUsScreen;
