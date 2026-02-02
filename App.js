import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ExpenseProvider } from "./src/context/ExpenseContext";
import AppNavigator from "./src/navigation/AppNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import React, { useState } from "react";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <ExpenseProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <AppNavigator />
        ) : (
          <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
      </NavigationContainer>

      <StatusBar style="auto" />
    </ExpenseProvider>
  );
}

const styles = StyleSheet.create({});
