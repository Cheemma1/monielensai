import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addBudget, getAllBudgets, getBudgetById, updateBudget } from '../services/budget.services';
import { AddBudgetPayload, UpdateBudgetPayload } from '../types';

const budgetKeys = {
  all: ['budgets'] as const,
  detail: (id: string) => ['budgets', id] as const,
};

export const useBudgets = () =>
  useQuery({
    queryKey: budgetKeys.all,
    queryFn: getAllBudgets,
  });

export const useBudget = (budgetId?: string) =>
  useQuery({
    queryKey: budgetKeys.detail(budgetId ?? ''),
    queryFn: () => getBudgetById(budgetId as string),
    enabled: Boolean(budgetId),
  });

export const useAddBudget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (payload: AddBudgetPayload) => addBudget(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
    },
  });

  return {
    addBudget: mutation.mutate,
    addBudgetAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ budgetId, payload }: { budgetId: string; payload: UpdateBudgetPayload }) =>
      updateBudget(budgetId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: budgetKeys.all });
      queryClient.invalidateQueries({ queryKey: budgetKeys.detail(variables.budgetId) });
    },
  });

  return {
    updateBudget: mutation.mutate,
    updateBudgetAsync: mutation.mutateAsync,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error?.message ?? null,
    reset: mutation.reset,
  };
};
