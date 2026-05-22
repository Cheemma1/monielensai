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
  deleteDoc,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { AddTransactionPayload, Transaction, UpdateTransactionPayload } from '../types';

const getTransactionCollection = () => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('User is not logged in');
  }

  return collection(db, 'users', user.uid, 'transactions');
};

export const addTransaction = async (payload: AddTransactionPayload) => {
  const transactionRef = getTransactionCollection();

  await addDoc(transactionRef, {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const transactionRef = getTransactionCollection();
  const snapshot = await getDocs(query(transactionRef, orderBy('date', 'desc')));

  return snapshot.docs.map((transactionDoc) => {
    const data = transactionDoc.data();

    return {
      id: transactionDoc.id,
      type: data.type,
      amount: data.amount,
      category: data.category,
      date: data.date,
      merchant: data.merchant,
      notes: data.notes,
      createdAt: data.createdAt?.toDate?.(),
      updatedAt: data.updatedAt?.toDate?.(),
    };
  });
};

export const getTransactionById = async (transactionId: string): Promise<Transaction> => {
  const transactionRef = doc(getTransactionCollection(), transactionId);
  const snapshot = await getDoc(transactionRef);

  if (!snapshot.exists()) {
    throw new Error('Transaction not found');
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    type: data.type,
    amount: data.amount,
    category: data.category,
    date: data.date,
    merchant: data.merchant,
    notes: data.notes,
    createdAt: data.createdAt?.toDate?.(),
    updatedAt: data.updatedAt?.toDate?.(),
  };
};

export const updateTransaction = async (transactionId: string, payload: UpdateTransactionPayload) => {
  const transactionRef = doc(getTransactionCollection(), transactionId);

  await updateDoc(transactionRef, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
};

export const deleteTransaction = async (transactionId: string) => {
  const transactionRef = doc(getTransactionCollection(), transactionId);
  await deleteDoc(transactionRef);
};
