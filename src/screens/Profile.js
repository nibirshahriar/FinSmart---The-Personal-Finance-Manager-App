import {
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import React from "react";
import tailwind from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useTheme } from "../context/ThemeContext";
import { getAuth, signOut } from "@react-native-firebase/auth";

const Profile = () => {
  //GLOBAL THEME from Context
  const { isDarkMode, setIsDarkMode } = useTheme();

  const auth = getAuth();
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await signOut(auth);
          } catch (error) {
            Alert.alert("Error", "Logout failed");
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#0f172a" : "#ffffff" },
      ]}
    >
      <ScrollView
        contentContainerStyle={tailwind`px-5 pt-6 flex-grow`}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Header */}
        <View style={tailwind`items-center mb-6`}>
          <Image
            source={{
              uri:
                user?.photoURL ||
                "https://img.icons8.com/color/150/user-male-circle--v1.png",
            }}
            style={tailwind`w-24 h-24 rounded-full mb-3`}
          />
          <Text
            style={[
              tailwind`text-xl font-bold`,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            {user?.email?.split("@")[0] || "User"}
          </Text>
          <Text style={{ color: isDarkMode ? "#94a3b8" : "#6b7280" }}>
            {user?.email || "No email available"}
          </Text>
        </View>

        {/* Preferences */}
        <View
          style={[
            tailwind`rounded-2xl p-3.5 mb-4`,
            { backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" },
          ]}
        >
          <Text
            style={[
              tailwind`font-bold`,
              { color: isDarkMode ? "#fff" : "#374151" },
            ]}
          >
            Preferences
          </Text>

          <View style={tailwind`flex-row items-center justify-between mt-2`}>
            <View style={tailwind`flex-row items-center`}>
              <Ionicons
                name="moon-outline"
                size={22}
                color={isDarkMode ? "#fff" : "#555"}
              />
              <Text
                style={[
                  tailwind`ml-3`,
                  { color: isDarkMode ? "#fff" : "#374151" },
                ]}
              >
                Dark Mode
              </Text>
            </View>

            <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
          </View>
        </View>

        {/* Data & Cloud */}
        <View
          style={[
            tailwind`rounded-2xl p-4 mb-4`,
            { backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" },
          ]}
        >
          <Text
            style={[
              tailwind`font-bold mb-3`,
              { color: isDarkMode ? "#fff" : "#374151" },
            ]}
          >
            Data & Cloud
          </Text>

          <View style={tailwind`flex-row items-center justify-between`}>
            <View style={tailwind`flex-row items-center`}>
              <Ionicons
                name="cloud-outline"
                size={22}
                color={isDarkMode ? "#fff" : "#555"}
              />
              <Text
                style={[
                  tailwind`ml-3`,
                  { color: isDarkMode ? "#fff" : "#374151" },
                ]}
              >
                Backup / Sync Status
              </Text>
            </View>
            <Text style={{ color: "#9ca3af", fontSize: 12 }}>
              Last synced 5m ago
            </Text>
          </View>
        </View>

        {/* Security */}
        <View
          style={[
            tailwind`rounded-2xl p-4 mb-4`,
            { backgroundColor: isDarkMode ? "#1e293b" : "#f1f5f9" },
          ]}
        >
          <Text
            style={[
              tailwind`font-bold mb-3`,
              { color: isDarkMode ? "#fff" : "#374151" },
            ]}
          >
            Security
          </Text>

          <View style={tailwind`flex-row items-center justify-between`}>
            <View style={tailwind`flex-row items-center`}>
              <Ionicons
                name="lock-closed-outline"
                size={22}
                color={isDarkMode ? "#fff" : "#555"}
              />
              <Text
                style={[
                  tailwind`ml-3`,
                  { color: isDarkMode ? "#fff" : "#374151" },
                ]}
              >
                Change Password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </View>
        </View>

        {/* Logout */}
        <View
          style={[
            tailwind`rounded-2xl p-4 mb-6`,
            { backgroundColor: isDarkMode ? "#1e293b" : "#fee2e2" },
          ]}
        >
          <Pressable
            onPress={handleLogout}
            style={tailwind`flex-row items-center justify-center`}
          >
            <Ionicons
              name="log-out-outline"
              size={22}
              color={isDarkMode ? "#f87171" : "#dc2626"}
            />
            <Text
              style={[
                tailwind`ml-3 font-bold`,
                { color: isDarkMode ? "#f87171" : "#dc2626" },
              ]}
            >
              Logout
            </Text>
          </Pressable>
        </View>

        {/* Footer */}
        <View style={tailwind`items-center mb-6`}>
          <Text style={tailwind`text-gray-400 text-sm`}>
            FinSmart v{Constants.expoConfig?.version}
          </Text>
          <Text style={tailwind`text-gray-400 text-xs`}>
            Your Personal Finance Manager
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
