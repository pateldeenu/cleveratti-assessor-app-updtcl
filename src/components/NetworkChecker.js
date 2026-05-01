import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, Animated, Easing,
} from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Icon from "react-native-vector-icons/FontAwesome";
import normalize from "react-native-normalize";

const NetworkChecker = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [showBanner, setShowBanner] = useState(false);
  const [isReconnected, setIsReconnected] = useState(false);
  const translateY = new Animated.Value(-100);

  const slideIn = () => {
    Animated.timing(translateY, {
      toValue: 0,
      duration: 400,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  };

  const slideOut = (callback) => {
    Animated.timing(translateY, {
      toValue: -100,
      duration: 400,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(callback);
  };

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const connected = state.isConnected && state.isInternetReachable;

      if (!connected) {
        // No network — show red banner
        setIsConnected(false);
        setIsReconnected(false);
        setShowBanner(true);
        slideIn();
      } else {
        // Network restored
        setIsConnected(true);
        setIsReconnected(true);
        setShowBanner(true);
        slideIn();

        // Auto hide green banner after 3 seconds
        setTimeout(() => {
          slideOut(() => {
            setShowBanner(false);
            setIsReconnected(false);
          });
        }, 3000);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!showBanner) return null;

  return (
    <Animated.View
      style={[
        styles.banner,
        { transform: [{ translateY }] },
        isConnected ? styles.connectedBanner : styles.disconnectedBanner,
      ]}
    >
      <Icon
        name={isConnected ? "wifi" : "exclamation-triangle"}
        size={16}
        color="#fff"
        style={styles.icon}
      />
      <View style={styles.textContainer}>
        <Text style={styles.title}>
          {isConnected ? "Back Online!" : "No Internet Connection"}
        </Text>
        <Text style={styles.subtitle}>
          {isConnected
            ? "Your connection has been restored. Everything is back to normal."
            : "Please check your Wi-Fi or mobile data. The app will reconnect automatically."}
        </Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  banner: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    elevation: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  disconnectedBanner: {
    backgroundColor: "#D32F2F",
  },
  connectedBanner: {
    backgroundColor: "#2E7D32",
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    color: "#fff",
    fontSize: normalize(13),
    fontFamily: "Lato-Bold",
    fontWeight: "bold",
    marginBottom: 2,
  },
  subtitle: {
    color: "#fff",
    fontSize: normalize(11),
    fontFamily: "Lato-Bold",
    lineHeight: 16,
    opacity: 0.9,
  },
});

export default NetworkChecker;