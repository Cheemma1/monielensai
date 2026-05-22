import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AddBudgetPayload, Budget, UpdateBudgetPayload } from '../types';

const getBudgetCollection = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not logged in');
  }

  return collection(db, 'users', user.uid, 'budgets');
};

export const addBudget = async (payload: AddBudgetPayload) => {
  const budgetRef = getBudgetCollection();

  await addDoc(budgetRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getAllBudgets = async (): Promise<Budget[]> => {
  const budgetRef = getBudgetCollection();
  const snapshot = await getDocs(query(budgetRef, orderBy('createdAt', 'desc')));

  return snapshot.docs.map((budgetDoc) => {
    const data = budgetDoc.data();

    return {
      id: budgetDoc.id,
      category: data.category,
      month: data.month,
      limit: data.limit,
      name: data.name,
      note: data.note,
      createdAt: data.createdAt?.toDate?.(),
      updatedAt: data.updatedAt?.toDate?.(),
    };
  });
};

export const getBudgetById = async (budgetId: string): Promise<Budget> => {
  const budgetRef = doc(getBudgetCollection(), budgetId);
  const snapshot = await getDoc(budgetRef);

  if (!snapshot.exists()) {
    throw new Error('Budget not found');
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    category: data.category,
    month: data.month,
    limit: data.limit,
    name: data.name,
    note: data.note,
    createdAt: data.createdAt?.toDate?.(),
    updatedAt: data.updatedAt?.toDate?.(),
  };
};

export const updateBudget = async (budgetId: string, payload: UpdateBudgetPayload) => {
  const budgetRef = doc(getBudgetCollection(), budgetId);

  await updateDoc(budgetRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};
