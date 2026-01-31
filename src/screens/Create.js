import { ScrollView, StyleSheet, Text, View, TextInput } from "react-native";
// import React from 'react'
import tailwind from "twrnc";
// import { TextInput } from 'react-native'
import React, { useState } from "react";

const Create = () => {
  const [amount, setAmount] = useState(null);
const [title, setTitle] = useState("");

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

        {/* footer section */}
      </ScrollView>
    </View>
  );
};

export default Create;

const styles = StyleSheet.create({});
