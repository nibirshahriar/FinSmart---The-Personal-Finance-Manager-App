import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Home from "../screens/Home";
import Create from "../screens/Create";
import Insights from "../screens/Insights"; 
import Category from "../screens/Category";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Bottom Tabs
function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Create") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Insights") {
            iconName = focused ? "stats-chart" : "stats-chart-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Create" component={Create} />
      <Tab.Screen name="Insights" component={Insights} />
    </Tab.Navigator>
  );
}

// Stack Navigator
  //inside stack--> we will call our bottom tabs as one of the screens
export default function AppNavigator() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
      <Stack.Navigator>
        <Stack.Screen
          name="FinSmart"
          component={MyTabs}
          options={{
            headerStyle: {
              backgroundColor: "#0f172a",
              height: 90,
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontSize: 22,
              fontWeight: "bold",
              paddingTop: 40,
            },
            headerTitleAlign: "center",
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
