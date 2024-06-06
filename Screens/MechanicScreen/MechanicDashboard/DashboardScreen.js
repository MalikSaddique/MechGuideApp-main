import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import MyTabs from '../../../hooks/UserTabNavigator';

const upcomingAppointments = [
  { id: '1', date: '2024-05-05', time: '10:00 AM', description: 'Oil Change' },
  { id: '2', date: '2024-05-06', time: '02:00 PM', description: 'Tire Replacement' },
];

const notifications = [
  { id: '1', text: 'You have a new job request!' },
  { id: '2', text: 'Customer John Doe left a review.' },
];

const UpcomingAppointments = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Upcoming Appointments</Text>
    <FlatList
      data={upcomingAppointments}
      keyExtractor={item => item.id}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Text style={styles.itemText}>{item.date} at {item.time}</Text>
          <Text style={styles.itemText}>{item.description}</Text>
        </View>
      )}
    />
  </View>
);

const Notifications = () => (
  <View style={styles.sectionContainer}>
    <Text style={styles.sectionTitle}>Notifications</Text>
    {notifications.map(notif => (
      <Text key={notif.id} style={styles.notificationText}>{notif.text}</Text>
    ))}
  </View>
);

const DashboardScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
    <View style={styles.roundedContainer}>
        <TouchableOpacity style={styles.header}
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
          <Ionicons name="menu" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Mechanic Dashboard</Text>
      </View>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="car-sport" size={40} color="#4CAF50" />
          <Text style={styles.cardTitle}>Today</Text>
          <Text style={styles.cardAmount}>$244.0</Text>
          <Text style={styles.cardDetails}>14 Rides - 23H</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="wallet" size={40} color="#FFC107" />
          <Text style={styles.cardTitle}>Wallet Balance</Text>
          <Text style={styles.cardAmount}>$1544.00</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.cardRow}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="calendar" size={40} color="#00BCD4" />
          <Text style={styles.cardTitle}>Appointments</Text>
          <Text style={styles.cardAmount}>6 Scheduled</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="notifications" size={40} color="#9C27B0" />
          <Text style={styles.cardTitle}>Notifications</Text>
          <Text style={styles.cardAmount}>2 New</Text>
        </TouchableOpacity>
      </View>

      <UpcomingAppointments />
      <Notifications />
      <MyTabs />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E7EFF6',
    padding: 20,
  },
  header: {
    backgroundColor: '#FF7A00',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 10,
    flexDirection: 'row',
    // alignItems: 'center',
    // justifyContent: 'space-between',
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    width: '48%', 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 10,
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF7A00',
    marginTop: 5,
  },
  cardDetails: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  cardAction: {
    color: '#FF7A00',
    fontWeight: 'bold',
  },
  roundedContainer: {
    backgroundColor: '#FF7A00',
    borderRadius: 25,
    marginHorizontal: 2,
    marginTop: -10,
    padding: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 10,
    // flexDirection:'row'
  },
  headerText: {
    color: '#fff', 
    fontSize: 22, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    // marginTop: , 
  },
  sectionContainer: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginVertical: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  itemContainer: {
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    padding: 10,
    marginBottom: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#aaa',
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  itemText: {
    fontSize: 16,
    color: '#666',
  },
  notificationText: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

export default DashboardScreen;
