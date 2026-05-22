import { Ionicons } from '@expo/vector-icons';

export const incomeCategories = ['Salary', 'Freelance', 'Other Income'];

export const expenseCategories = [
  'Food',
  'Transport',
  'Rent',
  'Shopping',
  'Subscriptions',
  'Health',
  'Education',
  'Entertainment',
  'Utilities',
  'Other Expense',
];

export const currencyOptions = ['USD', 'EUR', 'GBP', 'NGN'] as const;

export const categoryIcons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Food: 'fast-food',
  Transport: 'car',
  Shopping: 'cart',
  Subscriptions: 'book',
  Entertainment: 'bulb',
  Health: 'medkit',
  Utilities: 'flash',
};
