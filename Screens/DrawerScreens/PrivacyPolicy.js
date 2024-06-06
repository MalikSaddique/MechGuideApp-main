import React from 'react';
import { View, ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons'; 

const PrivacyPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>
      <ScrollView>
        <Text style={styles.title}>Privacy Policy</Text>
        <Text style={styles.paragraph}>
          Effective date: March 18, 2024
        </Text>
        <Text style={styles.paragraph}>
          Welcome to the MechGuide Privacy Policy. Your privacy is critically important to us. At MechGuide, we have a few fundamental principles:
        </Text>
        <Text style={styles.paragraph}>
          - We don’t ask you for personal information unless we truly need it.
          - We don’t share your personal information except to comply with the law, develop our products, or protect our rights.
          - We don’t store personal information on our servers unless required for the on-going operation of one of our services.
        </Text>
        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          Our app is designed to allow you to find and book mechanical services without a fuss. To make this possible, we need to collect certain information from you to provide and improve our services. Here's what we collect and why:
        </Text>
        <Text style={styles.subSectionTitle}>Personal Information</Text>
        <Text style={styles.paragraph}>
          - Account Details: username, password, profile picture.
          - Contact Information: email address, phone number.
          - Location Data: necessary to match you with service providers in your area.
          - Transaction Information: billing details, service history for managing bookings and payments.
        </Text>
        <Text style={styles.subSectionTitle}>Usage Data</Text>
        <Text style={styles.paragraph}>
          - Service Usage: details about how you’ve used the service.
          - Device and Connection Information: We collect device-specific information when you access our services.
        </Text>
        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the information we collect to operate and provide you with the MechGuide service. This includes:
        </Text>
        <Text style={styles.paragraph}>
          - Creating and managing your account.
          - Processing transactions and sending related information such as confirmations and invoices.
          - Sending service announcements, updates, security alerts, and support messages.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, 
    backgroundColor: '#fff',
  },
  backButton: {
    marginLeft: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
    color: '#1A73E8', 
  },
  subSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
    color: '#333333', 
  },
  paragraph: {
    fontSize: 14,
    marginBottom: 10,
    lineHeight: 20,
    textAlign: 'justify',
    paddingHorizontal: 10, 
  },
});

export default PrivacyPolicyScreen;
