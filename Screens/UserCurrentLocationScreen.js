import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Dimensions, Platform, Alert, TouchableOpacity, TextInput, FlatList, Text } from 'react-native';
import MapView, { Marker, Polyline, Heatmap } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import OptionBottomSheet from './BottomSheet/OptionBottomSheet';
import { DrawerActions } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const UserLocationScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [address, setAddress] = useState('');
  const [mapRegion, setMapRegion] = useState(null);
  const bottomSheetRef = useRef(null);
  const [customMarkers, setCustomMarkers] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.BestForNavigation,
      });
      setLocation(currentLocation);
      setMapRegion({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      });
    })();
  }, []);

  const handleRegionChange = (region) => {
    if (!mapRegion || 
        Math.abs(region.latitude - mapRegion.latitude) > 0.0001 || 
        Math.abs(region.longitude - mapRegion.longitude) > 0.0001 || 
        Math.abs(region.latitudeDelta - mapRegion.latitudeDelta) > 0.0001 || 
        Math.abs(region.longitudeDelta - mapRegion.longitudeDelta) > 0.0001) {
      // console.log("Region changed:", region);
      setMapRegion(region);
    }
  };

  const openBottomSheet = () => {
    bottomSheetRef.current?.snapToIndex(1);
  };

  const coordinates = [
    { latitude: 37.78825, longitude: -122.4324 },
    { latitude: 37.75825, longitude: -122.4624 },
    { latitude: 37.76825, longitude: -122.4824 },
  ];

  const heatmapPoints = [
    { latitude: 37.78825, longitude: -122.4324, weight: 10 },
    { latitude: 37.75825, longitude: -122.4624, weight: 10 },
    { latitude: 37.76825, longitude: -122.4824, weight: 10 },
  ];

  const handleAddressSearch = async (text) => {
    console.log("handleAddressSearch called with text:", text);
    setAddress(text);
    if (text.length > 2) {
      const apiUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(text)}&format=json&addressdetails=1&limit=5`;
      try {
        const response = await fetch(apiUrl);
        const json = await response.json();
        console.log("Suggestions fetched:", json);
        setSuggestions(json);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionPress = (suggestion) => {
    console.log("Suggestion selected:", suggestion);
    const { lat, lon } = suggestion;
    setMapRegion({
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    console.log("Updated map region:", {
      latitude: parseFloat(lat),
      longitude: parseFloat(lon),
      latitudeDelta: 0.005,
      longitudeDelta: 0.005,
    });
    setAddress(suggestion.display_name);
    setSuggestions([]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Enter an address"
          value={address}
          onChangeText={handleAddressSearch}
          placeholderTextColor="#666"
        />
        <TouchableOpacity onPress={() => handleAddressSearch(address)} style={styles.searchButton}>
          <Ionicons name="ios-search" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {suggestions.length > 0 && (
        <FlatList
          style={styles.suggestionsContainer}
          data={suggestions}
          keyExtractor={(item) => item.place_id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleSuggestionPress(item)}>
              <Text style={styles.suggestionItem}>{item.display_name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
      <TouchableOpacity
        style={styles.menuIcon}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
      >
        <Ionicons name="md-menu" size={32} color="#000" />
      </TouchableOpacity>
      {mapRegion && (
        <MapView
          style={styles.map}
          region={mapRegion}
          onRegionChangeComplete={handleRegionChange}
          showsUserLocation={true}
          showsMyLocationButton={true}
        >
          <Heatmap points={heatmapPoints} />
          {location && (
            <Marker
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="My Location"
              description="You are here"
            />
          )}
          <Polyline
            coordinates={coordinates}
            strokeColor="#000"
            strokeWidth={6}
          />
          {customMarkers.map((marker, index) => (
            <Marker
              key={index}
              coordinate={marker}
            />
          ))}
        </MapView>
      )}
      <TouchableOpacity
        style={styles.grabberWrapper}
        onPress={openBottomSheet}
        activeOpacity={0.8}>
        <View style={styles.grabber} />
      </TouchableOpacity>
      <OptionBottomSheet ref={bottomSheetRef} onOptionPress={openBottomSheet} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  searchContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 100 : 80,
    flexDirection: 'row',
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 7,
    shadowColor: '#000',
    shadowOpacity: 0.9,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 0 },
    elevation: 60,
    zIndex: 5,
    alignItems: 'center',
    opacity: 10,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 25,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 130 : 110,
    width: '90%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    maxHeight: 200,
    borderWidth: 1, 
    borderColor: 'red', 
  },
  suggestionItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionButton: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 10,
    marginVertical: 5,
    width: '90%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastOptionButton: {
    marginBottom: 20,
  },
  optionText: {
    color: '#000000',
  },
  menuIcon: {
    position: 'absolute',
    top: 30,
    left: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  grabberWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    padding: 10,
    borderTopWidth: 5,
    borderTopColor: '#ccc',
  },
  grabber: {
    width: 100,
    height: 7,
    borderRadius: 5,
    backgroundColor: '#FF7A00',
  },
});

export default UserLocationScreen;
