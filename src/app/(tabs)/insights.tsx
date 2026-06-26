import NavBar from '@/components/NavBar';
import Text from '@/components/Text';
import { categoryIcons } from '@/constants/categories';
import { useCurrency } from '@/features/auth/Authcontext';
import { useBudgets } from '@/features/budget/hooks/useBudget';
import { useTransactions } from '@/features/transactions/hooks/useTransaction';
import { Ionicons } from '@expo/vector-icons';
import { useMemo } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type InsightTone = 'blue' | 'emerald' | 'amber' | 'rose';

type Insight = {
  title: string;
  body: string;
  icon: keyof typeof Ionicons.glyphMap;
  tone: InsightTone;
};

const toneStyles: Record<
  InsightTone,
  {
    bg: string;
    border: string;
    iconBg: string;
    icon: string;
    title: string;
    body: string;
  }
> = {
  blue: {
    bg: 'bg-blue-50',
    border: 'border-blue-100',
    iconBg: 'bg-blue-100',
    icon: '#2563EB',
    title: 'text-blue-950',
    body: 'text-blue-900',
  },
  emerald: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-100',
    iconBg: 'bg-emerald-100',
    icon: '#059669',
    title: 'text-emerald-950',
    body: 'text-emerald-900',
  },
  amber: {
    bg: 'bg-amber-50',
    border: 'border-amber-100',
    iconBg: 'bg-amber-100',
    icon: '#D97706',
    title: 'text-amber-950',
    body: 'text-amber-900',
  },
  rose: {
    bg: 'bg-rose-50',
    border: 'border-rose-100',
    iconBg: 'bg-rose-100',
    icon: '#E11D48',
    title: 'text-rose-950',
    body: 'text-rose-900',
  },
};

const getCurrentMonth = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
};

const getPreviousMonth = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - 1);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthLabel = (month: string) => {
  const [year, monthIndex] = month.split('-').map(Number);
  return new Date(year, monthIndex - 1).toLocaleString('en-US', {
    month: 'long',
    year: 'numeric',
  });
};

const getTrendCopy = (value: number) => {
  if (value > 0) {
    return `+${Math.round(value)}% vs last month`;
  }

  if (value < 0) {
    return `${Math.round(value)}% vs last month`;
  }

  return 'No change vs last month';
};

const InsightsScreen = () => {
  const { formatAmount } = useCurrency();
  const {
    data: transactions = [],
    isLoading: isLoadingTransactions,
    isError: isTransactionsError,
    error: transactionsError,
    refetch: refetchTransactions,
  } = useTransactions();
  const { data: budgets = [], isLoading: isLoadingBudgets } = useBudgets();

  const currentMonth = getCurrentMonth();
  const previousMonth = getPreviousMonth();

  const insights = useMemo(() => {
    const currentMonthTransactions = transactions.filter((transaction) =>
      transaction.date.startsWith(currentMonth)
    );
    const previousMonthTransactions = transactions.filter((transaction) =>
      transaction.date.startsWith(previousMonth)
    );

    const monthlyIncome = currentMonthTransactions
      .filter((transaction) => transaction.type === 'income')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const monthlyExpenses = currentMonthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const previousExpenses = previousMonthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce((sum, transaction) => sum + transaction.amount, 0);

    const netCashFlow = monthlyIncome - monthlyExpenses;
    const savingsRate = monthlyIncome > 0 ? Math.round((netCashFlow / monthlyIncome) * 100) : 0;
    const expenseTrend =
      previousExpenses > 0 ? ((monthlyExpenses - previousExpenses) / previousExpenses) * 100 : 0;

    const categories = currentMonthTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce<Record<string, number>>((result, transaction) => {
        result[transaction.category] = (result[transaction.category] ?? 0) + transaction.amount;
        return result;
      }, {});

    const categoryBreakdown = Object.entries(categories)
      .map(([category, amount]) => ({
        category,
        amount,
        percentage: monthlyExpenses > 0 ? Math.round((amount / monthlyExpenses) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    const topCategory = categoryBreakdown[0];

    const budgetProgress = budgets
      .filter((budget) => budget.month === currentMonth)
      .map((budget) => {
        const spent = currentMonthTransactions
          .filter(
            (transaction) =>
              transaction.type === 'expense' && transaction.category === budget.category
          )
          .reduce((sum, transaction) => sum + transaction.amount, 0);

        return {
          ...budget,
          spent,
          remaining: budget.limit - spent,
          percentage: budget.limit > 0 ? Math.round((spent / budget.limit) * 100) : 0,
        };
      })
      .sort((a, b) => b.percentage - a.percentage);

    const tightestBudget = budgetProgress[0];

    const generatedInsights: Insight[] = [];

    if (monthlyExpenses > monthlyIncome && monthlyIncome > 0) {
      generatedInsights.push({
        title: 'Cash flow needs attention',
        body: `Expenses are ${formatAmount(monthlyExpenses - monthlyIncome)} above income this month. Start with flexible spending categories before touching essentials.`,
        icon: 'warning-outline',
        tone: 'rose',
      });
    } else if (monthlyIncome > 0) {
      generatedInsights.push({
        title: 'Positive cash flow',
        body: `You are holding onto ${formatAmount(Math.max(netCashFlow, 0))} this month, a ${savingsRate}% savings rate.`,
        icon: 'trending-up-outline',
        tone: savingsRate >= 20 ? 'emerald' : 'blue',
      });
    }

    if (topCategory) {
      generatedInsights.push({
        title: `${topCategory.category} leads spending`,
        body: `${topCategory.category} makes up ${topCategory.percentage}% of this month's expenses. A small trim here will have the biggest impact.`,
        icon: categoryIcons[topCategory.category] ?? 'pie-chart-outline',
        tone: topCategory.percentage >= 45 ? 'amber' : 'blue',
      });
    }

    if (tightestBudget) {
      generatedInsights.push({
        title:
          tightestBudget.percentage >= 100
            ? `${tightestBudget.name} is over budget`
            : `${tightestBudget.name} is closest to its limit`,
        body:
          tightestBudget.percentage >= 100
            ? `You are ${formatAmount(Math.abs(tightestBudget.remaining))} over the planned limit.`
            : `${formatAmount(Math.max(tightestBudget.remaining, 0))} remains before you hit the limit.`,
        icon: tightestBudget.percentage >= 100 ? 'alert-circle-outline' : 'speedometer-outline',
        tone:
          tightestBudget.percentage >= 100
            ? 'rose'
            : tightestBudget.percentage >= 75
              ? 'amber'
              : 'emerald',
      });
    }

    if (generatedInsights.length === 0) {
      generatedInsights.push({
        title: 'Add activity to unlock insights',
        body: 'Track income, spending, and budgets to see personalized recommendations here.',
        icon: 'sparkles-outline',
        tone: 'blue',
      });
    }

    return {
      monthlyIncome,
      monthlyExpenses,
      netCashFlow,
      savingsRate,
      expenseTrend,
      categoryBreakdown,
      budgetProgress,
      generatedInsights,
    };
  }, [budgets, currentMonth, formatAmount, previousMonth, transactions]);

  const isLoading = isLoadingTransactions || isLoadingBudgets;
  const hasNoActivity = !isLoading && transactions.length === 0;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <NavBar />
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-28 pt-4"
        showsVerticalScrollIndicator={false}>
        <View>
          <Text className="mt-1 text-2xl font-bold text-slate-950">Insights</Text>
          <Text className="text-slate-600">
            {getMonthLabel(currentMonth)} financial intelligence
          </Text>
        </View>

        {isLoading ? <Text className="text-slate-500">Loading insights...</Text> : null}

        {isTransactionsError ? (
          <View className="rounded-xl border border-rose-200 bg-rose-50 p-3">
            <Text className="text-rose-700">
              {transactionsError?.message ?? 'Failed to load transactions.'}
            </Text>
            <Pressable
              className="mt-2 rounded-lg bg-rose-600 px-3 py-2"
              onPress={() => refetchTransactions()}>
              <Text className="text-center font-semibold text-white">Retry</Text>
            </Pressable>
          </View>
        ) : null}

        {!isTransactionsError ? (
          <>
            <View className="rounded-3xl bg-primary p-5">
              <View className="flex-row items-center justify-between">
                <Text className="text-white/80">Net cash flow</Text>
                <View className="rounded-full bg-white/15 px-3 py-1">
                  <Text className="text-xs font-semibold text-white">
                    {getTrendCopy(insights.expenseTrend)}
                  </Text>
                </View>
              </View>
              <Text className="mt-2 font-bold text-white" style={{ fontSize: 34, lineHeight: 40 }}>
                {formatAmount(insights.netCashFlow)}
              </Text>
              <Text className="mt-2 text-white/80">
                {insights.savingsRate}% savings rate from tracked income
              </Text>
            </View>

            <View className="flex-row gap-3">
              <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="arrow-down" size={16} color="#059669" />
                  <Text className="text-slate-500">Income</Text>
                </View>
                <Text className="mt-2 text-lg font-bold text-emerald-600">
                  {formatAmount(insights.monthlyIncome)}
                </Text>
              </View>

              <View className="flex-1 rounded-2xl bg-white p-4 shadow-sm">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="arrow-up" size={16} color="#E11D48" />
                  <Text className="text-slate-500">Expenses</Text>
                </View>
                <Text className="mt-2 text-lg font-bold text-rose-600">
                  {formatAmount(insights.monthlyExpenses)}
                </Text>
              </View>
            </View>

            <View className="gap-3">
              {insights.generatedInsights.map((item) => {
                const tone = toneStyles[item.tone];
                return (
                  <View
                    key={item.title}
                    className={`rounded-2xl border p-4 ${tone.bg} ${tone.border}`}>
                    <View className="flex-row gap-3">
                      <View
                        className={`h-10 w-10 items-center justify-center rounded-full ${tone.iconBg}`}>
                        <Ionicons name={item.icon} size={20} color={tone.icon} />
                      </View>
                      <View className="flex-1">
                        <Text className={`font-bold ${tone.title}`} style={{ fontSize: 16 }}>
                          {item.title}
                        </Text>
                        <Text className={`mt-1 ${tone.body}`}>{item.body}</Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>

            <View className="rounded-2xl bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-slate-950">Category breakdown</Text>
                <Ionicons name="pie-chart-outline" size={20} color="#64748B" />
              </View>

              {hasNoActivity || insights.categoryBreakdown.length === 0 ? (
                <View className="items-center rounded-xl border border-dashed border-slate-200 p-6">
                  <Ionicons name="bar-chart-outline" size={30} color="#94A3B8" />
                  <Text className="mt-2 text-center font-medium text-slate-500">
                    Spending categories will appear after you add expenses.
                  </Text>
                </View>
              ) : (
                <View className="gap-4">
                  {insights.categoryBreakdown.slice(0, 5).map((item) => (
                    <View key={item.category}>
                      <View className="mb-2 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <View className="h-8 w-8 items-center justify-center rounded-full bg-slate-100">
                            <Ionicons
                              name={categoryIcons[item.category] ?? 'wallet-outline'}
                              size={15}
                              color="#334155"
                            />
                          </View>
                          <Text className="font-semibold text-slate-800">{item.category}</Text>
                        </View>
                        <Text className="font-bold text-slate-900">
                          {formatAmount(item.amount)}
                        </Text>
                      </View>
                      <View className="h-2 overflow-hidden rounded-full bg-slate-100">
                        <View
                          className="h-2 rounded-full bg-primary"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </View>
                      <Text className="mt-1 text-xs text-slate-500">
                        {item.percentage}% of spend
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </View>

            <View className="rounded-2xl bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <Text className="text-lg font-bold text-slate-950">Budget pressure</Text>
                <Ionicons name="speedometer-outline" size={20} color="#64748B" />
              </View>

              {insights.budgetProgress.length === 0 ? (
                <View className="items-center rounded-xl border border-dashed border-slate-200 p-6">
                  <Ionicons name="wallet-outline" size={30} color="#94A3B8" />
                  <Text className="mt-2 text-center font-medium text-slate-500">
                    Create monthly budgets to compare planned limits with actual spending.
                  </Text>
                </View>
              ) : (
                <View className="gap-4">
                  {insights.budgetProgress.slice(0, 4).map((budget) => {
                    const progress = Math.min(budget.percentage, 100);
                    const color =
                      budget.percentage >= 100
                        ? '#E11D48'
                        : budget.percentage >= 75
                          ? '#D97706'
                          : '#059669';

                    return (
                      <View key={budget.id}>
                        <View className="mb-2 flex-row items-center justify-between">
                          <View className="flex-1">
                            <Text className="font-semibold text-slate-800">{budget.name}</Text>
                            <Text className="text-xs text-slate-500">{budget.category}</Text>
                          </View>
                          <Text className="font-bold text-slate-900">{budget.percentage}%</Text>
                        </View>
                        <View className="h-2 overflow-hidden rounded-full bg-slate-100">
                          <View
                            className="h-2 rounded-full"
                            style={{ width: `${progress}%`, backgroundColor: color }}
                          />
                        </View>
                        <Text className="mt-1 text-xs text-slate-500">
                          {formatAmount(budget.spent)} spent of {formatAmount(budget.limit)}
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
};

export default InsightsScreen;
