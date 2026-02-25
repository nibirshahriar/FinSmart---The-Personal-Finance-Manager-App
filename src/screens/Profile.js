import {
  StyleSheet,
  Text,
  View,
  Switch,
  Image,
  Pressable,
  ScrollView,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import tailwind from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useTheme } from "../context/ThemeContext";
import {
  getAuth,
  signOut,
  updateProfile,
} from "@react-native-firebase/auth";

const Profile = () => {
  // GLOBAL THEME
  const { isDarkMode, setIsDarkMode } = useTheme();

  const auth = getAuth();
  const user = auth.currentUser;

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);

  // Display logic
  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    user?.phoneNumber ||
    "User";

  const contactInfo =
    user?.email || user?.phoneNumber || "No contact info available";

  // Initial
  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  // Update Name
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }

    try {
      await updateProfile(user, {
        displayName: newName,
      });
      Alert.alert("Success", "Name updated!");
      setIsEditing(false);
      setNewName("");
    } catch (error) {
      Alert.alert("Error", "Update failed");
    }
  };

  // Dummy Photo Change
  const handleChangePhoto = () => {
    Alert.alert("Profile Photo", "Dummy photo updated!");
    setPhotoURL("https://i.pravatar.cc/300");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          await signOut(auth);
        },
      },
    ]);
  };

  const cardBg = isDarkMode ? "#1e293b" : "#f1f5f9";
  const textColor = isDarkMode ? "#fff" : "#000";

  return (
    <View style={[tailwind`flex-1`, { backgroundColor: isDarkMode ? "#0f172a" : "#fff" }]}>
      <ScrollView contentContainerStyle={tailwind`px-5 pt-6 pb-10`}>

        {/* Profile Header */}
        <View style={tailwind`items-center mb-8`}>
          <Pressable onPress={handleChangePhoto}>
            {photoURL ? (
              <Image
                source={{ uri: photoURL }}
                style={tailwind`w-28 h-28 rounded-full`}
              />
            ) : (
              <View
                style={[
                  tailwind`w-28 h-28 rounded-full items-center justify-center`,
                  { backgroundColor: "#3b82f6" },
                ]}
              >
                <Text style={tailwind`text-white text-3xl font-bold`}>
                  {initials}
                </Text>
              </View>
            )}
          </Pressable>

          <Text style={[tailwind`text-2xl font-bold mt-4`, { color: textColor }]}>
            {displayName}
          </Text>

          <Text style={{ color: isDarkMode ? "#94a3b8" : "#6b7280" }}>
            {contactInfo}
          </Text>

          <Pressable
            onPress={() => setIsEditing(!isEditing)}
            style={tailwind`mt-4 px-6 py-2 bg-blue-500 rounded-full`}
          >
            <Text style={tailwind`text-white font-semibold`}>
              {isEditing ? "Close" : "Edit Profile"}
            </Text>
          </Pressable>

          {isEditing && (
            <View style={tailwind`w-full mt-5`}>
              <TextInput
                placeholder="Enter new name"
                value={newName}
                onChangeText={setNewName}
                style={[
                  tailwind`border rounded-xl px-4 py-3`,
                  {
                    borderColor: isDarkMode ? "#334155" : "#d1d5db",
                    color: textColor,
                  },
                ]}
                placeholderTextColor={isDarkMode ? "#94a3b8" : "#6b7280"}
              />

              <Pressable
                onPress={handleUpdateName}
                style={tailwind`mt-3 bg-green-500 py-3 rounded-xl items-center`}
              >
                <Text style={tailwind`text-white font-semibold`}>Save Name</Text>
              </Pressable>
            </View>
          )}
        </View>

        {/* Preferences */}
        <View style={[tailwind`rounded-2xl p-4 mb-4`, { backgroundColor: cardBg }]}>
          <Text style={[tailwind`font-bold mb-3`, { color: textColor }]}>
            Preferences
          </Text>

          <View style={tailwind`flex-row items-center justify-between`}>
            <View style={tailwind`flex-row items-center`}>
              <Ionicons
                name="moon-outline"
                size={22}
                color={textColor}
              />
              <Text style={[tailwind`ml-3`, { color: textColor }]}>
                Dark Mode
              </Text>
            </View>
            <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
          </View>
        </View>

        {/* Data & Cloud (Dummy) */}
        <View style={[tailwind`rounded-2xl p-4 mb-4`, { backgroundColor: cardBg }]}>
          <Text style={[tailwind`font-bold mb-3`, { color: textColor }]}>
            Data & Cloud
          </Text>

          <View style={tailwind`flex-row items-center justify-between`}>
            <View style={tailwind`flex-row items-center`}>
              <Ionicons name="cloud-outline" size={22} color={textColor} />
              <Text style={[tailwind`ml-3`, { color: textColor }]}>
                Backup / Sync Status
              </Text>
            </View>
            <Text style={{ color: "#9ca3af", fontSize: 12 }}>
              Synced 2m ago
            </Text>
          </View>
        </View>

        {/* Security (Dummy) */}
        <View style={[tailwind`rounded-2xl p-4 mb-4`, { backgroundColor: cardBg }]}>
          <Text style={[tailwind`font-bold mb-3`, { color: textColor }]}>
            Security
          </Text>

          <Pressable
            onPress={() => Alert.alert("Change Password", "Dummy screen")}
            style={tailwind`flex-row items-center justify-between`}
          >
            <View style={tailwind`flex-row items-center`}>
              <Ionicons name="lock-closed-outline" size={22} color={textColor} />
              <Text style={[tailwind`ml-3`, { color: textColor }]}>
                Change Password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </Pressable>
        </View>

        {/* Logout */}
        <View style={[tailwind`rounded-2xl p-4`, { backgroundColor: isDarkMode ? "#1e293b" : "#fee2e2" }]}>
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
        <View style={tailwind`items-center mt-10`}>
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