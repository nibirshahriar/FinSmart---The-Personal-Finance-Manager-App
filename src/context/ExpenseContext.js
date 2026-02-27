import React, { createContext, useContext, useState, useEffect } from "react";
import { getCategoryColor, getDate } from "../helper";

import { getAuth, onAuthStateChanged } from "@react-native-firebase/auth";

import {
  getFirestore,
  collection,
  doc,
  addDoc,
  deleteDoc,
  getDocs,
  query,
  orderBy,
  onSnapshot,
  writeBatch,
  serverTimestamp,
} from "@react-native-firebase/firestore";

export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);

  const auth = getAuth();
  const db = getFirestore();

  //Listen to Auth + Firestore (REALTIME)
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setExpenses([]);
        return;
      }

      const expensesRef = collection(db, "users", user.uid, "expenses");
      const q = query(expensesRef, orderBy("createdAt", "desc"));

      const unsubscribeSnapshot = onSnapshot(
        q,
        (snapshot) => {
          const list = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setExpenses(list);
        },
        (error) => {
          console.log("Snapshot error:", error.message);
        },
      );

      return unsubscribeSnapshot;
    });

    return unsubscribeAuth;
  }, []);

  // Add Expense / Income
  const addExpense = async (expense) => {
    const user = auth.currentUser;
    if (!user) return;

    const expensesRef = collection(db, "users", user.uid, "expenses");

    // Base object (common for both income & expense)
    const newExpense = {
      title: expense.title,
      amount: Number(expense.amount),
      type: expense.type,
      date: getDate(),
      createdAt: serverTimestamp(),
    };

    // If Expense → store category data
    if (expense.type === "expense" && expense.category) {
      newExpense.category = expense.category.name;
      newExpense.color = getCategoryColor(expense.category.color);
      newExpense.icon = expense.category.icon;
    }

    // If Income → store default values
    if (expense.type === "income") {
      newExpense.category = "Income";
      newExpense.color = "#16a34a";
      newExpense.icon = "💰";
    }

    try {
      await addDoc(expensesRef, newExpense);
    } catch (error) {
      console.log("Add error:", error.message);
    }
  };

  //Delete Single Expense
  const deleteExpense = async (id) => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      await deleteDoc(doc(db, "users", user.uid, "expenses", id));
    } catch (error) {
      console.log("Delete error:", error.message);
    }
  };

  //Clear All Expenses
  const clearAllExpenses = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const expensesRef = collection(db, "users", user.uid, "expenses");
      const snapshot = await getDocs(expensesRef);

      const batch = writeBatch(db);

      snapshot.forEach((document) => {
        batch.delete(document.ref);
      });

      await batch.commit();
    } catch (error) {
      console.log("Clear all error:", error.message);
    }
  };

  return (
    <ExpenseContext.Provider
      value={{
        expenses,
        addExpense,
        deleteExpense,
        clearAllExpenses,
      }}
    >
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
