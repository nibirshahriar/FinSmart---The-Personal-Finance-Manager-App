import { StatusBar } from "expo-status-bar";
import { StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { ExpenseProvider } from "./src/context/ExpenseContext";
import AppNavigator from "./src/navigation/AppNavigator";
import LoginScreen from "./src/screens/LoginScreen";
import React, { useState } from "react";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

const Root = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { isDarkMode } = useTheme();

  return (
    <>
      <NavigationContainer>
        {isLoggedIn ? (
          <AppNavigator />
        ) : (
          <LoginScreen onLoginSuccess={() => setIsLoggedIn(true)} />
        )}
      </NavigationContainer>

      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <Root />
      </ExpenseProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({});
