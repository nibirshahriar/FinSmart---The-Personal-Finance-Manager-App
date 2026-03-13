import React, { createContext, useContext, useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";
import { Alert } from "react-native";
import {
  getFirestore,
  collection,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "@react-native-firebase/firestore";
import uuid from "react-native-uuid";

const TourContext = createContext();

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    let unsubscribeSnapshot = null;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeSnapshot) {
        unsubscribeSnapshot();
        unsubscribeSnapshot = null;
      }

      if (!user) {
        setTours([]);
        return;
      }

      const toursRef = collection(db, "users", user.uid, "tours");

      unsubscribeSnapshot = onSnapshot(
        toursRef,
        (snapshot) => {
          if (!snapshot || !snapshot.docs) {
            setTours([]);
            return;
          }

          const data = snapshot.docs.map((docItem) => ({
            id: docItem.id,
            ...docItem.data(),
          }));

          setTours(data);
        },
        (error) => {
          if (
            error?.code !== "firestore/permission-denied" &&
            error?.code !== "permission-denied"
          ) {
            console.log("Snapshot error:", error);
          }
          setTours([]);
        },
      );
    });

    return () => {
      if (unsubscribeSnapshot) unsubscribeSnapshot();
      unsubscribeAuth();
    };
  }, []);

  const addTour = (tour) => {
    const newTour = {
      ...tour,
      members: tour.members || [],
      expenses: tour.expenses || [],
      totalExpense: tour.totalExpense || 0,
      perPerson: tour.perPerson || 0,
      status: tour.status || "Ongoing",
    };

    setTours((prev) => [...prev, newTour]);
  };

  const deleteTour = async (tourId) => {
    const user = auth.currentUser;
    if (!user) return;

    await deleteDoc(doc(db, "users", user.uid, "tours", tourId));
  };

  const addMember = async (tourId, memberName) => {
    if (!memberName) return;

    const tour = tours.find((t) => t.id === tourId);
    if (!tour) return;

    if (
      tour.members?.some(
        (m) => m.name.toLowerCase() === memberName.toLowerCase(),
      )
    ) {
      Alert.alert("Duplicate Member", `${memberName} already exists`);
      return;
    }

    const updatedMembers = [
      ...(tour.members || []),
      {
        id: uuid.v4(),
        name: memberName,
        paid: 0,
      },
    ];

    const totalExpense = tour.totalExpense || 0;
    const memberCount = updatedMembers.length;

    const perPerson =
      memberCount > 0 ? Math.ceil(totalExpense / memberCount) : 0;

    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "tours", tourId), {
      members: updatedMembers,
      perPerson,
    });
  };

  const addTourExpense = async (tourId, expense) => {
    const tour = tours.find((t) => t.id === tourId);
    if (!tour) return;

    const updatedExpenses = [
      ...(tour.expenses || []),
      {
        ...expense,
        id: uuid.v4(),
      },
    ];

    const totalExpense = updatedExpenses.reduce(
      (sum, item) => sum + item.amount,
      0,
    );

    const memberCount = tour.members?.length || 0;

    const perPerson =
      memberCount > 0 ? Math.ceil(totalExpense / memberCount) : 0;

    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "tours", tourId), {
      expenses: updatedExpenses,
      totalExpense,
      perPerson,
    });
  };

  const updateMemberPaid = async (tourId, memberId, amount) => {
    const tour = tours.find((t) => t.id === tourId);
    if (!tour) return;

    const updatedMembers = tour.members.map((m) =>
      m.id === memberId ? { ...m, paid: m.paid + amount } : m,
    );

    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "tours", tourId), {
      members: updatedMembers,
    });
  };

  const settlePayment = async (tourId, fromName, toName, amount) => {
    const tour = tours.find((t) => t.id === tourId);
    if (!tour) return;

    const updatedMembers = tour.members.map((m) => {
      if (m.name === fromName) return { ...m, paid: m.paid + amount };
      if (m.name === toName) return { ...m, paid: m.paid - amount };
      return m;
    });

    const user = auth.currentUser;
    if (!user) return;

    await updateDoc(doc(db, "users", user.uid, "tours", tourId), {
      members: updatedMembers,
    });
  };

  const calculateSettlement = (tourId) => {
    const tour = tours.find((t) => t.id === tourId);
    if (!tour) return [];

    const members = tour.members || [];
    const perPerson = tour.perPerson || 0;

    const balances = members.map((m) => ({
      name: m.name,
      balance: (m.paid || 0) - perPerson,
    }));

    const creditors = balances.filter((b) => b.balance > 0);
    const debtors = balances.filter((b) => b.balance < 0);

    const settlements = [];

    let i = 0;
    let j = 0;

    while (i < debtors.length && j < creditors.length) {
      const debtor = debtors[i];
      const creditor = creditors[j];

      const payAmount = Math.min(Math.abs(debtor.balance), creditor.balance);

      settlements.push({
        from: debtor.name,
        to: creditor.name,
        amount: Math.round(payAmount),
      });

      debtor.balance += payAmount;
      creditor.balance -= payAmount;

      if (Math.abs(debtor.balance) < 1) i++;
      if (creditor.balance < 1) j++;
    }

    return settlements;
  };

  const markTourSettled = async (tourId) => {
    const user = auth.currentUser;
    if (!user) return;

    const tour = tours.find((t) => t.id === tourId);
    if (!tour) return;

    const clearedMembers = tour.members.map((m) => ({
      ...m,
      paid: 0,
    }));

    await updateDoc(doc(db, "users", user.uid, "tours", tourId), {
      members: clearedMembers,
      expenses: [],
      totalExpense: 0,
      perPerson: 0,
      status: "Settled",
    });
  };

  return (
    <TourContext.Provider
      value={{
        tours,
        addTour,
        deleteTour,
        addMember,
        addTourExpense,
        updateMemberPaid,
        calculateSettlement,
        markTourSettled,
        settlePayment,
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
