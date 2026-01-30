import {Button,Pressable, StyleSheet, Text, View,FlatList } from 'react-native'
import React from 'react'
import tailwind from 'twrnc';
import EmptyList from '../components/EmptyList';
import ExpenseItemCard from '../components/ExpenseItemCard';

export const expensesData = [
  {
    id: "1",
    icon: "🛒",
    title: "Grocery Shopping",
    category: "Food",
    amount: 850.0,
    date: "2025-01-25",
    color: "#34D399", // Emerald
  },
  {
    id: "2",
    icon: "🚗",
    title: "Rickshaw & Bus Fare",
    category: "Transportation",
    amount: 120.0,
    date: "2025-01-26",
    color: "#60A5FA", // Blue
  },
  {
    id: "3",
    icon: "🍛",
    title: "Lunch Outside",
    category: "Food",
    amount: 180.0,
    date: "2025-01-26",
    color: "#FBBF24", // Amber
  },
  {
    id: "4",
    icon: "📱",
    title: "Mobile Recharge",
    category: "Utilities",
    amount: 299.0,
    date: "2025-01-27",
    color: "#A78BFA", // Violet
  },
  {
    id: "5",
    icon: "🧼",
    title: "Daily Essentials",
    category: "Household",
    amount: 220.0,
    date: "2025-01-28",
    color: "#F87171", // Soft Red
  },
];

const Home = ({navigation}) => {

const totalSpent = expensesData.reduce((sum,item)=> sum + item.amount,0)

  return (
 <View>
   <View style={tailwind`px-5 pt-5 pb-3`}>
      <Text style={tailwind`text-4xl font-bold text-black`}>Hello 👋</Text>
<Text style={tailwind`text-base text-gray-500 mt-1`}>Start tracking your expenses wisely</Text>
{/* <Button onPress={() => navigation.navigate("Profile")} title="Profile" /> */}
    </View>

<View
  style={tailwind`bg-black rounded-3xl p-6 my-5 mx-5 items-center shadow-lg`}
>
  <Text style={tailwind`text-base text-gray-400`}>
    Spent so far
  </Text>
  <Text style={tailwind`text-base text-white text-4xl mt-2 font-bold`}>
    Tk.{totalSpent.toFixed(2)}
  </Text>
</View>


<FlatList
  data={expensesData}
  // data={[]}
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