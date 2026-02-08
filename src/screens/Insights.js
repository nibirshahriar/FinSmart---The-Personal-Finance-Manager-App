import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import tailwind from "twrnc";
import { useExpenses } from "../context/ExpenseContext";
import { processDataForPieChart } from "../helper";
import { useTheme } from "../context/ThemeContext";

const Insights = () => {
  const { expenses } = useExpenses();
  const { isDarkMode } = useTheme();

  const pieChartData = processDataForPieChart(expenses);

  const renderListItem = ({ item }) => {
    return (
      <View
        style={[
          tailwind`flex-row items-center justify-between p-4 border-b`,
          {
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
            style={[
              tailwind`text-base`,
              { color: isDarkMode ? "#e5e7eb" : "#374151" },
            ]}
          >
            {item.name}
          </Text>
        </View>

        <View style={tailwind`items-end`}>
          <Text
            style={[
              tailwind`font-semibold`,
              { color: isDarkMode ? "#fff" : "#1f2937" },
            ]}
          >
            Tk {item.amount.toFixed(2)}
          </Text>
          <Text
            style={[
              tailwind`text-sm`,
              { color: isDarkMode ? "#94a3b8" : "#6b7280" },
            ]}
          >
            {item.value}%
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View
      style={[
        { flex: 1 },
        { backgroundColor: isDarkMode ? "#020617" : "#fff" },
      ]}
    >
      <Text
        style={[
          tailwind`text-3xl font-bold text-center my-6`,
          { color: isDarkMode ? "#fff" : "#000" },
        ]}
      >
        Spending Summary
      </Text>

      <View style={tailwind`items-center mb-4`}>
        <PieChart
          data={pieChartData}
          donut
          showText
          radius={120}
          textColor={isDarkMode ? "#fff" : "#000"}
        />
      </View>

      <FlatList
        data={pieChartData}
        renderItem={renderListItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text
            style={[
              tailwind`text-center mt-10`,
              { color: isDarkMode ? "#94a3b8" : "#9ca3af" },
            ]}
          >
            No expense data available
          </Text>
        }
      />
    </View>
  );
};

export default Insights;

const styles = StyleSheet.create({});
