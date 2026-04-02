import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";

import { ExpenseProvider } from "./src/context/ExpenseContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";

import { TourProvider } from "./src/context/TourContext";

const Root = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        {user ? <AppNavigator /> : <AuthNavigator />}
      </NavigationContainer>

      <StatusBar style={isDarkMode ? "light" : "dark"} />
    </>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ExpenseProvider>
        <TourProvider>
          <Root />
        </TourProvider>
      </ExpenseProvider>
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
