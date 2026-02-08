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

  // receive selected category from Category screen
  useEffect(() => {
    if (route.params?.category) {
      setCategory(route.params.category);
    }
  }, [route.params?.category]);

  const handleAddExpense = () => {
    const numericAmount = Number(amount);

    if (!amount || !title || !category) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Amount must be greater than 0");
      return;
    }

    // add expense to context
    addExpense({
      title,
      amount: numericAmount,
      category,
    });

    // reset form
    setAmount("");
    setTitle("");
    setCategory(null);

    // go back
    navigation.goBack();
  };

  const handleCategoryInput = () => {
    navigation.navigate("Category");
  };

  return (
    <View
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#fff" },
      ]}
    >
      <ScrollView contentContainerStyle={tailwind`p-6`}>
        {/* Header */}
        <Text
          style={[
            tailwind`text-3xl font-bold`,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Create New Expense
        </Text>

        <Text
          style={[
            tailwind`text-base mt-2 mb-8`,
            { color: isDarkMode ? "#94a3b8" : "#6b7280" },
          ]}
        >
          Enter the details of your expenses
        </Text>

        {/* Amount */}
        <View style={tailwind`mb-6`}>
          <Text
            style={[
              tailwind`text-lg font-semibold mb-2`,
              { color: isDarkMode ? "#cbd5f5" : "#374151" },
            ]}
          >
            Enter Amount
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
                borderColor: isDarkMode ? "#334155" : "#22c55e",
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

        {/* Category */}
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
              <Text
                style={[
                  tailwind`text-2xl mr-3`,
                  { color: isDarkMode ? "#fff" : "#000" },
                ]}
              >
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

        {/* Submit Button */}
        <Pressable
          style={tailwind`bg-rose-600 p-6 rounded-xl mt-8`}
          onPress={handleAddExpense}
        >
          <Text style={tailwind`text-white text-center text-lg font-bold`}>
            Add Expense
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({});
