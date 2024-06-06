import React from 'react';
import { View, Text , StyleSheet, Dimensions} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faHome, faEnvelope, faStar, faWallet } from '@fortawesome/free-solid-svg-icons';
import UserLocationScreen from '../Screens/UserCurrentLocationScreen';

const { width, height } = Dimensions.get('window');

const Tab = createBottomTabNavigator();

function MyTabs() {
const RequestsScreen = () => <View><Text>Requests Screen</Text></View>;
const RatingsScreen = () => <View><Text>Ratings Screen</Text></View>;
const WalletScreen = () => <View><Text>Wallet Screen</Text></View>;
    
  return (
    // <NavigationContainer>
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'UserLocationScreen') {
          iconName = faHome;
        } else if (route.name === 'Requests') {
          iconName = faEnvelope;
        } else if (route.name === 'Ratings') {
          iconName = faStar;
        } else if (route.name === 'Wallet') {
          iconName = faWallet;
        }
        return <FontAwesomeIcon icon={iconName} size={focused ? 25 : 20} color={color} />;
      },
      tabBarActiveTintColor: '#000000', // Active icon color
      tabBarInactiveTintColor: 'white', // Inactive icon color
      tabBarLabelStyle: styles.tabBarLabelStyle,
      tabBarStyle: styles.tabBarStyle,
    })}
  >
        <Tab.Screen name="UserLocationScreen" component={UserLocationScreen} options={{ tabBarLabel: 'Emergency Assistance' }} />
        <Tab.Screen name="Requests" component={RequestsScreen} options={{ tabBarLabel: 'Payment Method' }} />
        <Tab.Screen name="Ratings" component={RatingsScreen} options={{ tabBarLabel: 'Instructions for Mechanic' }} />
        <Tab.Screen name="Wallet" component={WalletScreen} options={{ tabBarLabel: 'Select Service' }} />
      </Tab.Navigator>
    // </NavigationContainer>
  );
}


const styles = StyleSheet.create({
    tabBarStyle: {
      marginTop:height * 0.010,
      backgroundColor: '#FF7A00', // Tab bar background color
     borderTopColor: 'transparent', // No border top
      height: 70, // Height of tab bar
      paddingBottom: 5, // Padding bottom
      borderRadius:15,
    },
    tabBarLabelStyle: {
      marginBottom: 5, // Lower the label
    },
  });

export default MyTabs;
