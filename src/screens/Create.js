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

const Create = ({ navigation, route }) => {
  const { addExpense } = useExpenses();
  const { isDarkMode } = useTheme();

  const [amount, setAmount] = useState("");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(null);
  const [type, setType] = useState("expense"); // default expense

  useEffect(() => {
    if (route.params?.category) {
      setCategory(route.params.category);
    }
  }, [route.params?.category]);

  const handleSubmit = () => {
    const numericAmount = Number(amount);

    // Validation
    if (!amount || !title) {
      Alert.alert("Error", "Amount and Title are required");
      return;
    }

    // Only require category for expense
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

    // Reset
    setAmount("");
    setTitle("");
    setCategory(null);
    setType("expense");

    navigation.goBack();
  };

  const handleCategoryInput = () => {
    navigation.navigate("Category");
  };

  const buttonColor = type === "expense" ? "bg-rose-600" : "bg-emerald-600";

  return (
    <View
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#fff" },
      ]}
    >
      <ScrollView contentContainerStyle={tailwind`p-6`}>
        {/* Toggle */}
        <View style={tailwind`flex-row mb-8 rounded-xl overflow-hidden`}>
          <Pressable
            onPress={() => setType("expense")}
            style={[
              tailwind`flex-1 p-4 items-center`,
              {
                backgroundColor: type === "expense" ? "#e11d48" : "#334155",
              },
            ]}
          >
            <Text style={tailwind`text-white font-bold`}>Expense</Text>
          </Pressable>

          <Pressable
            onPress={() => setType("income")}
            style={[
              tailwind`flex-1 p-4 items-center`,
              {
                backgroundColor: type === "income" ? "#059669" : "#334155",
              },
            ]}
          >
            <Text style={tailwind`text-white font-bold`}>Income</Text>
          </Pressable>
        </View>

        {/* Header */}
        <Text
          style={[
            tailwind`text-3xl font-bold`,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Add {type === "expense" ? "Expense" : "Income"}
        </Text>

        <Text
          style={[
            tailwind`text-base mt-2 mb-8`,
            { color: isDarkMode ? "#94a3b8" : "#6b7280" },
          ]}
        >
          Enter transaction details
        </Text>

        {/* Amount */}
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
            onChangeText={setAmount}
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

        {/* Title */}
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

        {/* Category (Only for Expense) */}
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

        {/* Submit Button */}
        <Pressable
          style={tailwind`${buttonColor} p-6 rounded-xl mt-8`}
          onPress={handleSubmit}
        >
          <Text style={tailwind`text-white text-center text-lg font-bold`}>
            Add {type === "expense" ? "Expense" : "Income"}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({});
