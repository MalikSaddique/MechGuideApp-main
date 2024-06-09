import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'To create an account, click on the "Register" button on the login screen and fill out the required information.',
  },
  {
    question: 'How can I reset my password?',
    answer: 'You can reset your password by clicking on the "Change Password" link on the login screen and following the instructions.',
  },
  {
    question: 'How do I request a service?',
    answer: 'To request a service, navigate to the "Request Service" screen, choose your desired service, and submit the request.',
  },
  
];

const FAQScreen = ({ navigation }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else {
      setExpandedIndex(index);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={30} color="#000" style={styles.backButton} />
      </TouchableOpacity>
      <Text style={styles.title}>Frequently Asked Question (FAQs)</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={styles.faqContainer}>
          <TouchableOpacity onPress={() => toggleFAQ(index)} style={styles.questionContainer}>
            <Text style={styles.question}>{faq.question}</Text>
            <Ionicons name={expandedIndex === index ? 'chevron-up' : 'chevron-down'} size={24} color="#000" />
          </TouchableOpacity>
          {expandedIndex === index && <Text style={styles.answer}>{faq.answer}</Text>}
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  backButton: {
    marginBottom: 20,
    marginTop:30
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    marginLeft:20
  },
  faqContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#DDD',
    paddingBottom: 10,
  },
  questionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  question: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  answer: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});

export default FAQScreen;
