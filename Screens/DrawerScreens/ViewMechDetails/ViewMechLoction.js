import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import MapView, { Marker, Polyline } from 'react-native-maps';
import * as Location from 'expo-location';
import polyline from '@mapbox/polyline';

const ViewMechLocation = ({ route }) => {
  const { mechlocation } = route.params;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [region, setRegion] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [routeCoordinates, setRouteCoordinates] = useState([]);
  const [mechanicLocation, setMechanicLocation] = useState(null);

  // Default mechanic location in case geocoding fails
  const defaultMechanicLocation = {
    latitude: 33.6844,
    longitude: 73.0479,
  };

  useEffect(() => {
    const fetchMechanicLocation = async (address) => {
      try {
        const apiKey = 'f697cb451b7e4329829f1fbf639c1a81';  // Replace with your OpenCage API key
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`
        );
        const data = await response.json();

        console.log('Geocoding response:', data);

        if (data && data.results && data.results.length > 0) {
          const { lat, lng } = data.results[0].geometry;
          setMechanicLocation({
            latitude: parseFloat(lat),
            longitude: parseFloat(lng),
          });
        } else {
          setMechanicLocation(defaultMechanicLocation);
          console.error('Geocoding failed: No results found');
        }
      } catch (error) {
        setMechanicLocation(defaultMechanicLocation);
        console.error('Geocoding error:', error);
      }
    };

    const getLocationPermission = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permission to access location was denied');
          setCurrentLocation(defaultMechanicLocation);
          setRegion({
            ...defaultMechanicLocation,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
          return;
        }

        let location = await Location.getCurrentPositionAsync({});
        const currentLoc = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        };

        setCurrentLocation(currentLoc);
        setRegion({
          ...currentLoc,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });

        if (mechanicLocation) {
          fetchRoute(currentLoc, mechanicLocation);
        }
      } catch (error) {
        console.error('Error getting location permission:', error);
        setCurrentLocation(defaultMechanicLocation);
        setRegion({
          ...defaultMechanicLocation,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      }
    };

    fetchMechanicLocation(mechlocation);
    getLocationPermission();
  }, [mechlocation]);

  useEffect(() => {
    if (currentLocation && mechanicLocation) {
      fetchRoute(currentLocation, mechanicLocation);
    }
  }, [currentLocation, mechanicLocation]);

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
    }
  };

  if (!currentLocation || !mechanicLocation) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        region={region}
        showsUserLocation={true}
        initialRegion={region}
      >
        <Marker coordinate={mechanicLocation} title="Mechanic Location" />
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
});

export default ViewMechLocation;
