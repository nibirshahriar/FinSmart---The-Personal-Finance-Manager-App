import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import React from "react";
import tailwind from "twrnc";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";

const ExpenseItemCard = ({ item }) => {
  const { deleteExpense } = useExpenses();
  const { isDarkMode } = useTheme();

  // Detect income or expense
  const isIncome = item.type === "income";

  const handleDelete = () => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteExpense(item.id),
        },
      ],
    );
  };

  // 1.title
  // 2.icon
  // 3.category
  // 4.amount and date

  return (
    <Pressable
      onLongPress={handleDelete}
      style={[
        tailwind`rounded-2xl p-4 mx-5 mb-3 flex-row justify-between items-center`,
        {
          backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
          borderWidth: 1,
          borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
          borderLeftWidth: 6, // Left indicator
          borderLeftColor: isIncome ? "#16a34a" : "#dc2626", // Green or Red
          shadowColor: "#000",
          shadowOpacity: isDarkMode ? 0.4 : 0.1,
          shadowRadius: 10,
          shadowOffset: { width: 0, height: 5 },
          elevation: 4,
        },
      ]}
    >
      {/* LEFT SECTION */}
      <View style={tailwind`flex-row items-center`}>
        {/* Icon Box */}
        <View
          style={[
            tailwind`w-12 h-12 rounded-xl justify-center items-center mr-4`,
            {
              backgroundColor: isIncome
                ? "rgba(22,163,74,0.15)"
                : "rgba(220,38,38,0.15)",
            },
          ]}
        >
          <Text style={tailwind`text-lg`}>{item.icon}</Text>
        </View>

        <View>
          {/* Title */}
          <Text
            style={[
              tailwind`text-base font-semibold`,
              { color: isDarkMode ? "#f1f5f9" : "#0f172a" },
            ]}
          >
            {item.title}
          </Text>

          {/* Category Badge */}
          <View
            style={[
              tailwind`mt-1 px-2 py-1 rounded-xl self-start`,
              { backgroundColor: isIncome ? "#16a34a" : item.color },
            ]}
          >
            <Text style={tailwind`text-xs font-bold text-white`}>
              {isIncome ? "Income" : item.category}
            </Text>
          </View>
        </View>
      </View>

      {/* RIGHT SECTION */}
      <View style={tailwind`items-end`}>
        {/* Amount */}
        <Text
          style={[
            tailwind`text-base font-bold`,
            { color: isIncome ? "#16a34a" : "#dc2626" },
          ]}
        >
          {isIncome ? "+" : "-"} Tk.{item.amount}
        </Text>

        {/* Date */}
        <Text
          style={[
            tailwind`text-xs mt-1`,
            { color: isDarkMode ? "#94a3b8" : "#64748b" },
          ]}
        >
          {item.date}
        </Text>
      </View>
    </Pressable>
  );
};

export default ExpenseItemCard;

const styles = StyleSheet.create({});
