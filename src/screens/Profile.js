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
  ActivityIndicator,
  PermissionsAndroid,
  Platform,
  Modal,
} from "react-native";
import React, { useState } from "react";
import tailwind from "twrnc";
import { Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { useTheme } from "../context/ThemeContext";
import { useExpenses } from "../context/ExpenseContext";
import { getAuth, signOut, updateProfile } from "@react-native-firebase/auth";
import storage from "@react-native-firebase/storage";
import { launchImageLibrary } from "react-native-image-picker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

const Profile = () => {
  const { isDarkMode, setIsDarkMode } = useTheme();
  const { expenses } = useExpenses();

  const auth = getAuth();
  const user = auth.currentUser;

  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState("");
  const [photoURL, setPhotoURL] = useState(user?.photoURL || null);
  const [loading, setLoading] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);

  const displayName =
    user?.displayName ||
    user?.email?.split("@")[0] ||
    user?.phoneNumber ||
    "User";

  const contactInfo =
    user?.email || user?.phoneNumber || "No contact info available";

  const initials = displayName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

  // ================= IMAGE PICK PERMISSION =================
  const requestGalleryPermission = async () => {
    if (Platform.OS === "android") {
      if (Platform.Version >= 33) {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
        );
      } else {
        await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        );
      }
    }
  };

  // ================= PICK IMAGE =================
  const handlePickImage = async () => {
    setPhotoModal(false);
    await requestGalleryPermission();

    const result = await launchImageLibrary({
      mediaType: "photo",
      quality: 0.7,
    });

    if (result.didCancel) return;

    const image = result.assets[0];
    uploadImage(image.uri);
  };

  // ================= UPLOAD IMAGE TO FIREBASE =================
  const uploadImage = async (uri) => {
    try {
      setLoading(true);
      const ref = storage().ref(`profilePics/${user.uid}.jpg`);
      await ref.putFile(uri);
      const downloadURL = await ref.getDownloadURL();

      await updateProfile(user, { photoURL: downloadURL });
      setPhotoURL(downloadURL);

      Alert.alert("Success", "Profile photo updated!");
    } catch (err) {
      Alert.alert("Error", "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= REMOVE PHOTO =================
  const handleRemovePhoto = async () => {
    try {
      setLoading(true);
      setPhotoModal(false);

      const ref = storage().ref(`profilePics/${user.uid}.jpg`);
      await ref.delete();
      await updateProfile(user, { photoURL: null });

      setPhotoURL(null);
      Alert.alert("Removed", "Profile photo removed");
    } catch {
      Alert.alert("Error", "Could not remove photo");
    } finally {
      setLoading(false);
    }
  };

  // ================= UPDATE NAME =================
  const handleUpdateName = async () => {
    if (!newName.trim()) {
      Alert.alert("Error", "Name cannot be empty");
      return;
    }
    try {
      await updateProfile(user, { displayName: newName });
      setIsEditingName(false);
      setNewName("");
      Alert.alert("Success", "Name updated!");
    } catch {
      Alert.alert("Error", "Update failed");
    }
  };

  // ================= PDF EXPORT =================
  const handleExportPDF = async () => {
    try {
      if (!expenses || expenses.length === 0) {
        Alert.alert("No Data", "No transactions available");
        return;
      }

      const totalIncome = expenses
        .filter((i) => i.type === "income")
        .reduce((sum, i) => sum + Number(i.amount), 0);

      const totalExpense = expenses
        .filter((i) => i.type === "expense")
        .reduce((sum, i) => sum + Number(i.amount), 0);

      const rows = expenses
        .map(
          (item) => `
          <tr>
            <td>${item.category || "-"}</td>
            <td>${item.type}</td>
            <td>Tk ${item.amount}</td>
          </tr>
        `,
        )
        .join("");

      const html = `
        <html>
          <body>
            <h1>FinSmart Financial Report</h1>
            <p>User: ${displayName}</p>
            <p>Date: ${new Date().toLocaleDateString()}</p>
            <hr/>
            <p>Total Income: Tk ${totalIncome}</p>
            <p>Total Expense: Tk ${totalExpense}</p>
            <p>Balance: Tk ${totalIncome - totalExpense}</p>
            <hr/>
            <table border="1" cellpadding="5" cellspacing="0" width="100%">
              <tr>
                <th>Category</th>
                <th>Type</th>
                <th>Amount</th>
              </tr>
              ${rows}
            </table>
          </body>
        </html>
      `;

      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri);
    } catch (error) {
      Alert.alert("Error", "Failed to generate PDF");
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => await signOut(auth),
      },
    ]);
  };

  const bg = isDarkMode ? "#0f172a" : "#ffffff";
  const cardBg = isDarkMode ? "#1e293b" : "#f1f5f9";
  const textColor = isDarkMode ? "#ffffff" : "#000000";

  return (
    <View style={[tailwind`flex-1`, { backgroundColor: bg }]}>
      <ScrollView contentContainerStyle={tailwind`px-5 pt-6 pb-10`}>
        {/* ================= PROFILE HEADER ================= */}
        <View style={tailwind`items-center mb-8`}>
          <Pressable onPress={() => setPhotoModal(true)}>
            {loading ? (
              <ActivityIndicator size="large" color="#3b82f6" />
            ) : photoURL ? (
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

            {/* Camera overlay icon */}
            <View
              style={tailwind`absolute bottom-0 right-0 bg-blue-500 p-2 rounded-full`}
            >
              <Ionicons name="camera" size={16} color="#fff" />
            </View>
          </Pressable>

          {/* Editable Name */}
          <View style={tailwind`flex-row items-center mt-4`}>
            {isEditingName ? (
              <>
                <TextInput
                  value={newName}
                  onChangeText={setNewName}
                  style={[
                    tailwind`border px-3 py-1 rounded-lg`,
                    { borderColor: "#ccc", color: textColor },
                  ]}
                />
                <Pressable onPress={handleUpdateName} style={tailwind`ml-2`}>
                  <Ionicons name="checkmark-circle" size={22} color="#22c55e" />
                </Pressable>
              </>
            ) : (
              <>
                <Text
                  style={[tailwind`text-2xl font-bold`, { color: textColor }]}
                >
                  {displayName}
                </Text>
                <Pressable
                  onPress={() => {
                    setNewName(displayName);
                    setIsEditingName(true);
                  }}
                  style={tailwind`ml-2`}
                >
                  <Ionicons name="create-outline" size={20} color="#6b7280" />
                </Pressable>
              </>
            )}
          </View>

          <Text style={{ color: "#6b7280", marginTop: 4 }}>{contactInfo}</Text>
        </View>

        {/* DARK MODE */}
        <View
          style={[tailwind`rounded-2xl p-4 mb-6`, { backgroundColor: cardBg }]}
        >
          <View style={tailwind`flex-row justify-between items-center`}>
            <Text style={{ color: textColor }}>Dark/Light Mode</Text>
            <Switch value={isDarkMode} onValueChange={setIsDarkMode} />
          </View>
        </View>

        {/* EXPORT PDF */}
        <View
          style={[tailwind`rounded-2xl p-4 mb-4`, { backgroundColor: cardBg }]}
        >
          <Pressable
            onPress={handleExportPDF}
            style={tailwind`flex-row items-center justify-between`}
          >
            <Text style={{ color: textColor }}>Export Data as PDF</Text>
            <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
          </Pressable>
        </View>

        {/* LOGOUT */}
        <View
          style={[
            tailwind`rounded-2xl p-4`,
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

        <View style={tailwind`items-center mt-10`}>
          <Text style={tailwind`text-gray-400 text-sm`}>
            FinSmart v{Constants.expoConfig?.version}
          </Text>
        </View>
      </ScrollView>

      {/* PHOTO MODAL */}
      <Modal visible={photoModal} transparent animationType="slide">
        <View style={tailwind`flex-1 justify-end bg-black bg-opacity-40`}>
          <View style={tailwind`bg-white p-6 rounded-t-3xl`}>
            <Pressable onPress={handlePickImage}>
              <Text style={tailwind`text-lg mb-4`}>Change Photo</Text>
            </Pressable>

            {photoURL && (
              <Pressable onPress={handleRemovePhoto}>
                <Text style={tailwind`text-red-500 text-lg`}>Remove Photo</Text>
              </Pressable>
            )}

            <Pressable
              onPress={() => setPhotoModal(false)}
              style={tailwind`mt-6 items-center`}
            >
              <Text style={tailwind`text-gray-500`}>Cancel</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
