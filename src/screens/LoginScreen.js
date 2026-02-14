import React, { useState, useEffect } from "react";
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
  GoogleAuthProvider,
  signInWithCredential,
  signOut,
} from "@react-native-firebase/auth";

import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Path } from "react-native-svg";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 👈 added
  const [loading, setLoading] = useState(false);

  const auth = getAuth();

  // Google Config
  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "452853908832-sled6oftepvgm1djq102283n3ude68f2.apps.googleusercontent.com",
      offlineAccess: true,
    });
  }, []);

  // Google Logo
  const GoogleIcon = () => (
    <Svg width={20} height={20} viewBox="0 0 48 48">
      <Path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.67 1.22 9.16 3.61l6.83-6.83C35.94 2.24 30.37 0 24 0 14.65 0 6.6 5.48 2.69 13.44l7.98 6.2C12.74 13.05 17.93 9.5 24 9.5z"
      />
      <Path
        fill="#34A853"
        d="M24 48c6.37 0 11.94-2.24 16.01-6.09l-7.39-6.09c-2.04 1.37-4.65 2.18-8.62 2.18-6.07 0-11.26-3.55-13.33-8.64l-7.98 6.2C6.6 42.52 14.65 48 24 48z"
      />
      <Path
        fill="#4A90E2"
        d="M48 24c0-1.57-.15-3.09-.42-4.55H24v9.09h13.5c-.58 3.09-2.29 5.7-4.88 7.45l7.39 6.09C44.9 38.23 48 31.71 48 24z"
      />
      <Path
        fill="#FBBC05"
        d="M10.67 28.36C10.24 27.27 10 25.67 10 24s.24-3.27.67-4.36l-7.98-6.2C1.01 16.96 0 20.38 0 24s1.01 7.04 2.69 10.56l7.98-6.2z"
      />
    </Svg>
  );

  // EMAIL LOGIN
  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Error", "Please enter both Email and Password");
      return;
    }

    try {
      setLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password,
      );

      const user = userCredential.user;

      // Refresh user
      await user.reload();

      // Email verification check
      if (!user.emailVerified) {
        await signOut(auth);

        Alert.alert(
          "Email Not Verified",
          "Please verify your email before logging in.",
          [
            {
              text: "Resend Verification",
              onPress: async () => {
                try {
                  await user.sendEmailVerification();
                  Alert.alert(
                    "Verification Sent",
                    "A new verification email has been sent.",
                  );
                } catch {
                  Alert.alert("Error", "Failed to resend email.");
                }
              },
            },
            { text: "OK" },
          ],
        );

        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);

      if (
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-credential"
      ) {
        Alert.alert(
          "Login Failed",
          "Account not found. Please create a new account.",
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

  // GOOGLE LOGIN
  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      await GoogleSignin.signOut();

      const userInfo = await GoogleSignin.signIn();
      const idToken = userInfo.data?.idToken;

      if (!idToken) {
        Alert.alert("Google Login Failed", "No ID token found");
        return;
      }

      const googleCredential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, googleCredential);
    } catch (error) {
      Alert.alert("Google Login Failed", error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.logo}>FinSmart</Text>

      <Image
        source={require("../../assets/chat.png")}
        style={styles.headerImage}
      />

      <Text style={styles.title}>Welcome to FinSmart</Text>
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

      {/* PASSWORD WITH EYE ICON */}
      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={22}
            color="#6b7280"
          />
        </TouchableOpacity>
      </View>

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

      <View style={styles.divider}>
        <View style={styles.line} />
        <Text style={styles.orText}>OR</Text>
        <View style={styles.line} />
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialButton, styles.googleButton]}
          onPress={handleGoogleLogin}
        >
          <GoogleIcon />
          <Text style={styles.googleText}> Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, styles.phoneButton]}
          onPress={() => navigation.navigate("PhoneLogin")}
        >
          <Ionicons name="call-outline" size={18} color="#fff" />
          <Text style={styles.phoneText}> Login with Phone</Text>
        </TouchableOpacity>
      </View>

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

  passwordContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    backgroundColor: "#f9fafb",
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 55,
  },
  passwordInput: {
    flex: 1,
  },

  button: {
    backgroundColor: "#2e7d32",
    width: "100%",
    height: 55,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    width: 300,
    height: 200,
    resizeMode: "contain",
    marginVertical: 10,
  },
});
