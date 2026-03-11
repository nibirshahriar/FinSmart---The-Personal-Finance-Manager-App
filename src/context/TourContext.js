import React, { createContext, useContext, useState } from "react";

const TourContext = createContext();

export const useTour = () => useContext(TourContext);

export const TourProvider = ({ children }) => {
  const [tours, setTours] = useState([]);

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

  const deleteTour = (tourId) => {
    setTours((prev) => prev.filter((tour) => tour.id !== tourId));
  };

  const addMember = (tourId, memberName) => {
    if (!memberName) return;

    setTours((prev) =>
      prev.map((tour) => {
        if (tour.id !== tourId) return tour;

        const updatedMembers = [
          ...tour.members,
          {
            id: Date.now().toString(),
            name: memberName,
            paid: 0,
          },
        ];

        return {
          ...tour,
          members: updatedMembers,
        };
      }),
    );
  };

  const addTourExpense = (tourId, expense) => {
    if (!expense || !expense.amount) return;

    setTours((prev) =>
      prev.map((tour) => {
        if (tour.id !== tourId) return tour;

        const updatedExpenses = [...tour.expenses, expense];

        const totalExpense = updatedExpenses.reduce(
          (sum, item) => sum + item.amount,
          0,
        );

        const memberCount = tour.members.length || tour.participants || 1;

        const perPerson =
          memberCount > 0 ? Math.ceil(totalExpense / memberCount) : 0;

        return {
          ...tour,
          expenses: updatedExpenses,
          totalExpense,
          perPerson,
        };
      }),
    );
  };

  const updateMemberPaid = (tourId, memberId, amount) => {
    if (!amount) return;

    setTours((prev) =>
      prev.map((tour) =>
        tour.id === tourId
          ? {
              ...tour,
              members: tour.members.map((m) =>
                m.id === memberId ? { ...m, paid: m.paid + amount } : m,
              ),
            }
          : tour,
      ),
    );
  };

  const calculateSettlement = (tourId) => {
    const tour = tours.find((t) => t.id === tourId);
    if (!tour) return [];

    const perPerson = tour.perPerson;
    const settlements = [];

    const debtors = [];
    const creditors = [];

    tour.members.forEach((member) => {
      const balance = member.paid - perPerson;

      if (balance > 0) {
        creditors.push({ ...member, balance });
      } else if (balance < 0) {
        debtors.push({ ...member, balance });
      }
    });

    debtors.forEach((debtor) => {
      let debt = Math.abs(debtor.balance);

      creditors.forEach((creditor) => {
        if (debt === 0) return;

        const credit = creditor.balance;

        const payAmount = Math.min(debt, credit);

        if (payAmount > 0) {
          settlements.push({
            from: debtor.name,
            to: creditor.name,
            amount: payAmount,
          });

          creditor.balance -= payAmount;
          debt -= payAmount;
        }
      });
    });

    return settlements;
  };
  const markTourSettled = (tourId) => {
    setTours((prev) =>
      prev.map((tour) =>
        tour.id === tourId ? { ...tour, status: "Settled" } : tour,
      ),
    );
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
      }}
    >
      {children}
    </TourContext.Provider>
  );
};
