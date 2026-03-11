import React from "react";
import { View, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tailwind from "twrnc";
import { useTour } from "../context/TourContext";
import { useTheme } from "../context/ThemeContext";

const TourSummary = ({ route }) => {
  const { tourId } = route.params;
  const { tours, calculateSettlement } = useTour();
  const { isDarkMode } = useTheme();

  const tour = tours.find((t) => t.id === tourId);

  if (!tour) return null;

  const settlements = calculateSettlement(tourId);

  return (
    <SafeAreaView
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#f8fafc" },
      ]}
    >
      <ScrollView contentContainerStyle={tailwind`p-6`}>
        <Text
          style={[
            tailwind`text-3xl font-bold`,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          {tour.name}
        </Text>

        <Text style={tailwind`text-slate-400 mt-1`}>{tour.destination}</Text>

        <Text style={tailwind`text-sky-500 mt-4 text-lg`}>
          Total Expense: Tk {tour.totalExpense}
        </Text>

        <Text style={tailwind`text-orange-400 text-lg`}>
          Per Person: Tk {tour.perPerson}
        </Text>

        <Text style={tailwind`text-slate-400 mt-3`}>
          Members: {tour.members.length}
        </Text>

        <Text style={tailwind`text-slate-400`}>Status: {tour.status}</Text>

        <Text
          style={[
            tailwind`text-xl mt-6 mb-2`,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          Settlement
        </Text>

        {settlements.length === 0 ? (
          <Text style={tailwind`text-slate-400`}>All balances settled</Text>
        ) : (
          settlements.map((s, i) => (
            <Text key={i} style={tailwind`text-slate-300`}>
              {s.from} owes {s.to} Tk {s.amount}
            </Text>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TourSummary;
