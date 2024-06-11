import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator,Image } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';

const ViewuserLocation = ({ route }) => {
  const { userLocation } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default location in case geocoding fails
  const defaultLocation = {
    latitude: 33.6844,
    longitude: 73.0479,
  };

  useEffect(() => {
    const getLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          setCurrentLocation(defaultLocation);
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const currentLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentLocation(currentLoc);
      } catch (error) {
        console.error('Error getting location permission:', error);
        setCurrentLocation(defaultLocation);
      }
    };

    getLocationPermission();
  }, []);

  useEffect(() => {
    if (currentLocation) {
      fetchRoute(currentLocation, userLocation);
      fitMapToMarkers(currentLocation, userLocation);
    }
  }, [currentLocation, userLocation]);

  const fetchRoute = async (startLoc, endLoc) => {
    try {
      const startLat = startLoc.latitude.toFixed(6);
      const startLng = startLoc.longitude.toFixed(6);
      const endLat = endLoc.latitude.toFixed(6);
      const endLng = endLoc.longitude.toFixed(6);

      const url = `http://router.project-osrm.org/route/v1/driving/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=polyline`;
      const resp = await fetch(url);
      const respJson = await resp.json();

      console.log('Route response:', respJson);

      if (respJson.routes && respJson.routes.length > 0) {
        const points = polyline.decode(respJson.routes[0].geometry);
        const routeCoords = points.map(point => ({
          latitude: point[0],
          longitude: point[1],
        }));
        setRouteCoordinates(routeCoords);
      } else {
        console.error('No routes found in response:', respJson);
      }
    } catch (error) {
      console.error('Error fetching route:', error);
    } finally {
      setLoading(false);
    }
  };

  const fitMapToMarkers = (currentLoc, userLoc) => {
    const minLat = Math.min(currentLoc.latitude, userLoc.latitude);
    const maxLat = Math.max(currentLoc.latitude, userLoc.latitude);
    const minLng = Math.min(currentLoc.longitude, userLoc.longitude);
    const maxLng = Math.max(currentLoc.longitude, userLoc.longitude);

    const midLat = (minLat + maxLat) / 2;
    const midLng = (minLng + maxLng) / 2;

    const deltaLat = maxLat - minLat;
    const deltaLng = maxLng - minLng;

    setRegion({
      latitude: midLat,
      longitude: midLng,
      latitudeDelta: deltaLat * 1.5,
      longitudeDelta: deltaLng * 1.5,
    });
  };

  if (loading || !currentLocation) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        initialRegion={region}
      >
        <Marker
          coordinate={currentLocation}
          title="Mechanic Location"
          description="Mechanic is here"
        >
          <Image
            source={require('../../../../assets/car_224280.png')} // Replace with your image path
            style={{ width: 50, height: 50 }}
            resizeMode="contain"
          />
        </Marker>
        <Marker coordinate={userLocation} title="User Location" pinColor="red" />
        {routeCoordinates.length > 0 && (
          <Polyline
            coordinates={routeCoordinates}
            strokeWidth={5}
            strokeColor="blue"
          />
        )}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ViewuserLocation;
