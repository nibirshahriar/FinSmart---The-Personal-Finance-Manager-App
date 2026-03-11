import React from "react";
import { View, Text, ScrollView, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tailwind from "twrnc";
import { useTheme } from "../context/ThemeContext";
import { useTour } from "../context/TourContext";

const TourList = ({ navigation }) => {
  const { isDarkMode } = useTheme();
  const { tours, deleteTour } = useTour();

  return (
    <SafeAreaView
      style={[
        tailwind`flex-1`,
        { backgroundColor: isDarkMode ? "#020617" : "#f8fafc" },
      ]}
    >
      <ScrollView contentContainerStyle={tailwind`p-6 pb-28`}>
        <View style={tailwind`mb-6`}>
          <Text
            style={[
              tailwind`text-3xl font-bold`,
              { color: isDarkMode ? "#fff" : "#000" },
            ]}
          >
            My Tours
          </Text>

          <Text
            style={[
              tailwind`mt-2`,
              { color: isDarkMode ? "#94a3b8" : "#6b7280" },
            ]}
          >
            Track and manage your tour expenses
          </Text>
        </View>

        {tours.length === 0 ? (
          <View style={tailwind`mt-20 items-center`}>
            <Text style={tailwind`text-slate-400 text-lg`}>No Tours Yet</Text>

            <Text style={tailwind`text-slate-500 mt-2`}>
              Create your first tour to start tracking expenses
            </Text>
          </View>
        ) : (
          tours.map((tour) => {
            const members = tour.members?.length || 0;
            const total = tour.totalExpense || 0;
            const perPerson = members > 0 ? Math.ceil(total / members) : 0;

            return (
              <Pressable
                key={tour.id}
                onPress={() =>
                  navigation.navigate("TourDetails", {
                    tourId: tour.id,
                  })
                }
                onLongPress={() => {
                  Alert.alert(
                    "Delete Tour",
                    "Are you sure you want to delete this tour?",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => deleteTour(tour.id),
                      },
                    ],
                  );
                }}
                style={[
                  tailwind`p-5 rounded-2xl mb-5`,
                  {
                    backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                  },
                ]}
              >
                <Text
                  style={[
                    tailwind`text-xl font-bold`,
                    { color: isDarkMode ? "#fff" : "#000" },
                  ]}
                >
                  {tour.name}
                </Text>

                <Text style={tailwind`text-slate-400 mt-1`}>
                  {tour.destination}
                </Text>

                <Text style={tailwind`text-slate-400 mt-1`}>
                  👥 {members} Members
                </Text>

                <Text style={tailwind`text-sky-500 mt-2 font-semibold`}>
                  Total: Tk {total}
                </Text>

                <Text style={tailwind`text-orange-400`}>
                  Per Person: Tk {perPerson}
                </Text>

                <View style={tailwind`mt-2`}>
                  <Text
                    style={[
                      tailwind`font-semibold`,
                      {
                        color:
                          tour.status === "Settled" ? "#22c55e" : "#f59e0b",
                      },
                    ]}
                  >
                    {tour.status || "Ongoing"}
                  </Text>
                </View>
              </Pressable>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default TourList;
