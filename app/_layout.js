import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ThemeProvider } from "../context/ThemeProvider";

// Set initial route
export const unstable_settings = {
  initialRouteName: "login",
};

const Layout = () => {
  // State to manage loading and login status
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Load custom fonts
  const [fontsLoaded] = useFonts({
    DMBold: require("../assets/fonts/DMSans-Bold.ttf"),
    DMMedium: require("../assets/fonts/DMSans-Medium.ttf"),
    DMRegular: require("../assets/fonts/DMSans-Regular.ttf"),
  });

  // Check login state on mount
  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const user = await AsyncStorage.getItem("userDetails");
        if (user) {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Error checking login state:", error);
      }
      setIsLoading(false);
    };

    checkLoginState();
  }, []);

  // Show loading screen if fonts or login state are loading
  if (isLoading || !fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Return the app layout wrapped in the ThemeProvider
  return (
    <ThemeProvider>
      <Stack
        initialRouteName={isLoggedIn ? "home" : "login"}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="login" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="home" />
      </Stack>
    </ThemeProvider>
  );
};

export default Layout;