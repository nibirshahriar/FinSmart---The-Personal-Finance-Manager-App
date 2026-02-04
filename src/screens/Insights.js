import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import tailwind from "twrnc";
import { useExpenses } from "../context/ExpenseContext";
import { processDataForPieChart } from "../helper";

const Insights = () => {
  const { expenses } = useExpenses();

  const pieChartData = processDataForPieChart(expenses);

  return (
    <View>
      <Text style={tailwind`text-3xl font-bold text-center my-5`}>
        Spending Summary
      </Text>
      <View style={tailwind`items-center`}>
        <PieChart data={pieChartData} donut />
      </View>
    </View>
  );
};

export default Insights;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
