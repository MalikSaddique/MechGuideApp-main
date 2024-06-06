import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from './LoginScreen.js';

const { width, height } = Dimensions.get('window');

const StartScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
        <View style={styles.triangleCorner} />
        
      <Image
        source={require('../assets/MechGuideLogo/LogoMechGuide.png')} 
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>MechGuide</Text>
      <Text style={styles.tagline}>Find the Right Mechanic For You</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')} 
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
      <View style={styles.triangleCornerBottom} />
    </View>
    
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#425DA0', 
  },

  logo: {
    width: width * 0.6, // 60% of screen width
    height: height * 0.3, // 30% of screen height
    marginBottom: 20,
    //borderRadius:360,
    flexShrink:0,
  },
  title: {
    fontSize: width * 0.1, // Dynamic size based on screen width
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  tagline: {
    fontSize: width * 0.035, // Smaller font size for tagline
    color: '#FFFFFF',
    marginBottom: 40,
  },
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    width:270,
    height:83,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',// Button background color
    flexShrink:0, 
  },
  buttonText: {
    fontSize: width * 0.0700, // Dynamic size based on screen width
    color: '#000000', // Button text color
    fontWeight: 'bold',
    fontFamily:'Roboto',
   // lineHeight:'normal',
   textAlign:'center',
   top: height*0.020,
   flexShrink:0
  },
});

export default StartScreen;
