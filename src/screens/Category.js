// modal or popup screen

import { StyleSheet, Text, View, Pressable, FlatList } from "react-native";
import React from "react";
import tailwind from "twrnc";

const CATEGORIES = [
  { id: 1, name: "Food", icon: "🍔", color: "#FFD700" },
  { id: 2, name: "Bills/Utilities", icon: "💡", color: "#FFA07A" },
  { id: 3, name: "Family", icon: "👨‍👩‍👧‍👦", color: "#90EE90" },
  { id: 4, name: "Healthcare", icon: "🏥", color: "#FF7F7F" },
  { id: 5, name: "Fuel", icon: "⛽", color: "#FF8C00" },
  { id: 6, name: "Phone/Internet", icon: "📱", color: "#87CEEB" },
  { id: 7, name: "Education", icon: "🎓", color: "#9370DB" },
  { id: 8, name: "Entertainment", icon: "🎬", color: "#E6E6FA" },
  { id: 9, name: "Shopping", icon: "🛍️", color: "#FF69B4" },
  { id: 10, name: "Travel", icon: "✈️", color: "#00CED1" },
  { id: 11, name: "Socializing", icon: "🍻", color: "#CD853F" },
  { id: 12, name: "Withdrawal", icon: "🏧", color: "#D3D3D3" },
  { id: 13, name: "Transfer", icon: "🔁", color: "#32CD32" },
  { id: 14, name: "Transportation", icon: "🚗", color: "#FFA500" },
  { id: 15, name: "Housing", icon: "🏠", color: "#ADD8E6" },
  { id: 16, name: "Miscellaneous", icon: "📦", color: "#808080" },
];

const Category = ({ navigation }) => {
  const handleSelectedCategory = (category) => {
    console.log("category selected", category)

navigation.popTo("BottomTabs", {
  screen: "Create",
  params: { category },
});

  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => handleSelectedCategory(item)}
        style={tailwind`flex-1 items-center p-4 m-2.5 bg-white rounded-xl shadow-sm border border-gray-200`}
      >
        <Text style={tailwind`text-3xl text-center`}>{item.icon}</Text>
        <Text style={tailwind`mt-2 text-center`}>{item.name}</Text>
      </Pressable>
    );
  };
  return (
    <View style={tailwind`flex-1`}>
      <View style={tailwind`p-4`}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text style={tailwind`text-2xl font-bold mt-6`}>X</Text>
        </Pressable>
        <Text style={tailwind`text-3xl font-bold text-black mt-3`}>
          Select Category
        </Text>

        <Text style={tailwind`text-base text-gray-500 mb-2 mt-2`}>
          Select a category that best describes what you spent money on
        </Text>
      </View>

      <FlatList
        data={CATEGORIES}
        renderItem={renderItem}
        keyExtractor={(item) => item.icon}
        numColumns={2}
        contentContainerStyle={tailwind`p-3`}
      />
    </View>
  );
};

export default Category;

const styles = StyleSheet.create({});
