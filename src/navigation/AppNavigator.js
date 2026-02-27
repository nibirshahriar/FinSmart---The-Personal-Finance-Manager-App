import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

import Home from "../screens/Home";
import Create from "../screens/Create";
import Insights from "../screens/Insights";
import Category from "../screens/Category";
import Profile from "../screens/Profile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
// Bottom Tabs
function MyTabs() {
  const { isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        // Tab Icons
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Insights") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },

        // Active / Inactive Colors
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: isDarkMode ? "#94a3b8" : "gray",

        // Tab Bar Style (Safe)
        tabBarStyle: {
          backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
          borderTopColor: isDarkMode ? "#1e293b" : "#e5e7eb",
          borderTopWidth: 1,
        },

        tabBarHideOnKeyboard: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Create" component={Create} />
      <Tab.Screen name="Insights" component={Insights} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

// Stack Navigator
export default function AppNavigator() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar
        barStyle={isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={isDarkMode ? "#0f172a" : "#ffffff"}
      />

      <Stack.Navigator>
        <Stack.Screen
          name="FinSmart"
          component={MyTabs}
          options={{
            headerStyle: {
              backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
              height: 80,
            },
            headerTintColor: isDarkMode ? "#ffffff" : "#0f172a",
            headerTitleStyle: {
              fontSize: 22,
              fontWeight: "800",
              letterSpacing: 1,
            },

            headerTitleAlign: "center",
            headerShadowVisible: false,
          }}
        />

        <Stack.Screen
          name="Category"
          component={Category}
          options={{
            presentation: "modal",
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </>
  );
}
