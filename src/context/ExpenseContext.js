import { getCategoryColor, getDate, getId } from "../helper";
const { createContext, useContext, useState } = require("react");

export const ExpenseContext = createContext();

export function ExpenseProvider({ children }) {
  const [expenses, setExpenses] = useState([]);

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
//update the list
    setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
  };

  return (
    <ExpenseContext.Provider value={{ expenses, addExpense }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpenseContext);
