import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import { PieChart } from "react-native-gifted-charts";
import tailwind from "twrnc";
import { useExpenses } from "../context/ExpenseContext";
import { processDataForPieChart } from "../helper";

const Insights = () => {
  const { expenses } = useExpenses();

  const pieChartData = processDataForPieChart(expenses);

  const renderListItem = ({ item }) => {
    return (
      <View
        style={tailwind`flex-row items-center justify-between p-4 border-b border-gray-200`}
      >
        <View style={tailwind`flex-row items-center`}>
          <View
            style={[
              tailwind`w-4 h-4 rounded-full mr-3`,
              { backgroundColor: item.color },
            ]}
          />
          <Text style={tailwind`text-base text-gray-700`}>{item.name}</Text>
        </View>

        <View style={tailwind`items-end`}>
          <Text style={tailwind`text-gray-800 font-semibold`}>
            Tk {item.amount.toFixed(2)}
          </Text>
          <Text style={tailwind`text-gray-500`}>{item.value}%</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <Text style={tailwind`text-3xl font-bold text-center my-6`}>
        Spending Summary
      </Text>
      <View style={tailwind`items-center mb-4`}>
        <PieChart data={pieChartData} donut showText radius={120} />
      </View>
      <FlatList
        data={pieChartData}
        renderItem={renderListItem}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ paddingBottom: 40 }}
        ListEmptyComponent={
          <Text style={tailwind`text-center text-gray-400 mt-10`}>
            No expense data available
          </Text>
        }
      />
    </View>
  );
};

export default Insights;

const styles = StyleSheet.create({});
