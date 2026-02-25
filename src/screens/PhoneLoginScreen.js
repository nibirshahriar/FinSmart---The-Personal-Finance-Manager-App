import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";

import { getAuth, signInWithPhoneNumber } from "@react-native-firebase/auth";

const PhoneLoginScreen = ({ navigation }) => {
  const auth = getAuth();

  const [phone, setPhone] = useState("");
  const [confirm, setConfirm] = useState(null);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // FORMAT PHONE 
  const formatPhoneNumber = (number) => {
    if (number.startsWith("0")) {
      return "+880" + number.substring(1);
    }
    if (!number.startsWith("+")) {
      return "+" + number;
    }
    return number;
  };

  //  SEND OTP 
  const sendOTP = async () => {
    if (!phone.trim()) {
      Alert.alert("Error", "Enter phone number");
      return;
    }

    const formattedPhone = formatPhoneNumber(phone);

    try {
      setLoading(true);

      const auth = getAuth();

      const confirmation = await signInWithPhoneNumber(auth, formattedPhone);

      setConfirm(confirmation);
      setCodeSent(true);

      Alert.alert("OTP Sent", "Verification code sent to your phone.");
    } catch (error) {
      Alert.alert("Phone Login Failed", error.message);
    } finally {
      setLoading(false);
    }
  };

  // VERIFY OTP
  const verifyOTP = async () => {
    if (!code.trim()) {
      Alert.alert("Error", "Enter verification code");
      return;
    }

    if (!confirm) {
      Alert.alert("Error", "OTP session expired. Please resend.");
      return;
    }

    try {
      setLoading(true);

      await confirm.confirm(code);

      Alert.alert("Success", "Phone login successful!");

      navigation.goBack();
    } catch (error) {
      Alert.alert("Invalid Code", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Phone Login</Text>

      {!codeSent ? (
        <>
          <TextInput
            style={styles.input}
            placeholder="01XXXXXXXXX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={sendOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TextInput
            style={styles.input}
            placeholder="Enter OTP"
            keyboardType="number-pad"
            value={code}
            onChangeText={setCode}
          />

          <TouchableOpacity
            style={styles.button}
            onPress={verifyOTP}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Verify OTP</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.resendButton} onPress={sendOTP}>
            <Text style={styles.resendText}>Resend Code</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default PhoneLoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    height: 55,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  button: {
    height: 55,
    backgroundColor: "#111827",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  resendButton: {
    marginTop: 15,
    alignItems: "center",
  },
  resendText: {
    color: "#2563eb",
    fontWeight: "600",
  },
});
