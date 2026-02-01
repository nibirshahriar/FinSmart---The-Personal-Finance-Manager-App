import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
// import React from 'react'
import tailwind from "twrnc";
// import { TextInput } from 'react-native'
import React, { useState } from "react";

const Create = ({ navigation }) => {
  const [amount, setAmount] = useState(null);
  const [title, setTitle] = useState("");

  const handleAddExpense = () => {
    const numericAmount = Number(amount);

    if (!amount || !title) {
      Alert.alert("Error", "All fields are required");
      return;
    }

    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert("Error", "Amount must be greater than 0");
      return;
    }

    console.log("amount:", numericAmount); //for this admin can know first ..then hit the info to API
    console.log("title:", title);
  };

  const handleCategoryInput = () => {
    navigation.navigate("Category");
  };
  return (
    <View>
      <ScrollView contentContainerStyle={tailwind`p-6`}>
        {/* Header section */}
        <Text style={tailwind`text-3xl font-bold text-black`}>
          Create New Expense
        </Text>
        <Text style={tailwind`text-base text-gray-500 mt-2 mb-8`}>
          Enter the details of your expenses
        </Text>

        {/* form section */}

        <View style={tailwind`mb-6`}>
          {/* 1st textinput */}
          <Text style={tailwind`text-lg font-semibold text-gray-600 mb-2`}>
            Enter Amount
          </Text>

          <TextInput
            placeholder="Tk. 0.00"
            style={tailwind`border-2 border-green-500 p-4 rounded-2xl text-lg`}
            value={amount}
            onChangeText={setAmount}
          />
        </View>

        {/* 2nd textinput */}
        <View style={tailwind`mb-5`}>
          <Text style={tailwind`text-lg font-semibold text-gray-600 mb-2`}>
            Title
          </Text>

          <TextInput
            placeholder="What was it for?"
            style={tailwind`border-2 border-gray-300 p-4 rounded-xl text-lg`}
            value={title}
            onChangeText={setTitle}
          />
        </View>

        {/* 3rd input category */}
        <View style={tailwind`mb-5`}>
          <Text style={tailwind`text-lg font-semibold text-gray-600 mb-2`}>
            Category
          </Text>

          <Pressable
            onPress={handleCategoryInput}
            style={tailwind`border border-gray-400 p-4 rounded-xl flex-row justify-between items-center`}
          >
            <View style={tailwind`flex-row items-center`}>
              <Text style={tailwind`text-2xl mr-3`}>🍔</Text>
              <Text style={tailwind`text-lg`}>Food</Text>
            </View>

            <Text style={tailwind`text-2xl`}>&gt;</Text>
          </Pressable>
        </View>

        {/* footer section */}
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
