import React, { useState, useEffect } from "react";
import { PermissionsAndroid, Platform, View } from "react-native";
import Geolocation from "@react-native-community/geolocation";

export const LocationUtil = () => {
  const [currentLongitude, setCurrentLongitude] = useState("...");
  const [currentLatitude, setCurrentLatitude] = useState("...");
  const [locationStatus, setLocationStatus] = useState("");

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "ios") {
        getOneTimeLocation();
        subscribeLocationLocation();
      } else {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: "Location Access Required",
              message: "This App needs to Access your location",
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            //To Check, If Permission is granted
            getOneTimeLocation();
            subscribeLocationLocation();
          } else {
            setLocationStatus("Permission Denied");
          }
        } catch (err) {
          console.warn(err);
        }
      }
    };
    requestLocationPermission();
    return () => {
      Geolocation.clearWatch(watchID);
    };
  }, []);
  const getOneTimeLocation = async () => {
    setLocationStatus("Getting Location ...");

    Geolocation.getCurrentPosition(
      //Will give you the current location
      async (position) => {
        setLocationStatus("You are Here");
        console.log("You are Heren ...");

        const currentLongitude = await JSON.stringify(
          position.coords.longitude
        );

        console.log("location utile ", currentLongitude);
        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);
        let data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);

        //Setting Longitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  };

  const subscribeLocationLocation = () => {
    watchID = Geolocation.watchPosition(
      (position) => {
        //Will give you the location on location change

        setLocationStatus("You are Here");
        // console.log(position);

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);

        //getting the Latitude from the location json
        const currentLatitude = JSON.stringify(position.coords.latitude);

        //Setting Longitude state
        setCurrentLongitude(currentLongitude);
        console.log("location utile ", currentLongitude);

        //Setting Latitude state
        setCurrentLatitude(currentLatitude);
      },
      (error) => {
        setLocationStatus(error.message);
      },
      {
        enableHighAccuracy: false,
        maximumAge: 1000,
      }
    );
  };

  return {
    currentLongitude,
    currentLatitude,
  };
};
