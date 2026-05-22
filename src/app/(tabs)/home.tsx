import NavBar from '@/components/NavBar';
import { useTransactions } from '@/features/transactions/hooks/useTransaction';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from '@/features/auth/Authcontext';

const getLast7Days = () => {
  const list = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    list.push(`${d.getFullYear()}-${month}-${day}`);
  }
  return list;
};

const getWeekdayLabel = (dateStr: string) => {
  const days = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
  const date = new Date(dateStr + 'T00:00:00');
  return days[date.getDay()];
};

const Home = () => {
  const router = useRouter();
  const [showAll, setShowAll] = useState(false);
  const { symbol, formatAmount } = useCurrency();

  // Fetch transactions from React Query
  const { data: transactions = [], isLoading, isError, error, refetch } = useTransactions();

  // Financial Calculations
  const { totalBalance, monthlyIncome, monthlyExpenses } = useMemo(() => {
    let balance = 0;
    let income = 0;
    let expenses = 0;

    const currentMonthStr = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;

    transactions.forEach((t) => {
      const isCurrentMonth = t.date.startsWith(currentMonthStr);
      if (t.type === 'income') {
        balance += t.amount;
        if (isCurrentMonth) {
          income += t.amount;
        }
      } else {
        balance -= t.amount;
        if (isCurrentMonth) {
          expenses += t.amount;
        }
      }
    });

    return {
      totalBalance: balance,
      monthlyIncome: income,
      monthlyExpenses: expenses,
    };
  }, [transactions]);

  // Spending Trends chart data calculations
  const { chartData, maxExpense } = useMemo(() => {
    const last7DaysDates = getLast7Days();
    const data = last7DaysDates.map((dateStr) => {
      const dayExpense = transactions
        .filter((t) => t.type === 'expense' && t.date === dateStr)
        .reduce((sum, t) => sum + t.amount, 0);
      return {
        date: dateStr,
        label: getWeekdayLabel(dateStr),
        amount: dayExpense,
      };
    });

    const max = Math.max(...data.map((d) => d.amount), 0);
    return { chartData: data, maxExpense: max };
  }, [transactions]);

  const displayedTransactions = useMemo(() => {
    return showAll ? transactions : transactions.slice(0, 5);
  }, [transactions, showAll]);

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="flex-1">
        <NavBar />

        <ScrollView contentContainerClassName="gap-4 px-4 pb-28 pt-4" showsVerticalScrollIndicator={false}>
          {/* Total Balance Card */}
          <View className="rounded-3xl bg-primary p-5">
            <Text className="text-white/80">Total balance</Text>
            <Text className="mt-2 text-white font-bold" style={{ fontSize: 36, lineHeight: 40 }}>
              {formatAmount(totalBalance)}
            </Text>
            <Text className="mt-2 text-white/80">Dynamic cash flow balance</Text>
          </View>

          {/* Income & Expense Metrics */}
          <View className="flex-row flex-wrap gap-3">
            <View className="w-[48%] flex-1 rounded-2xl bg-white p-4 shadow-sm">
              <View className="flex-row items-center gap-1">
                <Ionicons name="arrow-down" size={16} color="#16A34A" className="mb-1" />
                <Text className="text-slate-500">Monthly income</Text>
              </View>
              <Text className="mt-2 text-emerald-600 font-bold" style={{ fontSize: 22, lineHeight: 28 }}>
                {formatAmount(monthlyIncome)}
              </Text>
            </View>

            <View className="w-[48%] flex-1 rounded-2xl bg-white p-4 shadow-sm">
              <View className="flex-row items-center gap-1">
                <Ionicons name="arrow-up" size={16} color="#DC2626" className="mb-1" />
                <Text className="text-slate-500">Monthly expenses</Text>
              </View>
              <Text className="mt-2 text-rose-600 font-bold" style={{ fontSize: 22, lineHeight: 28 }}>
                {formatAmount(monthlyExpenses)}
              </Text>
            </View>
          </View>

          {/* Dynamic AI Insight Banner */}
          {monthlyExpenses > 0 && (
            <View className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
              <View className="mb-2 flex-row items-center gap-2">
                <Ionicons name="sparkles" size={18} color="#2563EB" />
                <Text className="text-blue-800 font-bold" style={{ fontSize: 16 }}>
                  AI Insight
                </Text>
              </View>
              <Text className="text-blue-900">
                {monthlyExpenses > monthlyIncome && monthlyIncome > 0
                  ? "Alert: Your monthly expenses currently exceed your income. Consider scaling back non-essential purchases."
                  : `You have spent ${formatAmount(monthlyExpenses)} this month. Keep tracking to optimize your savings rate!`}
              </Text>
            </View>
          )}

          {/* Dynamic Spending Trends Chart */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Spending Trends</Text>
              <Text className="text-slate-500">Last 7 days</Text>
            </View>

            <View className="mt-4 flex-row items-end justify-between rounded-xl bg-slate-50 px-3 py-4">
              {chartData.map((d, index) => {
                // Normalize chart height between 12 and 80 pixels
                const height = maxExpense > 0 ? (d.amount / maxExpense) * 68 + 12 : 12;

                return (
                  <View key={`${d.date}-${index}`} className="items-center gap-1 flex-1">
                    <Text className="text-[9px] text-slate-400 font-semibold">{formatAmount(d.amount, { showDecimal: false })}</Text>
                    <View className="w-6 rounded-md bg-primary/80" style={{ height }} />
                    <Text className="text-[10px] text-slate-500 font-bold mt-1">{d.label}</Text>
                  </View>
                );
              })}
            </View>
          </View>

          {/* Recent Transactions List */}
          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Recent transactions</Text>
              {transactions.length > 5 && (
                <Pressable onPress={() => setShowAll(!showAll)}>
                  <Text className="text-primary font-semibold">{showAll ? 'Show less' : 'See all'}</Text>
                </Pressable>
              )}
            </View>

            {isLoading && <Text className="text-slate-500 py-4">Loading transactions...</Text>}

            {isError && (
              <View className="py-4">
                <Text className="text-rose-600 mb-2">{error?.message ?? 'Failed to load transactions.'}</Text>
                <Pressable onPress={() => refetch()} className="rounded-xl bg-rose-50 border border-rose-200 py-2">
                  <Text className="text-rose-700 text-center font-semibold">Retry</Text>
                </Pressable>
              </View>
            )}

            {!isLoading && !isError && transactions.length === 0 && (
              <View className="rounded-xl border border-dashed border-slate-200 p-6 items-center">
                <Ionicons name="receipt-outline" size={32} color="#94A3B8" />
                <Text className="text-slate-500 mt-2 font-medium">No transactions recorded yet</Text>
                <Text className="text-slate-400 text-xs text-center mt-1">
                  Add your first income or expense to see it here!
                </Text>
              </View>
            )}

            {!isLoading &&
              !isError &&
              displayedTransactions.map((transaction, index) => {
                const isIncomeType = transaction.type === 'income';
                const formattedAmt = isIncomeType
                  ? `+${formatAmount(transaction.amount)}`
                  : `-${formatAmount(transaction.amount)}`;

                return (
                  <Pressable
                    key={transaction.id}
                    onPress={() =>
                      router.push({
                        pathname: '/add-transaction',
                        params: { transactionId: transaction.id },
                      })
                    }
                    className={`flex-row items-center justify-between py-3.5 ${
                      index !== displayedTransactions.length - 1 ? 'border-b border-slate-100' : ''
                    }`}>
                    <View className="flex-1">
                      <Text className="text-slate-900 font-semibold" style={{ fontSize: 15 }}>
                        {transaction.merchant}
                      </Text>
                      <Text className="text-slate-500 text-xs mt-0.5">
                        {transaction.category} • {transaction.date}
                      </Text>
                    </View>
                    <Text
                      className={`font-bold ${isIncomeType ? 'text-emerald-600' : 'text-slate-800'}`}
                      style={{ fontSize: 15 }}>
                      {formattedAmt}
                    </Text>
                  </Pressable>
                );
              })}
          </View>
        </ScrollView>

        {/* Floating Action Button */}
        <Pressable
          className="absolute bottom-6 right-6 flex-row items-center gap-2 rounded-full bg-primary px-5 py-4 shadow-lg"
          onPress={() => router.push('/add-transaction')}>
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text className="text-white font-semibold">Add Transaction</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Home;
