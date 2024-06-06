import React, { useState, useEffect, useRef } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { storage } from '../firebase/firebase.config';
import io from 'socket.io-client';

const socket = io('http://192.168.10.99:3000');

const P2PChat = ({ route }) => {
  const { roomId, userId } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const flatListRef = useRef();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchMessages = async () => {
      const storedMessages = await AsyncStorage.getItem(`messages_${roomId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    };
    fetchMessages();

    socket.emit('join', roomId);
    console.log(`User ${userId} joined room ${roomId}`);

    const handleMessage = (data) => {
      console.log('Message received:', data);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, data];
        AsyncStorage.setItem(`messages_${roomId}`, JSON.stringify(newMessages));
        return newMessages;
      });
    };

    socket.on('message', handleMessage);

    return () => {
      console.log(`User ${userId} leaving room ${roomId}`);
      socket.off('message', handleMessage);
      socket.emit('leave', roomId);
    };
  }, [roomId, userId]);

  const sendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = {
        text: inputMessage,
        senderId: userId,
        roomId,
        createdAt: new Date().toISOString(),
      };
      console.log('Sending message:', newMessage);
      socket.emit('message', newMessage);
      setMessages((prevMessages) => {
        const newMessages = [...prevMessages, newMessage];
        AsyncStorage.setItem(`messages_${roomId}`, JSON.stringify(newMessages));
        return newMessages;
      });
      setInputMessage('');
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      uploadImage(result.uri);
    }
  };

  const uploadImage = async (uri) => {
    const response = await fetch(uri);
    const blob = await response.blob();
    const ref = storage.ref().child(`images/${new Date().getTime()}-${userId}`);
    const snapshot = await ref.put(blob);
    const downloadURL = await snapshot.ref.getDownloadURL();
    sendImageMessage(downloadURL);
  };

  const sendImageMessage = (imageURL) => {
    const newMessage = {
      image: imageURL,
      senderId: userId,
      roomId,
      createdAt: new Date().toISOString(),
    };
    console.log('Sending image message:', newMessage);
    socket.emit('message', newMessage);
    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, newMessage];
      AsyncStorage.setItem(`messages_${roomId}`, JSON.stringify(newMessages));
      return newMessages;
    });
  };

  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.senderId === userId ? styles.myMessageContainer : styles.theirMessageContainer]}>
      <View style={item.senderId === userId ? styles.myMessage : styles.theirMessage}>
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.chatImage} />
        ) : (
          <Text style={styles.messageText}>{item.text}</Text>
        )}
        <Text style={styles.messageTime}>{new Date(item.createdAt).toLocaleTimeString()}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerName}>Michael Tony</Text>
        </View>
        <View style={styles.headerIcons}>
          <Ionicons name="notifications" size={24} color="white" />
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </View>
      </View>
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(item, index) => index.toString()}
        ref={flatListRef}
        onContentSizeChange={() => flatListRef.current.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current.scrollToEnd({ animated: true })}
        contentContainerStyle={styles.chatContainer}
      />
      <View style={styles.inputContainer}>
        <TextInput
          value={inputMessage}
          onChangeText={setInputMessage}
          placeholder="Type message here..."
          style={styles.input}
        />
        <TouchableOpacity onPress={pickImage} style={styles.sendButton}>
          <Ionicons name="image" size={24} color="white" />
        </TouchableOpacity>
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ECECEC',
  },
  header: {
    backgroundColor: '#425DA0',
    paddingTop: 40,
    paddingHorizontal: 10,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerContent: {
    flex: 1,
    marginLeft: 10,
    padding: 15,
  },
  headerName: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerIcons: {
    flexDirection: 'row',
  },
  chatContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  myMessageContainer: {
    justifyContent: 'flex-end',
  },
  theirMessageContainer: {
    justifyContent: 'flex-start',
  },
  myMessage: {
    backgroundColor: '#425DA0',
    borderRadius: 20,
    padding: 10,
    maxWidth: '70%',
    alignSelf: 'flex-end',
  },
  theirMessage: {
    backgroundColor: '#ECECEC',
    borderRadius: 20,
    padding: 10,
    maxWidth: '70%',
    alignSelf: 'flex-start',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  messageTime: {
    color: 'white',
    fontSize: 12,
    textAlign: 'right',
    marginTop: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    height: 40,
    borderRadius: 20,
    borderColor: '#425DA0',
    borderWidth: 1,
    paddingHorizontal: 10,
  },
  sendButton: {
    backgroundColor: '#425DA0',
    borderRadius: 20,
    padding: 10,
    marginLeft: 10,
  },
  chatImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    margin: 10,
  },
});

export default P2PChat;
