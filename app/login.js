import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, Stack } from "expo-router";
import { COLORS } from "../constants"; // Adjust path to match your project

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  // Step 2: Form Validation
  const validateForm = () => {
    if (!email || !password) {
      Alert.alert("Validation Error", "Please fill in all fields.");
      return false;
    }

    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(email)) {
      Alert.alert("Validation Error", "Invalid email format.");
      return false;
    }

    return true;
  };

  // Step 3: Authenticate User
  const handleLogin = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("userDetails");

      if (!storedUser) {
        Alert.alert("Login Error", "No user found. Please sign up first.");
        return;
      }

      const parsedUser = JSON.parse(storedUser);

      if (email === parsedUser.email && password === parsedUser.password) {
        Alert.alert("Success", "Logged in successfully!");
        router.push("/home"); // Navigate to home screen
      } else {
        Alert.alert("Login Error", "Incorrect email or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert("Error", "Something went wrong.");
    }
  };

  // Step 4: Handle Login Button Press
  const handleLoginPress = () => {
    if (validateForm()) {
      handleLogin();
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.lightWhite }}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: COLORS.lightWhite },
          headerShadowVisible: false,
          headerTitle: "Login",
        }}
      />

      <View style={{ padding: 20 }}>
        {/* Step 1: UI Components */}
        <TextInput
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            marginBottom: 10,
          }}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={{
            borderColor: "#ccc",
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            marginBottom: 20,
          }}
          placeholder="Enter your password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Button title="Login" onPress={handleLoginPress} />

        {/* Navigation Prompt */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 15,
          }}
        >
          <Text>Don't have an account?</Text>
          <TouchableOpacity onPress={() => router.push("/signup")}>
            <Text style={{ color: "blue", marginLeft: 5 }}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;
