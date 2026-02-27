import {
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
  Alert,
} from "react-native";
import React, { useState } from "react";
import tailwind from "twrnc";
import EmptyList from "../components/EmptyList";
import ExpenseItemCard from "../components/ExpenseItemCard";
import { useExpenses } from "../context/ExpenseContext";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

const Home = ({ navigation }) => {
  const { expenses, clearAllExpenses } = useExpenses();
  const { isDarkMode } = useTheme();

  // =========================================
  // FILTER STATE (all / today / week / month)
  // =========================================
  const [filter, setFilter] = useState("all");

  // =========================================
  // CALENDAR BASED FILTER LOGIC
  // =========================================
  const filteredTransactions = expenses.filter((item) => {
    if (!item.createdAt?.seconds) return false;

    const transactionDate = new Date(item.createdAt.seconds * 1000);

    const now = new Date();

    // ------------------------------
    // ALL
    // ------------------------------
    if (filter === "all") return true;

    // ------------------------------
    // TODAY
    // ------------------------------
    if (filter === "today") {
      return transactionDate.toDateString() === now.toDateString();
    }

    // ------------------------------
    // THIS WEEK (Mon–Sun)
    // ------------------------------
    if (filter === "week") {
      const firstDayOfWeek = new Date(now);
      const day = now.getDay();
      const diff = now.getDate() - day + (day === 0 ? -6 : 1);
      firstDayOfWeek.setDate(diff);
      firstDayOfWeek.setHours(0, 0, 0, 0);

      return transactionDate >= firstDayOfWeek;
    }

    // ------------------------------
    // THIS MONTH (1st to today)
    // ------------------------------
    if (filter === "month") {
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return transactionDate >= firstDayOfMonth;
    }

    return true;
  });

  // =========================================
  // TOTAL EXPENSE
  // =========================================
  const totalSpent = expenses
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // =========================================
  // TOTAL INCOME
  // =========================================
  const totalIncome = expenses
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const currentBalance = totalIncome - totalSpent;

  // =========================================
  // CLEAR ALL
  // =========================================
  const handleClearAll = () => {
    Alert.alert(
      "Clear All Transactions",
      "Are you sure you want to delete all transactions?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear All",
          style: "destructive",
          onPress: clearAllExpenses,
        },
      ],
    );
    const clearWeekly = () => {
      const now = new Date();
      const firstDayOfWeek = new Date(
        now.setDate(now.getDate() - now.getDay()),
      );

      Alert.alert("Clear This Week", "Delete this week's transactions?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            const filtered = expenses.filter(
              (item) => new Date(item.date) < firstDayOfWeek,
            );
            setExpenses(filtered);
          },
        },
      ]);
    };
  };

  return (
    <View
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#ffffff" },
      ]}
    >
      {/* ================= BALANCE CARD ================= */}
      <View
        style={[
          tailwind`rounded-3xl p-6 mx-5 my-4`,
          { backgroundColor: isDarkMode ? "#1e293b" : "#0ea5e9" },
        ]}
      >
        <Text style={tailwind`text-white text-base`}>Current Balance</Text>

        <Text style={tailwind`text-white text-4xl font-bold mt-2`}>
          Tk. {currentBalance.toFixed(2)}
        </Text>

        <View style={tailwind`flex-row justify-between mt-6`}>
          <View>
            <Text style={tailwind`text-gray-200 text-lg`}>Expense</Text>
            <Text style={tailwind`text-red-400 text-lg font-bold mt-1`}>
              Tk. {totalSpent.toFixed(2)}
            </Text>
          </View>

          <View>
            <Text style={tailwind`text-gray-200 text-lg text-right`}>
              Income
            </Text>
            <Text
              style={tailwind`text-green-300 text-lg font-bold mt-1 text-right`}
            >
              Tk. {totalIncome.toFixed(2)}
            </Text>
          </View>
        </View>
      </View>

      {/* ================= TITLE ================= */}
      <Text
        style={[
          tailwind`text-xl font-bold mx-5`,
          { color: isDarkMode ? "#ffffff" : "#000000" },
        ]}
      >
        Transactions
      </Text>

      {/* ================= FILTER BUTTONS ================= */}
      <View style={tailwind`flex-row mx-5 mt-3 mb-2`}>
        {[
          { key: "all", label: "All" },
          { key: "today", label: "Today" },
          { key: "week", label: "This Week" },
          { key: "month", label: "This Month" },
        ].map((item) => (
          <Pressable
            key={item.key}
            onPress={() => setFilter(item.key)}
            style={[
              tailwind`flex-1 py-2 mx-1 rounded-xl items-center`,
              {
                backgroundColor:
                  filter === item.key ? "#2563EB" : "transparent",
                borderWidth: 1,
                borderColor: "#2563EB",
              },
            ]}
          >
            <Text
              style={{
                color: filter === item.key ? "#fff" : "#2563EB",
                fontWeight: "600",
                fontSize: 12,
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* ================= TRANSACTION LIST ================= */}
      <FlatList
        data={filteredTransactions}
        renderItem={({ item }) => <ExpenseItemCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={<EmptyList />}
        ListFooterComponent={
          filteredTransactions.length > 0 ? (
            <Pressable
              onPress={handleClearAll}
              style={tailwind`bg-red-500 mx-5 mt-4 py-3 rounded-xl flex-row items-center justify-center`}
            >
              <Ionicons name="trash-outline" size={22} color="#ffffff" />
              <Text style={tailwind`text-white font-bold ml-2`}>
                Clear All Transactions
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
