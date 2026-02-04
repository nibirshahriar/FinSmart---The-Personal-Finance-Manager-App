import {
  Button,
  Pressable,
  StyleSheet,
  Text,
  View,
  FlatList,
} from "react-native";
import React from "react";
import tailwind from "twrnc";
import EmptyList from "../components/EmptyList";
import ExpenseItemCard from "../components/ExpenseItemCard";
import { useExpenses } from "../context/ExpenseContext";

const Home = ({ navigation }) => {
  const { expenses } = useExpenses();

  const totalSpent = expenses.reduce(
    (sum, item) => sum + Number(item.amount),
    0,
  );

  return (
    <View style={tailwind`flex-1 bg-white`}>
      <View style={tailwind`px-5 pt-5 pb-3`}>
        <Text style={tailwind`text-4xl font-bold text-black`}>Hello 👋</Text>
        <Text style={tailwind`text-base text-gray-500 mt-1`}>
          Start tracking your expenses wisely
        </Text>
      </View>

      <View
        style={tailwind`bg-violet-600 rounded-3xl p-6 my-5 mx-5 items-center`}
      >
        <Text style={tailwind`text-base text-gray-300`}>Spent so far</Text>
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
      />
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({});
