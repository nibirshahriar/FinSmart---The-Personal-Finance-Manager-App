import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import React from "react";
import tailwind from "twrnc";
import { useExpenses } from "../context/ExpenseContext";
import { useTheme } from "../context/ThemeContext";

const ExpenseItemCard = ({ item }) => {
  const { deleteExpense } = useExpenses();
  const { isDarkMode } = useTheme();

  const handleDelete = () => {
    Alert.alert(
      "Delete Expense",
      "Are you sure you want to delete this expense?",
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
  //1.title,
  // 2.icon
  // , 3.category
  // 4.amount and date

  return (
    <Pressable
      onLongPress={handleDelete}
      style={[
        tailwind`rounded-2xl p-4 mx-5 mb-3 flex-row justify-between items-center`,
        {
          backgroundColor: isDarkMode ? "#0f172a" : "#f8fafc",
          borderWidth: 1,
          borderColor: isDarkMode ? "#1e293b" : "#e5e7eb",
          shadowColor: "#000",
          shadowOpacity: isDarkMode ? 0.35 : 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: isDarkMode ? 5 : 3,
        },
      ]}
    >
      <View style={tailwind`flex-row items-center`}>
        <View
          style={[
            tailwind`w-12 h-12 rounded-xl justify-center items-center mr-4`,
            {
              backgroundColor: isDarkMode ? "#1e293b" : "#e5e7eb",
            },
          ]}
        >
          <Text style={tailwind`text-lg`}>{item.icon}</Text>
        </View>

        <View>
          <Text
            style={[
              tailwind`text-base font-semibold`,
              { color: isDarkMode ? "#f1f5f9" : "#0f172a" },
            ]}
          >
            {item.title}
          </Text>

          {/* category */}
          <View
            style={[
              tailwind`mt-1 px-2 py-1 rounded-xl self-start`,
              { backgroundColor: item.color },
            ]}
          >
            <Text style={tailwind`text-xs font-bold text-white`}>
              {item.category}
            </Text>
          </View>
        </View>
      </View>

      <View style={tailwind`items-end`}>
        <Text
          style={[
            tailwind`text-base font-bold`,
            { color: isDarkMode ? "#f8fafc" : "#020617" },
          ]}
        >
          Tk.{item.amount}
        </Text>
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
