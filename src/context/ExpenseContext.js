import { getCategoryColor, getDate, getId } from "../helper";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { createContext, useContext, useState, useEffect } = require("react");

export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get data from storage
  // this is will run in the initial moment
  useEffect(() => {
    const getData = async () => {
      try {
        const storedExpenses = await AsyncStorage.getItem("expensesList");
        if (storedExpenses !== null) {
          setExpenses(JSON.parse(storedExpenses));
        }
      } catch (error) {
        console.error("Failed to load from storage", error);
      } finally {
        setIsLoading(false);
      }
    };
    getData();
  }, []);

  // Save data to storage
  // this will work only when the expenses list wil be changes
  useEffect(() => {
    if (!isLoading) {
      const saveExpenses = async () => {
        try {
          await AsyncStorage.setItem("expensesList", JSON.stringify(expenses));
        } catch (error) {
          console.error("Save failed", error);
        }
      };

      // call this function
      saveExpenses();
    }
  }, [expenses]);

  const addExpense = (expense) => {
    const newExpense = {
      id: getId(),
      title: expense.title,
      amount: expense.amount,
      category: expense.category.name,
      date: getDate(),
      color: getCategoryColor(expense.category.color),
      icon: expense.category.icon,
    };
    // update the list
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  // delete single expense
  const deleteExpense = (id) => {
    setExpenses((prevExpenses) =>
      prevExpenses.filter((item) => item.id !== id),
    );
  };

  // clear all expenses
  const clearAllExpenses = async () => {
    try {
      setExpenses([]); // clear state
      await AsyncStorage.removeItem("expensesList"); // clear storage
    } catch (error) {
      console.error("Clear all failed", error);
    }
  };

  return (
    // <ExpenseContext.Provider value={{ expenses, addExpense }}>
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
