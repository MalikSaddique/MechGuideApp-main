import React,  { useState } from 'react';
import { Alert } from 'react-native';
import { signOut } from "firebase/auth";
import { auth } from '../../firebase/firebase.config';
import { useNavigation } from '@react-navigation/native';
const handleLogout = async (navigation) => {
    // const navigation= useNavigation();
    try {
        await signOut(auth);
        console.log("User signed out successfully");
        Alert.alert(
            "Signed Out",
            "You have been signed out successfully.",
            
            [
                { 
                    text: "OK", 
                    onPress: () => navigation.replace("Login") 
                }
            ]
        );
    } catch (error) {
        console.error("Logout failed", error);
        Alert.alert("Logout Failed", "Unable to sign out. Please try again.");
    }
};
export default handleLogout;
