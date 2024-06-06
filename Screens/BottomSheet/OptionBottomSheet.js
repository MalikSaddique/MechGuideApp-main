import React, { useMemo, forwardRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';

const OptionBottomSheet = forwardRef(({ onOptionPress }, ref) => {
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  return (
    <BottomSheet style={styles.bottom} ref={ref} index={-1} snapPoints={snapPoints} enablePanDownToClose >
      <View style={styles.contentContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionPress('Emergency Assistance')}>
          <Text style={styles.optionText}>Emergency Assistance</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionPress('Payment Method')}>
          <Text style={styles.optionText}>Payment Method</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionPress('Instructions for Mechanic')}>
          <Text style={styles.optionText}>Instructions for Mechanic</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => onOptionPress('Select Service')}>
          <Text style={styles.optionText}>Select Service</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
});

const styles = StyleSheet.create({
  optionButton: {
    width: '100%',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#cccccc',
    borderColor:'#FF7A00',
    borderWidth:5,
    backgroundColor: '#FFFF', // White background for the buttons
    borderRadius: 10, // Rounded corners
    flexDirection: 'row', // Icon and text in a row
    justifyContent: 'space-between', // Space between icon and text
  },
  optionText: {
    fontSize: 17,
    color: '#FF7A00', // Or another suitable color
    textAlign: 'left',
    marginLeft: 20, // To align text to the left side
    fontWeight:'bold'

  },
});

export default OptionBottomSheet;
