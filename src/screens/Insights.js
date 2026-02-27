import { StyleSheet, Text, View, ScrollView } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import tailwind from "twrnc";
import { useExpenses } from "../context/ExpenseContext";
import { processDataForPieChart } from "../helper";
import { useTheme } from "../context/ThemeContext";

const Insights = () => {
  const { expenses } = useExpenses();
  const { isDarkMode } = useTheme();

  // =====================================
  // Calculate Income
  // =====================================
  const totalIncome = expenses
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // =====================================
  // Calculate Expense (Safe filter)
  // =====================================
  const expenseOnly = expenses.filter((item) => item.type !== "income");

  const totalExpense = expenseOnly.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  // =====================================
  // Balance Calculation
  // =====================================
  const balance = totalIncome - totalExpense;
  const isProfit = balance >= 0;

  const total = totalIncome + totalExpense;

  // =====================================
  // Income vs Expense Chart (with %)
  // =====================================
  const overviewData =
    total === 0
      ? []
      : [
          {
            value: totalIncome,
            color: "#16a34a",
            text: `${Math.round((totalIncome / total) * 100)}%`,
          },
          {
            value: totalExpense,
            color: "#dc2626",
            text: `${Math.round((totalExpense / total) * 100)}%`,
          },
        ];

  // =====================================
  // Category Breakdown (Expense Only)
  // =====================================
  const rawPieData = processDataForPieChart(expenseOnly);

  const pieChartData = rawPieData.map((item) => ({
    ...item,
    text: `${item.value}%`,
  }));

  return (
    <ScrollView
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#fff" },
      ]}
      contentContainerStyle={{ paddingBottom: 100 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ================= BALANCE CARD ================= */}
      <View
        style={[
          tailwind`mx-5 mt-6 p-6 rounded-3xl`,
          { backgroundColor: isProfit ? "#16a34a" : "#dc2626" },
        ]}
      >
        <Text style={tailwind`text-white text-base`}>Net Balance</Text>

        <Text style={tailwind`text-white text-3xl font-bold mt-2`}>
          Tk {balance.toFixed(2)}
        </Text>

        <Text style={tailwind`text-white mt-1`}>
          {isProfit ? "You are saving money 🎉" : "You are overspending ⚠️"}
        </Text>
      </View>

      {/* ================= INCOME VS EXPENSE ================= */}
      <Text
        style={[
          tailwind`text-xl font-bold text-center mt-8`,
          { color: isDarkMode ? "#fff" : "#000" },
        ]}
      >
        Income vs Expense
      </Text>

      <View style={tailwind`items-center mt-4`}>
        {overviewData.length > 0 ? (
          <PieChart
            data={overviewData}
            donut
            radius={110}
            innerRadius={65}
            showText
            textColor={isDarkMode ? "#fff" : "#000"}
            showTextBackground
            textBackgroundColor={
              isDarkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)"
            }
            textBackgroundRadius={18}
          />
        ) : (
          <Text
            style={{
              marginTop: 20,
              color: isDarkMode ? "#94a3b8" : "#9ca3af",
            }}
          >
            No data available
          </Text>
        )}
      </View>

      {/* Clean Labels */}
      <View style={tailwind`mx-8 mt-4`}>
        <Text style={{ color: "#16a34a", fontWeight: "bold" }}>
          ● Income: Tk {totalIncome.toFixed(2)}
        </Text>
        <Text style={{ color: "#dc2626", fontWeight: "bold" }}>
          ● Expense: Tk {totalExpense.toFixed(2)}
        </Text>
      </View>

      {/* ================= SPENDING BREAKDOWN ================= */}
      <Text
        style={[
          tailwind`text-xl font-bold text-center mt-8`,
          { color: isDarkMode ? "#fff" : "#000" },
        ]}
      >
        Spending Breakdown
      </Text>

      <View style={tailwind`items-center mt-4`}>
        {pieChartData.length > 0 ? (
          <PieChart
            data={pieChartData}
            donut
            radius={120}
            innerRadius={70}
            showText
            textColor={isDarkMode ? "#fff" : "#000"}
            showTextBackground
            textBackgroundColor={
              isDarkMode ? "rgba(0,0,0,0.6)" : "rgba(255,255,255,0.8)"
            }
            textBackgroundRadius={18}
          />
        ) : (
          <Text
            style={{
              marginTop: 20,
              color: isDarkMode ? "#94a3b8" : "#9ca3af",
            }}
          >
            No expense data available
          </Text>
        )}
      </View>

      {/* Category List */}
      <View style={tailwind`mt-4`}>
        {pieChartData.map((item) => (
          <View
            key={item.name}
            style={[
              tailwind`flex-row justify-between items-center px-6 py-3`,
              {
                borderBottomWidth: 1,
                borderColor: isDarkMode ? "#334155" : "#e5e7eb",
              },
            ]}
          >
            <View style={tailwind`flex-row items-center`}>
              <View
                style={[
                  tailwind`w-4 h-4 rounded-full mr-3`,
                  { backgroundColor: item.color },
                ]}
              />
              <Text
                style={{
                  color: isDarkMode ? "#e5e7eb" : "#374151",
                }}
              >
                {item.name}
              </Text>
            </View>

            <View style={tailwind`items-end`}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: isDarkMode ? "#fff" : "#111827",
                }}
              >
                Tk {item.amount.toFixed(2)}
              </Text>
              <Text
                style={{
                  color: isDarkMode ? "#94a3b8" : "#6b7280",
                }}
              >
                {item.value}%
              </Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

export default Insights;

const styles = StyleSheet.create({});
