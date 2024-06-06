// MechanicDrawer.js
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import handleLogout from '../../DrawerScreens/LogOut';

const MechanicDrawer = () => {
  const navigation=useNavigation();
  return (
    <DrawerContentScrollView>
      <View style={styles.drawerHeader}>
        <Text style={styles.headerText}>Mechanic Panel</Text>
      </View>

      {/* Dashboard/Home */}
      <DrawerItem
        label="Dashboard"
        icon={({ size }) => <Icon name="speedometer-outline" size={size} />}
        onPress={() => {}}
      />

      {/* Job Requests */}
      <DrawerItem
        label="Job Requests"
        icon={({ size }) => <Icon name="construct-outline" size={size} />}
        onPress={() => navigation.navigate('JobRequests')}
      />

      {/* Service History */}
      <DrawerItem
        label="Service History"
        icon={({ size }) => <Icon name="time-outline" size={size} />}
        onPress={() => {     }}
      />

      {/* Earnings */}
      <DrawerItem
        label="Feedback and Complaints"
        icon={({ size }) => <Icon name="chatbubble-outline" size={size} />}
        onPress={() =>navigation.navigate('MechComplaint') }
      />

      {/* Profile & Settings */}
      <DrawerItem
        label="Profile & Settings"
        icon={({ size }) => <Icon name="person-circle-outline" size={size} />}
         onPress={() => navigation.navigate('MechProfile')}
      />

      {/* Availability Calendar */}
      {/* <DrawerItem
        label="Availability Calendar"
        icon={({ size }) => <Icon name="calendar-outline" size={size} />}
        onPress={() => {     }}
      /> */}

      {/* Skills & Services */}
      <DrawerItem
        label="Skills & Services"
        icon={({ size }) => <Icon name="hammer-outline" size={size} />}
        onPress={() => {     }}
      />

      {/* Ratings & Reviews */}
      {/* <DrawerItem
        label="Ratings & Reviews"
        icon={({ size }) => <Icon name="star-outline" size={size} />}
        onPress={() => {     }}
      /> */}

      {/* Support/Help Center */}
      {/* <DrawerItem
        label="Support/Help Center"
        icon={({ size }) => <Icon name="help-circle-outline" size={size} />}
        onPress={() => {     }}
      /> */}

      {/* Log Out */}
      <DrawerItem
        label="Log Out"
        onPress={() => handleLogout(navigation)}
        icon={({ size }) => <Icon name="log-out-outline" size={size} />}
        // onPress={handleLogout(navigation)}
      />
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  drawerHeader: {
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Other styles...
});

export default MechanicDrawer;
