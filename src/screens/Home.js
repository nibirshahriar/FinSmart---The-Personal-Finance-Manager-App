import {
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
} from "react-native";
import React from "react";
import tailwind from "twrnc";
import EmptyList from "../components/EmptyList";
import ExpenseItemCard from "../components/ExpenseItemCard";
import { useExpenses } from "../context/ExpenseContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";
import { getAuth } from "@react-native-firebase/auth";

const Home = ({ navigation }) => {
  const { expenses, clearAllExpenses } = useExpenses();
  const { isDarkMode } = useTheme();

  const auth = getAuth();
  const user = auth.currentUser;

  const totalSpent = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  // clear all confirmation
  const handleClearAll = () => {
    Alert.alert(
      "Clear All Expenses",
      "Are you sure you want to delete all expenses?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: clearAllExpenses,
        },
      ],
    );
  };

  return (
    <View
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#fff" },
      ]}
    >
      {/* Header */}
      <View style={tailwind`px-5 pt-5 pb-3`}>
        <Text
          style={[
            tailwind`text-4xl font-bold`,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Hello 👋
        </Text>

        {user && (
          <Text
            style={[
              tailwind`text-sm mt-1`,
              { color: isDarkMode ? "#94a3b8" : "#6b7280" },
            ]}
          ></Text>
        )}

        <Text
          style={[
            tailwind`text-base`,
            { color: isDarkMode ? "#94a3b8" : "#6b7280" },
          ]}
        >
          Start tracking your income and expenses wisely
        </Text>
      </View>

      {/* Total Expense Card */}
      <View
        style={[
          tailwind`rounded-3xl p-6 my-5 mx-5 items-center`,
          { backgroundColor: isDarkMode ? "#312e81" : "#7c3aed" },
        ]}
      >
        <Text style={tailwind`text-base text-gray-200`}>
          Your Total Expenses :
        </Text>
        <Text style={tailwind`text-white text-4xl mt-2 font-bold`}>
          Tk.{totalSpent.toFixed(2)}
        </Text>
      </View>

      <FlatList
        data={expenses}
        renderItem={({ item }) => <ExpenseItemCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<EmptyList />}
        ListFooterComponent={
          expenses.length > 0 ? (
            <Pressable
              onPress={handleClearAll}
              style={tailwind`bg-red-500 mx-5 mt-4 py-3 rounded-xl flex-row items-center justify-center`}
            >
              <Ionicons name="trash-outline" size={22} color="#fff" />
              <Text style={tailwind`text-white text-center font-bold ml-2`}>
                Clear All Expenses
              </Text>
            </Pressable>
          ) : null
        }
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
