import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tailwind from "twrnc";
import uuid from "react-native-uuid";
import { useTheme } from "../context/ThemeContext";
import { useTour } from "../context/TourContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

const TourDetails = ({ route, navigation }) => {
  const { tourId } = route?.params || {};
  const {
    tours,
    addMember,
    addTourExpense,
    updateMemberPaid,
    calculateSettlement,
    markTourSettled,
    settlePayment,
  } = useTour();

  const { isDarkMode } = useTheme();

  const tour = useMemo(
    () => tours.find((t) => t.id === tourId),
    [tours, tourId],
  );

  const [memberName, setMemberName] = useState("");
  const [expenseTitle, setExpenseTitle] = useState("");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [paidMember, setPaidMember] = useState(null);

  const settlements = useMemo(() => {
    try {
      return calculateSettlement ? calculateSettlement(tourId) : [];
    } catch {
      return [];
    }
  }, [tours, tourId, calculateSettlement]);

  if (!tour) {
    return (
      <View style={tailwind`flex-1 items-center justify-center bg-slate-950`}>
        <Text style={tailwind`text-white text-lg font-semibold`}>
          Tour not found
        </Text>
      </View>
    );
  }

  const totalExpense = tour.totalExpense || 0;
  const members = tour.members || [];
  const memberCount = members.length;
  const perPerson = memberCount > 0 ? Math.ceil(totalExpense / memberCount) : 0;

  const handleAddMember = () => {
    if (!memberName.trim()) return;
    addMember(tourId, memberName.trim());
    setMemberName("");
  };

  const handleAddExpense = () => {
    if (!expenseTitle || !expenseAmount || !paidMember) {
      alert("Fill all fields");
      return;
    }
    const amount = Number(expenseAmount);

    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount");
      return;
    }
    addTourExpense(tourId, {
      id: uuid.v4().toString(),
      title: expenseTitle,
      amount,
      paidBy: paidMember,
    });
    updateMemberPaid(tourId, paidMember, amount);
    setExpenseTitle("");
    setExpenseAmount("");
    setPaidMember(null);
  };

  const Theme = {
    bg: isDarkMode ? "#0F172A" : "#F1F5F9",
    card: isDarkMode ? "#1E293B" : "#FFFFFF",
    textMain: isDarkMode ? "#F8FAFC" : "#0F172A",
    textSub: isDarkMode ? "#94A3B8" : "#64748B",
    primary: "#6366F1",
    secondary: "#10B981",
    accent: "#F59E0B",
    border: isDarkMode ? "#334155" : "#E2E8F0",
  };

  return (
    <SafeAreaView style={[tailwind`flex-1`, { backgroundColor: Theme.bg }]}>
      <View style={tailwind`px-6 pt-4 flex-row justify-between items-center`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tailwind`p-2 -ml-2`}
        >
          <Ionicons name="chevron-back" size={24} color={Theme.textMain} />
        </TouchableOpacity>
        <Text style={[tailwind`text-xl font-bold`, { color: Theme.textMain }]}>
          Tour Details
        </Text>
        <View style={tailwind`w-10`} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={tailwind`p-6 pb-40`}
      >
        <View style={tailwind`mb-8`}>
          <Text
            style={[
              tailwind`text-3xl font-extrabold tracking-tight`,
              { color: Theme.textMain },
            ]}
          >
            {tour.name}
          </Text>
          <View style={tailwind`flex-row items-center mt-2`}>
            <Ionicons name="location" size={16} color={Theme.primary} />
            <Text
              style={[
                tailwind`text-sm font-medium ml-1`,
                { color: Theme.textSub },
              ]}
            >
              {tour.destination}
            </Text>
          </View>
        </View>

        <View
          style={[
            tailwind`p-6 rounded-3xl shadow-xl mb-8`,
            { backgroundColor: Theme.primary },
          ]}
        >
          <View style={tailwind`flex-row justify-between items-center mb-6`}>
            <View>
              <Text
                style={tailwind`text-indigo-100 text-xs font-bold uppercase tracking-wider`}
              >
                Total Expense
              </Text>
              <Text style={tailwind`text-white text-3xl font-black mt-1`}>
                Tk {totalExpense.toLocaleString()}
              </Text>
            </View>
            <View style={tailwind`bg-white/20 p-3 rounded-2xl`}>
              <MaterialCommunityIcons
                name="wallet-outline"
                size={32}
                color="white"
              />
            </View>
          </View>
          <View style={tailwind`h-[1px] bg-white/20 mb-4`} />
          <View style={tailwind`flex-row justify-between`}>
            <View>
              <Text
                style={tailwind`text-indigo-100 text-[10px] font-bold uppercase`}
              >
                Members
              </Text>
              <Text style={tailwind`text-white font-bold text-lg`}>
                {memberCount} People
              </Text>
            </View>
            <View style={tailwind`items-end`}>
              <Text
                style={tailwind`text-indigo-100 text-[10px] font-bold uppercase`}
              >
                Per Person
              </Text>
              <Text style={tailwind`text-white font-bold text-lg`}>
                Tk {perPerson.toLocaleString()}
              </Text>
            </View>
          </View>
        </View>

        <View
          style={[
            tailwind`p-5 rounded-2xl border mb-6`,
            { backgroundColor: Theme.card, borderColor: Theme.border },
          ]}
        >
          <View style={tailwind`flex-row justify-between items-center mb-4`}>
            <Text
              style={[tailwind`text-lg font-bold`, { color: Theme.textMain }]}
            >
              Members List
            </Text>
            <Text
              style={[
                tailwind`text-xs font-bold px-2 py-1 rounded-full`,
                { backgroundColor: Theme.bg, color: Theme.primary },
              ]}
            >
              {memberCount}
            </Text>
          </View>

          <View style={tailwind`flex-row items-center mb-4`}>
            <TextInput
              placeholder="Add name..."
              placeholderTextColor={Theme.textSub}
              value={memberName}
              onChangeText={setMemberName}
              style={[
                tailwind`flex-1 p-4 rounded-xl font-medium`,
                { backgroundColor: Theme.bg, color: Theme.textMain },
              ]}
            />
            <TouchableOpacity
              onPress={handleAddMember}
              style={[
                tailwind`ml-3 p-4 rounded-xl`,
                { backgroundColor: Theme.primary },
              ]}
            >
              <Ionicons name="person-add" size={20} color="white" />
            </TouchableOpacity>
          </View>

          <View style={tailwind`flex-row flex-wrap`}>
            {members?.map((m, i) => (
              <View
                key={i}
                style={[
                  tailwind`px-3 py-2 rounded-xl mr-2 mb-2 border`,
                  { backgroundColor: Theme.bg, borderColor: Theme.border },
                ]}
              >
                <Text
                  style={[
                    tailwind`text-sm font-bold`,
                    { color: Theme.textMain },
                  ]}
                >
                  {m.name}
                </Text>
                <Text
                  style={[
                    tailwind`text-[10px] font-medium`,
                    { color: Theme.secondary },
                  ]}
                >
                  Paid: Tk {m.paid || 0}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View
          style={[
            tailwind`p-5 rounded-2xl border mb-6`,
            { backgroundColor: Theme.card, borderColor: Theme.border },
          ]}
        >
          <Text
            style={[
              tailwind`text-lg font-bold mb-4`,
              { color: Theme.textMain },
            ]}
          >
            Add Expense
          </Text>

          <TextInput
            placeholder="Expense title"
            placeholderTextColor={Theme.textSub}
            value={expenseTitle}
            onChangeText={setExpenseTitle}
            style={[
              tailwind`w-full p-4 rounded-xl font-medium mb-3`,
              { backgroundColor: Theme.bg, color: Theme.textMain },
            ]}
          />

          <View
            style={[
              tailwind`flex-row items-center p-4 rounded-xl mb-4`,
              { backgroundColor: Theme.bg },
            ]}
          >
            <Text style={[tailwind`font-bold mr-2`, { color: Theme.textSub }]}>
              Tk
            </Text>
            <TextInput
              placeholder="0"
              keyboardType="numeric"
              placeholderTextColor={Theme.textSub}
              value={expenseAmount}
              onChangeText={setExpenseAmount}
              style={[tailwind`flex-1 font-bold`, { color: Theme.textMain }]}
            />
          </View>

          <Text
            style={[
              tailwind`text-xs font-bold uppercase mb-3`,
              { color: Theme.textSub },
            ]}
          >
            Paid By
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            persistentScrollbar={true}
            style={tailwind`-mx-1 mb-4`}
            contentContainerStyle={tailwind`pb-2 px-1`}
          >
            {members.map((member, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setPaidMember(member.id)}
                style={[
                  tailwind`px-5 py-3 rounded-xl mx-1 border-2`,
                  {
                    backgroundColor:
                      paidMember === member.id ? Theme.primary : Theme.bg,
                    borderColor:
                      paidMember === member.id ? Theme.primary : Theme.border,
                  },
                ]}
              >
                <Text
                  style={[
                    tailwind`font-bold`,
                    {
                      color:
                        paidMember === member.id ? "white" : Theme.textMain,
                    },
                  ]}
                >
                  {member.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <TouchableOpacity
            onPress={handleAddExpense}
            style={[
              tailwind`w-full p-4 rounded-xl items-center`,
              { backgroundColor: Theme.secondary },
            ]}
          >
            <Text style={tailwind`text-white font-black`}>ADD EXPENSE</Text>
          </TouchableOpacity>
        </View>

        <View
          style={[
            tailwind`p-5 rounded-2xl border mb-6`,
            { backgroundColor: Theme.card, borderColor: Theme.border },
          ]}
        >
          <Text
            style={[
              tailwind`text-lg font-bold mb-4`,
              { color: Theme.textMain },
            ]}
          >
            History
          </Text>
          {(tour.expenses || []).length === 0 ? (
            <Text
              style={[
                tailwind`text-center py-4 italic`,
                { color: Theme.textSub },
              ]}
            >
              No expenses yet.
            </Text>
          ) : (
            (tour.expenses || []).map((exp, index) => (
              <View
                key={index}
                style={[
                  tailwind`flex-row justify-between items-center py-3 border-b`,
                  { borderColor: Theme.border },
                ]}
              >
                <View>
                  <Text
                    style={[tailwind`font-bold`, { color: Theme.textMain }]}
                  >
                    {exp.title}
                  </Text>
                  <Text style={[tailwind`text-xs`, { color: Theme.textSub }]}>
                    Paid by{" "}
                    {members?.find((m) => m.id === exp.paidBy)?.name ||
                      "Unknown"}
                  </Text>
                </View>
                <Text
                  style={[
                    tailwind`font-black text-base`,
                    { color: Theme.textMain },
                  ]}
                >
                  Tk {exp.amount}
                </Text>
              </View>
            ))
          )}
        </View>

        <View
          style={[
            tailwind`p-5 rounded-2xl border mb-6`,
            { backgroundColor: Theme.card, borderColor: Theme.border },
          ]}
        >
          <View style={tailwind`flex-row items-center mb-4`}>
            <MaterialCommunityIcons
              name="scale-balance"
              size={20}
              color={Theme.accent}
            />
            <Text
              style={[
                tailwind`text-lg font-bold ml-2`,
                { color: Theme.textMain },
              ]}
            >
              Settlement (Tap to settle)
            </Text>
          </View>
          {settlements.length === 0 ? (
            <View
              style={tailwind`bg-emerald-500/10 p-4 rounded-xl border border-emerald-500/20 flex-row items-center`}
            >
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={tailwind`text-emerald-500 font-bold ml-2`}>
                All settled
              </Text>
            </View>
          ) : (
            settlements.map((s, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => settlePayment(tourId, s.from, s.to, s.amount)}
                style={[
                  tailwind`flex-row items-center justify-between p-4 rounded-xl mb-2`,
                  { backgroundColor: Theme.bg },
                ]}
              >
                <View>
                  <Text
                    style={[
                      tailwind`text-xs font-bold uppercase`,
                      { color: Theme.textSub },
                    ]}
                  >
                    {s.from}
                  </Text>
                  <Text
                    style={[
                      tailwind`text-sm font-medium`,
                      { color: Theme.textMain },
                    ]}
                  >
                    pays {s.to}
                  </Text>
                </View>
                <Text style={tailwind`text-lg font-black text-amber-500`}>
                  Tk {s.amount}
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      <View
        style={[
          tailwind`absolute bottom-0 left-0 right-0 p-6 flex-row`,
          { backgroundColor: Theme.bg },
        ]}
      >
        {tour.status !== "Settled" && (
          <TouchableOpacity
            onPress={() => markTourSettled(tourId)}
            style={[
              tailwind`flex-1 h-14 rounded-2xl justify-center items-center mr-3 border-2`,
              { borderColor: Theme.secondary },
            ]}
          >
            <Text style={[tailwind`font-bold`, { color: Theme.secondary }]}>
              SETTLE ALL
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

export default TourDetails;
