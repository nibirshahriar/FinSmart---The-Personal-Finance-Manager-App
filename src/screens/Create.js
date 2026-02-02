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

const Create = ({ navigation, route }) => {
  const { addExpense } = useExpenses();

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

    // go back to Home
    navigation.goBack();
  };

  const handleCategoryInput = () => {
    navigation.navigate("Category");
  };

  return (
    <View style={tailwind`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={tailwind`p-6`}>
        {/* Header */}
        <Text style={tailwind`text-3xl font-bold text-black`}>
          Create New Expense
        </Text>
        <Text style={tailwind`text-base text-gray-500 mt-2 mb-8`}>
          Enter the details of your expenses
        </Text>

        {/* Amount */}
        <View style={tailwind`mb-6`}>
          <Text style={tailwind`text-lg font-semibold text-gray-600 mb-2`}>
            Enter Amount
          </Text>
          <TextInput
            placeholder="Tk. 0.00"
            keyboardType="numeric"
            value={amount}
            onChangeText={setAmount}
            style={tailwind`border-2 border-green-500 p-4 rounded-2xl text-lg`}
          />
        </View>

        {/* Title */}
        <View style={tailwind`mb-5`}>
          <Text style={tailwind`text-lg font-semibold text-gray-600 mb-2`}>
            Title
          </Text>
          <TextInput
            placeholder="What was it for?"
            value={title}
            onChangeText={setTitle}
            style={tailwind`border-2 border-gray-300 p-4 rounded-xl text-lg`}
          />
        </View>

        {/* Category */}
        <View style={tailwind`mb-5`}>
          <Text style={tailwind`text-lg font-semibold text-gray-600 mb-2`}>
            Category
          </Text>

          <Pressable
            onPress={handleCategoryInput}
            style={tailwind`border border-gray-400 p-4 rounded-xl flex-row justify-between items-center`}
          >
            <View style={tailwind`flex-row items-center`}>
              <Text style={tailwind`text-2xl mr-3`}>
                {category ? category.icon : "🔘"}
              </Text>
              <Text style={tailwind`text-lg`}>
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
