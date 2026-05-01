import MapView, { PROVIDER_GOOGLE } from "react-native-maps";
import {
  View,
  Text,
  StyleSheet,
  Linking,
  Platform,
  PermissionsAndroid,
  SafeAreaView,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import Geolocation from "@react-native-community/geolocation";
import { request, PERMISSIONS, RESULTS } from "react-native-permissions";
import normalize from "react-native-normalize";
import RNAndroidLocationEnabler from "react-native-android-location-enabler";
import MenuIcon from "../../components/MenuIcon";
import { COLORS } from "../../constants/Theme";

// Utility functions
const isAndroid = () => Platform.OS === "android";

const openSettings = () => {
  try {
    Linking.openSettings();
  } catch {
    // ignore
  }
};

const requestLocationPermission = async () => {
  if (isAndroid()) {
    const gpsEnabled = await RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
      interval: 10000,
      fastInterval: 5000,
    }).catch(() => false);
    if (!gpsEnabled) {
      openSettings();
      return false;
    }

    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: "Permissions required",
        message: "We need location access to show your position on map.",
        buttonPositive: "OK",
      }
    );
    return granted === PermissionsAndroid.RESULTS.GRANTED;
  } else {
    const result = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    return result === RESULTS.GRANTED;
  }
};

const LoadMapScreen = ({ navigation, route }) => {
  const initialAddress = route?.params?.currentAddress || "";
  const [latitude, setLatitude] = useState(25.2072);
  const [longitude, setLongitude] = useState(83.0231);
  const [address, setAddress] = useState("Current Address:\n" + initialAddress);

  const reverseGeocode = async (lat, lng) => {
    try {
      const apiKey = "AIzaSyDD-Gze8P_KTq2PVxk_j15RNQPJS0rqf58"; // Replace this with your valid key
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
      const res = await fetch(url);
      const js = await res.json();
      const formatted = js.results?.[0]?.formatted_address;
      if (formatted) {
        setAddress("Current Address:\n" + formatted);
      }
    } catch (err) {
      console.warn("Reverse geocode failed", err);
    }
  };

  const getCurrentLocation = (retry = false) => {
    Geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude: lat, longitude: lng } = pos.coords;
        setLatitude(lat);
        setLongitude(lng);
        await reverseGeocode(lat, lng);
      },
      (err) => {
        console.warn("Geolocation error:", err);
        if (err.code === 3 /* timeout */ && !retry) {
          setTimeout(() => getCurrentLocation(true), 2000);
        } else {
          Alert.alert("Location Error", err.message);
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 30000,
        maximumAge: 1000,
        distanceFilter: 0,
        forceRequestLocation: true,
        showLocationDialog: true,
      }
    );
  };

  useEffect(() => {
    (async () => {
      const granted = await requestLocationPermission();
      if (granted) {
        getCurrentLocation();
      } else {
        Alert.alert("Permission Denied", "Location access is required for this screen.");
      }
    })();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        {/* {route?.attendacePage !== "attendacePage" && (
          <View style={styles.header}>
            <MenuIcon onPress={() => navigation.goBack()} back="back" />
            <Text style={styles.headText}>Current Location</Text>
          </View>
        )} */}

        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={{
            latitude,
            longitude,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
          showsUserLocation
          showsMyLocationButton
          zoomEnabled
        />
        {route?.attendacePage !== "attendacePage" && (
          <View style={styles.card}>
            <Text style={styles.addressText}>{address}</Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

export default LoadMapScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4292ff",
  },
  headText: {
    fontWeight: "bold",
    fontSize: normalize(18),
    color: "#fff",
    alignSelf: "center",
    width: "70%",
    textAlign: "center",
  },
  map: {
    flex: 1,
  },
  card: {
    position: "absolute",
    bottom: 20,
    width: "90%",
    alignSelf: "center",
    backgroundColor: "#fff",
    padding: normalize(10),
    borderRadius: 12,
    elevation: 6,
  },
  addressText: {
    fontSize: normalize(16),
    color: COLORS.black,
    textAlign: "center",
  },
});