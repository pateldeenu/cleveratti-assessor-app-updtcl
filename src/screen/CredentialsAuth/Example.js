import React, { useState, useEffect } from "react";
import { PermissionsAndroid, Platform, View } from "react-native";
//import Geolocation from "@react-native-community/geolocation";
import Geolocation from 'react-native-geolocation-service';
import { useDispatch, useSelector } from "react-redux";
import { setLatLong } from "../../redux/Actions/BasicAction";

const Example = () => {
  const [currentLongitude, setCurrentLongitude] = useState("...");
  const [currentLatitude, setCurrentLatitude] = useState("...");
  const [locationStatus, setLocationStatus] = useState("");
  const dispatch = useDispatch();
  const dataLatLong = useSelector((state) => state.basic_reducer.latLong);

  useEffect(() => {
    const requestLocationPermission = async () => {
      if (Platform.OS === "ios") {
        getOneTimeLocation();
        subscribeLocationLocation();
        getOneTimeLocations();
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
            getOneTimeLocations();
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

        //getting the Longitude from the location json
        const currentLongitude = JSON.stringify(position.coords.longitude);
        const currentLatitude = JSON.stringify(position.coords.latitude);

        let data = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        console.log("--:location data---", data);
        dispatch(setLatLong(data));
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
  return <View></View>;
};

export default Example;

export const getOneTimeLocations = async (dispatch) => {
  return new Promise((resolve, reject) => {
    Geolocation.getCurrentPosition(
      async (position) => {
        try {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

          const data = { latitude, longitude };
          console.log("--:export location data---", data);

          resolve(data);
        } catch (err) {
          reject(err);
        }
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: false,
        timeout: 30000,
        maximumAge: 1000,
      }
    );
  });
};
