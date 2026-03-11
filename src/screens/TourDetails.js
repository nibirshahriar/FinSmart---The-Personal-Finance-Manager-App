import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tailwind from "twrnc";
import { useTheme } from "../context/ThemeContext";
import { useTour } from "../context/TourContext";

const TourDetails = ({ route, navigation }) => {
  const { tourId } = route.params;
  const {
    tours,
    addMember,
    addTourExpense,
    updateMemberPaid,
    calculateSettlement,
    markTourSettled,
  } = useTour();

  const { isDarkMode } = useTheme();

  const tour = tours.find((t) => t.id === tourId);

  const [memberName, setMemberName] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paidMember, setPaidMember] = useState(null);

  if (!tour) {
    return (
      <View style={tailwind`flex-1 items-center justify-center`}>
        <Text>Tour not found</Text>
      </View>
    );
  }

  const totalExpense = tour.totalExpense || 0;
  const memberCount = tour.members?.length || 0;
  const perPerson = memberCount > 0 ? Math.ceil(totalExpense / memberCount) : 0;

  const settlements = calculateSettlement(tourId);

  const handleAddMember = () => {
    if (!memberName) return;
    addMember(tourId, memberName);
    setMemberName("");
  };

  const handleAddExpense = () => {
    if (!expenseTitle || !expenseAmount || !paidMember) return;

    const amount = Number(expenseAmount);

    addTourExpense(tourId, {
      id: Date.now().toString(),
      title: expenseTitle,
      amount,
      paidBy: paidMember,
    });

    updateMemberPaid(tourId, paidMember, amount);

    setExpenseTitle("");
    setExpenseAmount("");
    setPaidMember(null);
  };

  return (
    <SafeAreaView
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#f8fafc" },
      ]}
    >
      <ScrollView contentContainerStyle={tailwind`p-6 pb-24`}>
        <Text
          style={[
            tailwind`text-3xl font-bold`,
            { color: isDarkMode ? "#fff" : "#000" },
          ]}
        >
          {tour.name}
        </Text>

        <Text style={tailwind`text-slate-400 mt-1`}>{tour.destination}</Text>

        <Text style={tailwind`text-sky-500 mt-3 text-lg`}>
          Total Expense: Tk {totalExpense}
        </Text>

        <Text style={tailwind`text-orange-400 text-lg`}>
          Per Person: Tk {perPerson}
        </Text>

        {/* Members */}
        <View style={tailwind`mt-8`}>
          <Text
            style={[
              tailwind`text-xl font-semibold mb-2`,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            Members
          </Text>

          {(tour.members || []).map((member) => (
            <Text
              key={member.id}
              style={[
                tailwind`mb-1`,
                { color: isDarkMode ? "#cbd5f5" : "#334155" },
              ]}
            >
              👤 {member.name} (Paid: Tk {member.paid})
            </Text>
          ))}

          <View style={tailwind`flex-row mt-3`}>
            <TextInput
              placeholder="Member name"
              placeholderTextColor="#64748b"
              value={memberName}
              onChangeText={setMemberName}
              style={[
                tailwind`border flex-1 p-3 rounded-xl`,
                {
                  borderColor: "#475569",
                  color: isDarkMode ? "#fff" : "#000",
                },
              ]}
            />

            <Pressable
              onPress={handleAddMember}
              style={tailwind`bg-blue-500 ml-2 px-4 justify-center rounded-xl`}
            >
              <Text style={tailwind`text-white`}>Add</Text>
            </Pressable>
          </View>
        </View>

        {/* Expenses */}
        <View style={tailwind`mt-8`}>
          <Text
            style={[
              tailwind`text-xl font-semibold mb-2`,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            Expenses
          </Text>

          {(tour.expenses || []).map((exp) => (
            <Text
              key={exp.id}
              style={[
                tailwind`mb-1`,
                { color: isDarkMode ? "#cbd5f5" : "#334155" },
              ]}
            >
              {exp.title} - Tk {exp.amount}
            </Text>
          ))}

          <TextInput
            placeholder="Expense title"
            placeholderTextColor="#64748b"
            value={expenseTitle}
            onChangeText={setExpenseTitle}
            style={[
              tailwind`border p-3 rounded-xl mt-3`,
              {
                borderColor: "#475569",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
          />

          <TextInput
            placeholder="Amount"
            keyboardType="numeric"
            placeholderTextColor="#64748b"
            value={expenseAmount}
            onChangeText={setExpenseAmount}
            style={[
              tailwind`border p-3 rounded-xl mt-3`,
              {
                borderColor: "#475569",
                color: isDarkMode ? "#fff" : "#000",
              },
            ]}
          />

          {/* Paid By */}
          <Text
            style={[
              tailwind`mt-4 mb-2`,
              { color: isDarkMode ? "#cbd5f5" : "#334155" },
            ]}
          >
            Paid By
          </Text>

          {(tour.members || []).map((member) => (
            <Pressable
              key={member.id}
              onPress={() => setPaidMember(member.id)}
              style={[
                tailwind`p-2 rounded-lg mb-1`,
                {
                  backgroundColor:
                    paidMember === member.id ? "#22c55e" : "#1e293b",
                },
              ]}
            >
              <Text style={tailwind`text-white`}>{member.name}</Text>
            </Pressable>
          ))}

          <Pressable
            onPress={handleAddExpense}
            style={tailwind`bg-green-500 mt-4 p-3 rounded-xl items-center`}
          >
            <Text style={tailwind`text-white font-semibold`}>Add Expense</Text>
          </Pressable>
        </View>

        {/* Settlement */}
        <View style={tailwind`mt-10`}>
          <Text
            style={[
              tailwind`text-xl font-semibold mb-2`,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            Settlement
          </Text>

          {settlements.length === 0 ? (
            <Text style={tailwind`text-slate-400`}>
              All balances are settled
            </Text>
          ) : (
            settlements.map((s, index) => (
              <Text
                key={index}
                style={[
                  tailwind`mb-1`,
                  { color: isDarkMode ? "#cbd5f5" : "#334155" },
                ]}
              >
                ⚖ {s.from} owes {s.to} Tk {s.amount}
              </Text>
            ))
          )}
        </View>

        {/* Buttons */}
        <Pressable
          onPress={() => markTourSettled(tourId)}
          style={tailwind`bg-emerald-500 mt-8 p-3 rounded-xl items-center`}
        >
          <Text style={tailwind`text-white font-semibold`}>
            Mark Tour as Settled
          </Text>
        </Pressable>

        <Pressable
          onPress={() => navigation.navigate("TourSummary", { tourId })}
          style={tailwind`bg-indigo-500 mt-4 p-3 rounded-xl items-center`}
        >
          <Text style={tailwind`text-white font-semibold`}>
            View Tour Summary
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TourDetails;
