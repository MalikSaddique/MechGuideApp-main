import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

const NotificationSettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [updatesEnabled, setUpdatesEnabled] = useState(false);

  const toggleNotifications = async () => {
    const newValue = !notificationsEnabled;
    setNotificationsEnabled(newValue);
    await AsyncStorage.setItem('notificationsEnabled', JSON.stringify(newValue));
  };

  const toggleUpdates = async () => {
    const newValue = !updatesEnabled;
    setUpdatesEnabled(newValue);
    await AsyncStorage.setItem('updatesEnabled', JSON.stringify(newValue));
  };

  const loadSettings = async () => {
    const notificationsValue = await AsyncStorage.getItem('notificationsEnabled');
    const updatesValue = await AsyncStorage.getItem('updatesEnabled');

    if (notificationsValue !== null) {
      setNotificationsEnabled(JSON.parse(notificationsValue));
    }
    if (updatesValue !== null) {
      setUpdatesEnabled(JSON.parse(updatesValue));
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={30} color="#000" style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.title}>Notification Settings</Text>
      
      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
        />
      </View>

      <View style={styles.settingContainer}>
        <Text style={styles.settingText}>Enable Updates</Text>
        <Switch
          value={updatesEnabled}
          onValueChange={toggleUpdates}
        />
      </View>
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
    marginTop:30,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft:60
  },
  settingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
  },
  settingText: {
    fontSize: 18,
  },
});

export default NotificationSettingsScreen;
