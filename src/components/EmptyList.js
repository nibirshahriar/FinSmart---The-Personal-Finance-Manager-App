import { StyleSheet, Text, View } from "react-native";
import React from "react";
import tailwind from "twrnc";

const EmptyList = ({
  title = "No Income & Expenses Yet",
  message = "Add a new expense to see it in your list",
}) => {
  return (
    <View style={tailwind`flex-1 justify-center items-center p-8 mt-10`}>
      <Text style={tailwind`text-5xl mb-4`}>📝</Text>

      <Text style={tailwind`text-xl font-bold text-gray-800 mb-2`}>
        {title}
      </Text>
      <Text style={tailwind`text-base text-gray-500 text-center`}>
        {message}
      </Text>
    </View>
  );
};

export default EmptyList;

const styles = StyleSheet.create({});
