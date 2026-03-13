import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import tailwind from "twrnc";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";
import { useTour } from "../context/TourContext";
import { addDoc, collection } from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";
import { getFirestore } from "@react-native-firebase/firestore";

const Create = ({ navigation, route }) => {
  const { addExpense } = useExpenses();
  const { addTour } = useTour();
  const { isDarkMode } = useTheme();

  const auth = getAuth();
  const db = getFirestore();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [type, setType] = useState("expense");

  const [tourName, setTourName] = useState("");
  const [destination, setDestination] = useState("");
  const [participants, setParticipants] = useState("");

  useEffect(() => {
    if (route.params?.category) {
      setCategory(route.params.category);
    }
  }, [route.params?.category]);

  useEffect(() => {
    if (route.params?.type === "tour") {
      setType("tour");
    }
  }, [route.params?.type]);

  useEffect(() => {
    if (type !== "expense") {
      setCategory(null);
    }
  }, [type]);

  const handleSubmit = async () => {
    const numericAmount = Number(amount);

    if (type === "tour") {
      if (!tourName || !destination || !participants) {
        Alert.alert("Error", "All Tour fields are required");
        return;
      }

      if (isNaN(Number(participants)) || Number(participants) <= 0) {
        Alert.alert("Error", "Participants must be greater than 0");
        return;
      }

      const newTour = {
        name: tourName,
        destination,
        participants: Number(participants),
        members: [],
        expenses: [],
        totalExpense: 0,
        perPerson: 0,
        createdAt: new Date().toISOString(),
        status: "Ongoing",
      };

      try {
        const userId = auth.currentUser.uid;

        const docRef = await addDoc(
          collection(db, "users", userId, "tours"),
          newTour,
        );

        Alert.alert("Success", "Tour Created Successfully");

        setTimeout(() => {
          navigation.navigate("TourList");
        }, 300);

        setTourName("");
        setDestination("");
        setParticipants("");
        setType("expense");
      } catch (error) {
        Alert.alert("Error", "Failed to create tour");
      }

      return;
    }

    if (!amount || !title) {
      Alert.alert("Error", "Amount and Title are required");
      return;
    }

    if (type === "expense" && !category) {
      Alert.alert("Error", "Please select a category");
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Amount must be greater than 0");
      return;
    }

    addExpense({
      title,
      amount: numericAmount,
      category: type === "expense" ? category : null,
      type,
    });

    setAmount("");
    setTitle("");
    setCategory(null);
    setType("expense");

    navigation.goBack();
  };

  const handleCategoryInput = () => {
    navigation.navigate("Category", { selected: category });
  };

  const buttonColor =
    type === "expense"
      ? "bg-rose-600"
      : type === "income"
        ? "bg-emerald-600"
        : "bg-sky-600";

  const isDisabled =
    type === "tour"
      ? !tourName || !destination || !participants
      : !amount || !title;

  return (
    <View
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#fff" },
      ]}
    >
      <ScrollView contentContainerStyle={tailwind`p-6`}>
        <View
          style={tailwind`flex-row mb-8 bg-slate-800 p-1.5 rounded-2xl border border-slate-700`}
        >
          <Pressable
            onPress={() => setType("expense")}
            style={[
              tailwind`flex-1 py-3 items-center rounded-xl`,
              {
                backgroundColor: type === "expense" ? "#e11d48" : "transparent",
              },
            ]}
          >
            <Text
              style={[
                tailwind`font-bold`,
                { color: type === "expense" ? "white" : "#94a3b8" },
              ]}
            >
              Expense
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setType("income")}
            style={[
              tailwind`flex-1 py-3 items-center rounded-xl`,
              {
                backgroundColor: type === "income" ? "#059669" : "transparent",
              },
            ]}
          >
            <Text
              style={[
                tailwind`font-bold`,
                { color: type === "income" ? "white" : "#94a3b8" },
              ]}
            >
              Income
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setType("tour")}
            style={[
              tailwind`flex-1 py-3 items-center rounded-xl`,
              {
                backgroundColor: type === "tour" ? "#0ea5e9" : "transparent",
              },
            ]}
          >
            <Text
              style={[
                tailwind`font-bold`,
                { color: type === "tour" ? "white" : "#94a3b8" },
              ]}
            >
              Tour
            </Text>
          </Pressable>
        </View>

        {type === "tour" && (
          <View style={tailwind`flex-row justify-between mb-6`}>
            <Pressable
              onPress={() => setType("tour")}
              style={[
                tailwind`flex-1 mr-3 py-3 rounded-xl items-center`,
                { backgroundColor: "#1e3a8a" },
              ]}
            >
              <Text style={tailwind`text-white font-semibold`}>
                Create Tour
              </Text>
            </Pressable>

            <Pressable
              onPress={() => navigation.navigate("TourList")}
              style={[
                tailwind`flex-1 ml-3 py-3 rounded-xl items-center`,
                { backgroundColor: "#0f766e" },
              ]}
            >
              <Text style={tailwind`text-white font-semibold`}>My Tours</Text>
            </Pressable>
          </View>
        )}

        <View style={tailwind`mb-8`} />

        {type === "tour" ? (
          <>
            <View style={tailwind`mb-5`}>
              <Text
                style={[
                  tailwind`text-lg font-semibold mb-2`,
                  { color: isDarkMode ? "#cbd5f5" : "#374151" },
                ]}
              >
                Tour Name
              </Text>

              <TextInput
                placeholder="Cox's Bazar Trip"
                placeholderTextColor={isDarkMode ? "#64748b" : "#9ca3af"}
                value={tourName}
                onChangeText={setTourName}
                style={[
                  tailwind`border-2 p-4 rounded-xl text-lg`,
                  {
                    backgroundColor: isDarkMode ? "#020617" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: "#0ea5e9",
                  },
                ]}
              />
            </View>

            <View style={tailwind`mb-5`}>
              <Text
                style={[
                  tailwind`text-lg font-semibold mb-2`,
                  { color: isDarkMode ? "#cbd5f5" : "#374151" },
                ]}
              >
                Destination
              </Text>

              <TextInput
                placeholder="Where are you going?"
                placeholderTextColor={isDarkMode ? "#64748b" : "#9ca3af"}
                value={destination}
                onChangeText={setDestination}
                style={[
                  tailwind`border-2 p-4 rounded-xl text-lg`,
                  {
                    backgroundColor: isDarkMode ? "#020617" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: "#0ea5e9",
                  },
                ]}
              />
            </View>

            <View style={tailwind`mb-5`}>
              <Text
                style={[
                  tailwind`text-lg font-semibold mb-2`,
                  { color: isDarkMode ? "#cbd5f5" : "#374151" },
                ]}
              >
                Participants
              </Text>

              <TextInput
                placeholder="5"
                keyboardType="numeric"
                placeholderTextColor={isDarkMode ? "#64748b" : "#9ca3af"}
                value={participants}
                onChangeText={setParticipants}
                style={[
                  tailwind`border-2 p-4 rounded-xl text-lg`,
                  {
                    backgroundColor: isDarkMode ? "#020617" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: "#0ea5e9",
                  },
                ]}
              />
            </View>
          </>
        ) : (
          <>
            <View style={tailwind`mb-6`}>
              <Text
                style={[
                  tailwind`text-lg font-semibold mb-2`,
                  { color: isDarkMode ? "#cbd5f5" : "#374151" },
                ]}
              >
                Amount
              </Text>

              <TextInput
                placeholder="Tk. 0.00"
                placeholderTextColor={isDarkMode ? "#64748b" : "#9ca3af"}
                keyboardType="numeric"
                value={amount}
                onChangeText={(text) => {
                  const cleaned = text.replace(/[^0-9.]/g, "");
                  setAmount(cleaned);
                }}
                style={[
                  tailwind`border-2 p-4 rounded-2xl text-lg`,
                  {
                    backgroundColor: isDarkMode ? "#020617" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: type === "expense" ? "#e11d48" : "#059669",
                  },
                ]}
              />
            </View>

            <View style={tailwind`mb-5`}>
              <Text
                style={[
                  tailwind`text-lg font-semibold mb-2`,
                  { color: isDarkMode ? "#cbd5f5" : "#374151" },
                ]}
              >
                Title
              </Text>

              <TextInput
                placeholder="What was it for?"
                placeholderTextColor={isDarkMode ? "#64748b" : "#9ca3af"}
                value={title}
                onChangeText={setTitle}
                style={[
                  tailwind`border-2 p-4 rounded-xl text-lg`,
                  {
                    backgroundColor: isDarkMode ? "#020617" : "#fff",
                    color: isDarkMode ? "#fff" : "#000",
                    borderColor: isDarkMode ? "#334155" : "#d1d5db",
                  },
                ]}
              />
            </View>

            {type === "expense" && (
              <View style={tailwind`mb-5`}>
                <Text
                  style={[
                    tailwind`text-lg font-semibold mb-2`,
                    { color: isDarkMode ? "#cbd5f5" : "#374151" },
                  ]}
                >
                  Category
                </Text>

                <Pressable
                  onPress={handleCategoryInput}
                  style={[
                    tailwind`border p-4 rounded-xl flex-row justify-between items-center`,
                    {
                      backgroundColor: isDarkMode ? "#020617" : "#fff",
                      borderColor: isDarkMode ? "#334155" : "#9ca3af",
                    },
                  ]}
                >
                  <View style={tailwind`flex-row items-center`}>
                    <Text style={tailwind`text-2xl mr-3`}>
                      {category ? category.icon : "☰"}
                    </Text>

                    <Text
                      style={[
                        tailwind`text-lg`,
                        { color: isDarkMode ? "#e5e7eb" : "#000" },
                      ]}
                    >
                      {category ? category.name : "Select Category"}
                    </Text>
                  </View>

                  <Text style={tailwind`text-2xl`}>&gt;</Text>
                </Pressable>
              </View>
            )}
          </>
        )}

        <Pressable
          disabled={isDisabled}
          style={[
            tailwind`${buttonColor} p-6 rounded-xl mt-8`,
            isDisabled && { opacity: 0.5 },
          ]}
          onPress={handleSubmit}
        >
          <Text style={tailwind`text-white text-center text-lg font-bold`}>
            {type === "tour"
              ? "Create Tour"
              : `Add ${type === "expense" ? "Expense" : "Income"}`}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({});
