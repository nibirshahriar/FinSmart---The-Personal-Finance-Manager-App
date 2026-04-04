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

  const [filter, setFilter] = useState("all");
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcValue, setCalcValue] = useState("");

  const handleCalcPress = (val) => {
    if (val === "C") return setCalcValue("");
    if (val === "=") {
      try {
        setCalcValue(eval(calcValue).toString());
      } catch {
        setCalcValue("Error");
      }
      return;
    }
    setCalcValue((prev) => prev + val);
  };

  const filteredTransactions = expenses
    .filter((item) => {
      if (!item.createdAt?.seconds) return false;
      const transactionDate = new Date(item.createdAt.seconds * 1000);
      const now = new Date();
      if (filter === "all") return true;
      if (filter === "today") {
        return transactionDate.toDateString() === now.toDateString();
      }
      if (filter === "week") {
        const firstDayOfWeek = new Date(now);
        firstDayOfWeek.setDate(now.getDate() - now.getDay());
        firstDayOfWeek.setHours(0, 0, 0, 0);
        return transactionDate >= firstDayOfWeek;
      }
      if (filter === "month") {
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        return transactionDate >= firstDayOfMonth;
      }
      if (filter === "year") {
        const firstDayOfYear = new Date(now.getFullYear(), 0, 1);
        return transactionDate >= firstDayOfYear;
      }
      return true;
    })
    .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

  const totalSpent = filteredTransactions
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalIncome = filteredTransactions
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const currentBalance = totalIncome - totalSpent;

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
  };

  return (
    <View
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#ffffff" },
      ]}
    >
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

        {currentBalance < 0 && (
          <Text
            style={{
              color: isDarkMode ? "#f87171" : "#dc2626",
              marginTop: 6,
              fontWeight: "600",
            }}
          >
            ⚠️ You are overspending
          </Text>
        )}

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

      <Text
        style={[
          tailwind`text-xl font-bold mx-5`,
          { color: isDarkMode ? "#ffffff" : "#000000" },
        ]}
      >
        Transactions
      </Text>

      <View style={tailwind`flex-row mx-5 mt-3 mb-2`}>
        {["all", "today", "week", "month", "year"].map((item) => (
          <Pressable
            key={item}
            onPress={() => setFilter(item)}
            style={[
              tailwind`flex-1 py-2 mx-1 rounded-xl items-center`,
              {
                backgroundColor: filter === item ? "#2563EB" : "transparent",
                borderWidth: 1,
                borderColor: "#2563EB",
              },
            ]}
          >
            <Text
              style={{
                color: filter === item ? "#fff" : "#2563EB",
                fontWeight: "600",
                fontSize: 12,
              }}
            >
              {item.toUpperCase()}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredTransactions}
        renderItem={({ item }) => <ExpenseItemCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
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

      <Pressable
        onPress={() => setShowCalculator(true)}
        style={{
          position: "absolute",
          bottom: 25,
          right: 20,
          backgroundColor: "#2563EB",
          width: 55,
          height: 55,
          borderRadius: 30,
          justifyContent: "center",
          alignItems: "center",
          elevation: 5,
        }}
      >
        <Ionicons name="calculator-outline" size={24} color="#fff" />
      </Pressable>

      {showCalculator && (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              width: "85%",
              backgroundColor: "#fff",
              borderRadius: 16,
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 26, marginBottom: 15 }}>
              {calcValue || "0"}
            </Text>

            {[
              ["7", "8", "9", "/"],
              ["4", "5", "6", "*"],
              ["1", "2", "3", "-"],
              ["0", ".", "=", "+"],
              ["C"],
            ].map((row, i) => (
              <View key={i} style={{ flexDirection: "row", marginBottom: 10 }}>
                {row.map((btn) => (
                  <Pressable
                    key={btn}
                    onPress={() => handleCalcPress(btn)}
                    style={{
                      flex: 1,
                      margin: 5,
                      padding: 15,
                      backgroundColor: "#e5e7eb",
                      borderRadius: 10,
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{btn}</Text>
                  </Pressable>
                ))}
              </View>
            ))}

            <Pressable
              onPress={() => setShowCalculator(false)}
              style={{
                backgroundColor: "#ef4444",
                padding: 12,
                borderRadius: 10,
                alignItems: "center",
                marginTop: 10,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "bold" }}>Close</Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
