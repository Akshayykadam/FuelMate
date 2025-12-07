import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Expense, ExpenseType } from '@/types';
import { generateId } from '@/utils/helpers';

interface ExpenseState {
  expenses: Expense[];
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateExpense: (id: string, updates: Partial<Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>>) => void;
  deleteExpense: (id: string) => void;
  getExpensesByVehicleId: (vehicleId: string) => Expense[];
  getExpenseById: (id: string) => Expense | undefined;
  getExpensesByType: (type: ExpenseType) => Expense[];
  getTotalExpensesByVehicleId: (vehicleId: string) => number;
  getTotalExpensesByType: (type: ExpenseType) => number;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set, get) => ({
      expenses: [],
      
      addExpense: (expenseData) => {
        const id = generateId();
        const timestamp = Date.now();
        
        const newExpense: Expense = {
          id,
          ...expenseData,
          createdAt: timestamp,
          updatedAt: timestamp,
        };
        
        set((state) => ({
          expenses: [...state.expenses, newExpense],
        }));
        
        return id;
      },
      
      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((expense) => 
            expense.id === id
              ? { ...expense, ...updates, updatedAt: Date.now() }
              : expense
          ),
        }));
      },
      
      deleteExpense: (id) => {
        set((state) => ({
          expenses: state.expenses.filter((expense) => expense.id !== id),
        }));
      },
      
      getExpensesByVehicleId: (vehicleId) => {
        return get().expenses.filter((expense) => expense.vehicleId === vehicleId);
      },
      
      getExpenseById: (id) => {
        return get().expenses.find((expense) => expense.id === id);
      },
      
      getExpensesByType: (type) => {
        return get().expenses.filter((expense) => expense.type === type);
      },
      
      getTotalExpensesByVehicleId: (vehicleId) => {
        return get().expenses
          .filter((expense) => expense.vehicleId === vehicleId)
          .reduce((total, expense) => total + expense.amount, 0);
      },
      
      getTotalExpensesByType: (type) => {
        return get().expenses
          .filter((expense) => expense.type === type)
          .reduce((total, expense) => total + expense.amount, 0);
      },
    }),
    {
      name: 'fuelmate-expenses',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);