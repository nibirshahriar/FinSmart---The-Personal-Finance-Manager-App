// modal or popup screen

import { StyleSheet, Text, View, Pressable, FlatList } from "react-native";
import React from "react";
import tailwind from "twrnc";
import { useTheme } from "../context/ThemeContext";

const CATEGORIES = [
  { id: 1, name: "Food", icon: "🍔", color: "#F59E0B" }, 
  { id: 2, name: "Bills/Utilities", icon: "💡", color: "#FB7185" },
  { id: 3, name: "Family", icon: "👨‍👩‍👧‍👦", color: "#22C55E" },
  { id: 4, name: "Healthcare", icon: "🏥", color: "#EF4444" },    
  { id: 5, name: "Fuel", icon: "⛽", color: "#F97316" },               
  { id: 6, name: "Phone/Internet", icon: "📱", color: "#3B82F6" },  
  { id: 7, name: "Education", icon: "🎓", color: "#8B5CF6" },        
  { id: 8, name: "Entertainment", icon: "🎬", color: "#EC4899" },  
  { id: 9, name: "Shopping", icon: "🛍️", color: "#D946EF" },                
  { id: 10, name: "Travel", icon: "✈️", color: "#06B6D4" },        
  { id: 11, name: "Socializing", icon: "🍻", color: "#A16207" }, 
  { id: 12, name: "Withdrawal", icon: "🏧", color: "#64748B" },     
  { id: 13, name: "Transfer", icon: "🔁", color: "#10B981" },         
  { id: 14, name: "Transportation", icon: "🚗", color: "#0EA5E9" },
  { id: 15, name: "Housing", icon: "🏠", color: "#6366F1" },         
  { id: 16, name: "Miscellaneous", icon: "📦", color: "#475569" }, 
];

const Category = ({ navigation }) => {
  const { isDarkMode } = useTheme();

  const handleSelectedCategory = (category) => {
    console.log("category selected", category);

    navigation.popTo("FinSmart", {
      screen: "Create",
      params: { category },
    });
  };

  const renderItem = ({ item }) => {
    return (
      <Pressable
        onPress={() => handleSelectedCategory(item)}
        style={[
          tailwind`flex-1 items-center p-4 m-2.5 rounded-xl shadow-sm border`,
          {
            backgroundColor: isDarkMode ? "#020617" : "#fff",
            borderColor: isDarkMode ? "#334155" : "#e5e7eb",
          },
        ]}
      >
        <Text style={tailwind`text-3xl text-center`}>{item.icon}</Text>
        <Text
          style={[
            tailwind`mt-2 text-center`,
            { color: isDarkMode ? "#e5e7eb" : "#374151" },
          ]}
        >
          {item.name}
        </Text>
      </Pressable>
    );
  };

  return (
    <View
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#fff" },
      ]}
    >
      <View style={tailwind`p-4`}>
        <Pressable onPress={() => navigation.goBack()}>
          <Text
            style={[
              tailwind`text-2xl font-bold mt-6`,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            X
          </Text>
        </Pressable>

        <Text
          style={[
            tailwind`text-3xl font-bold mt-3`,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Select Category
        </Text>

        <Text
          style={[
            tailwind`text-base mb-2 mt-2`,
            { color: isDarkMode ? "#94a3b8" : "#6b7280" },
          ]}
        >
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
