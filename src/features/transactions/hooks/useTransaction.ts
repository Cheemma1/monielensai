import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  addTransaction,
  getAllTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../services/transaction.services';
import { AddTransactionPayload, UpdateTransactionPayload } from '../types';

const transactionKeys = {
  all: ['transactions'] as const,
  detail: (id: string) => ['transactions', id] as const,
};

export const useTransactions = () =>
  useQuery({
    queryKey: transactionKeys.all,
    queryFn: getAllTransactions,
  });

export const useTransaction = (transactionId?: string) =>
  useQuery({
    queryKey: transactionKeys.detail(transactionId ?? ''),
    queryFn: () => getTransactionById(transactionId as string),
    enabled: Boolean(transactionId),
  });

export const useAddTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: AddTransactionPayload) => addTransaction(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return {
    addTransaction: mutation.mutate,
    addTransactionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
};

export const useUpdateTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({
      transactionId,
      payload,
    }: {
      transactionId: string;
      payload: UpdateTransactionPayload;
    }) => updateTransaction(transactionId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: transactionKeys.detail(variables.transactionId) });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return {
    updateTransaction: mutation.mutate,
    updateTransactionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
};

export const useDeleteTransaction = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (transactionId: string) => deleteTransaction(transactionId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: transactionKeys.all });
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
    },
  });

  return {
    deleteTransaction: mutation.mutate,
    deleteTransactionAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
  };
};
