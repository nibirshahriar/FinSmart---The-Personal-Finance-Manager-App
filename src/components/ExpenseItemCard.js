import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import React from "react";
import tailwind from "twrnc";
import { useExpenses } from "../context/ExpenseContext";

const ExpenseItemCard = ({ item }) => {
  const { deleteExpense } = useExpenses();

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
      style={tailwind`bg-white rounded-2xl p-4 mx-5 mb-3 flex-row justify-between items-center shadow-sm`}
    >
      <View style={tailwind`flex-row items-center`}>
        <View
          style={tailwind`w-12 h-12 rounded-xl bg-gray-100 justify-center items-center mr-4`}
        >
          <Text>{item.icon}</Text>
        </View>

        <View>
          <Text style={tailwind`text-base font-bold text-gray-800`}>
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
        <Text style={tailwind`text-base font-bold text-black`}>
          Tk.{item.amount}
        </Text>
        <Text style={tailwind`text-xs text-gray-500 mt-1`}>{item.date}</Text>
      </View>
    </Pressable>
  );
};

export default ExpenseItemCard;

const styles = StyleSheet.create({});
