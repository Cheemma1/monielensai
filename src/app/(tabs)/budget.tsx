import NavBar from '@/components/NavBar';
import { categoryIcons } from '@/constants/categories';
import { useBudgets } from '@/features/budget/hooks/useBudget';
import { Budget } from '@/features/budget/types';
import { useTransactions } from '@/features/transactions/hooks/useTransaction';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from '@/features/auth/Authcontext';
import Text from '@/components/Text';

const getUsageColors = (percentage: number) => {
  if (percentage <= 30) {
    return {
      iconBg: '#DCFCE7',
      iconColor: '#166534',
      badgeBg: '#DCFCE7',
      badgeText: '#166534',
      barColor: '#16A34A',
    };
  }

  if (percentage <= 60) {
    return {
      iconBg: '#FFEDD5',
      iconColor: '#9A3412',
      badgeBg: '#FFEDD5',
      badgeText: '#9A3412',
      barColor: '#F97316',
    };
  }

  return {
    iconBg: '#FEE2E2',
    iconColor: '#991B1B',
    badgeBg: '#FEE2E2',
    badgeText: '#991B1B',
    barColor: '#DC2626',
  };
};

interface BudgetCardProps {
  budget: Budget;
  spent: number;
  onEdit: (budgetId: string) => void;
}

const BudgetCard = ({ budget, spent, onEdit }: BudgetCardProps) => {
  const percentage = Math.min(Math.round((spent / budget.limit) * 100), 100);
  const usageColors = getUsageColors(percentage);
  const icon = categoryIcons[budget.category] ?? 'wallet';
  const { formatAmount } = useCurrency();

  return (
    <Pressable
      onPress={() => onEdit(budget.id)}
      className="rounded-2xl bg-white p-4 shadow-sm">
      <View className="mb-3 flex-row items-center justify-between">
        <View className="flex-row items-center gap-1">
          <View
            className="mr-2 flex h-8 w-8 items-center justify-center rounded-full"
            style={{ backgroundColor: usageColors.iconBg }}>
            <Ionicons name={icon} size={16} color={usageColors.iconColor} />
          </View>
          <View>
            <Text className="text-lg font-semibold">{budget.name}</Text>
            <Text className="text-xs text-slate-500">
              {budget.category} - {budget.month}
            </Text>
          </View>
        </View>
        <View
          className="flex-row items-center gap-2 rounded-full px-2 py-1"
          style={{ backgroundColor: usageColors.badgeBg }}>
          <Text style={{ color: usageColors.badgeText }}>{percentage}% used</Text>
        </View>
      </View>

      <View className="h-2 overflow-hidden rounded-full bg-slate-200">
        <View
          className="h-2 rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: usageColors.barColor }}
        />
      </View>

      <View className="mt-3 flex-row items-center justify-between gap-x-4 gap-y-2">
        <Text className="text-slate-600">Spent: {formatAmount(spent)}</Text>
        <Text className="text-slate-600">Limit: {formatAmount(budget.limit)}</Text>
      </View>

      <View className="mt-3 flex-row justify-end">
        <View className="flex-row items-center gap-1 rounded-full bg-slate-100 px-3 py-1">
          <Ionicons name="create-outline" size={14} color="#475569" />
          <Text className="text-xs text-slate-600">Tap to edit</Text>
        </View>
      </View>
    </Pressable>
  );
};

const BudgetScreen = () => {
  const router = useRouter();
  const { data: budgets = [], isLoading, isError, error, refetch, isFetching } = useBudgets();
  const { data: transactions = [] } = useTransactions();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <NavBar />
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-28 pt-4"
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="mt-1 text-2xl font-bold text-black">Budgets</Text>
          <Text className="text-slate-600">Manage your financial limits with precision.</Text>
        </View>

        {isLoading ? <Text className="text-slate-500">Loading budgets...</Text> : null}

        {isError ? (
          <View className="rounded-xl border border-red-200 bg-red-50 p-3">
            <Text className="text-red-700">{error?.message ?? 'Failed to load budgets.'}</Text>
            <Pressable className="mt-2 rounded-lg bg-red-600 px-3 py-2" onPress={() => refetch()}>
              <Text className="text-center text-white">Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {!isLoading && !isError && budgets.length === 0 ? (
          <View className="rounded-2xl border border-dashed border-slate-300 bg-white p-6">
            <Text className="text-lg font-semibold text-slate-800">No budgets yet</Text>
            <Text className="mt-1 text-slate-600">
              Create your first monthly budget to start tracking limits.
            </Text>
          </View>
        ) : null}

        {!isError
          ? budgets.map((budget) => {
              const spent = transactions
                .filter(
                  (t) =>
                    t.type === 'expense' &&
                    t.category === budget.category &&
                    t.date.startsWith(budget.month)
                )
                .reduce((sum, t) => sum + t.amount, 0);

              return (
                <BudgetCard
                  key={budget.id}
                  budget={budget}
                  spent={spent}
                  onEdit={(budgetId) =>
                    router.push({ pathname: '/add-budget', params: { budgetId } })
                  }
                />
              );
            })
          : null}

        {isFetching && !isLoading ? (
          <Text className="text-center text-xs text-slate-500">Refreshing...</Text>
        ) : null}
      </ScrollView>

      <Pressable
        className="absolute bottom-6 right-6 flex-row items-center gap-2 rounded-full bg-primary px-5 py-4 shadow-lg"
        onPress={() => router.push('/add-budget')}>
        <Ionicons name="add" size={20} color="#FFFFFF" />
        <Text className="text-white">Add New Budget</Text>
      </Pressable>
    </SafeAreaView>
  );
};

export default BudgetScreen;
