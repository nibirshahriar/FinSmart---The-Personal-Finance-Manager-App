import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  View,
  ActivityIndicator,
} from "react-native";

import {
  getAuth,
  signInWithEmailAndPassword,
} from "@react-native-firebase/auth";

import { Ionicons, FontAwesome } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both Email and Password");
      return;
    }

    try {
      setLoading(true);

      await signInWithEmailAndPassword(auth, email.trim(), password);

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert(
          "Login Failed",
          "Please sign in with a valid account or create a new one.",
        );
      } else if (error.code === "auth/wrong-password") {
        Alert.alert("Login Failed", "Incorrect password.");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Login Failed", "Invalid email format.");
      } else {
        Alert.alert("Login Failed", error.message);
      }
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>FinSmart</Text>

      <Image
        source={require("../../assets/chat.png")}
        style={styles.headerImage}
      />

      <Text style={styles.title}>Welcome Back</Text>
      <Text style={styles.subtitle}>
        Login to continue managing your income and expenses.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>LOGIN</Text>
        )}
      </TouchableOpacity>

      {/* Divider */}
      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      {/* Social Buttons */}
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={() => Alert.alert("Info", "Google Login coming soon!")}
        >
          <FontAwesome name="google" size={18} color="#db4437" />
          <Text style={styles.googleText}> Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.phoneButton]}
          onPress={() => Alert.alert("Info", "Phone Login coming soon!")}
        >
          <Ionicons name="call-outline" size={18} color="#fff" />
          <Text style={styles.phoneText}> Login with Phone</Text>
        </TouchableOpacity>
      </View>

      {/* Signup */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don’t have an account?</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Signup")}>
          <Text style={styles.signupButtonText}>Create Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  logo: {
    fontSize: 45,
    fontWeight: "bold",
    color: "#1f2937",
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#111827",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 30,
    marginTop: 5,
  },
  input: {
    width: "100%",
    height: 55,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#f9fafb",
  },
  button: {
    backgroundColor: "#2e7d32",
    width: "100%",
    height: 55,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
    width: "100%",
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#e5e7eb",
  },
  orText: {
    marginHorizontal: 10,
    color: "#9ca3af",
    fontWeight: "600",
  },
  socialRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
  },
  socialButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 5,
    flexDirection: "row",
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#db4437",
  },
  phoneButton: {
    backgroundColor: "#111827",
  },
  googleText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#333",
  },
  phoneText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#fff",
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: 30,
    alignItems: "center",
  },
  signupText: {
    color: "#6b7280",
    fontSize: 14,
  },
  signupButtonText: {
    marginLeft: 6,
    color: "#2e7d32",
    fontWeight: "700",
    fontSize: 14,
  },
  headerImage: {
    width: 280,
    height: 150,
    resizeMode: "contain",
    marginVertical: 10,
  },
});
