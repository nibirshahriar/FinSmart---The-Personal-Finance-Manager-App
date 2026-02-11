import { StatusBar } from "expo-status-bar";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";

import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";

import { ExpenseProvider } from "./src/context/ExpenseContext";
import { ThemeProvider, useTheme } from "./src/context/ThemeContext";

import AppNavigator from "./src/navigation/AppNavigator";
import AuthNavigator from "./src/navigation/AuthNavigator";

const Root = () => {
  const [user, setUser] = useState(undefined);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });

    return unsubscribe;
  }, []);

  //Loading while checking auth state
  if (user === undefined) {
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
        <Root />
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
