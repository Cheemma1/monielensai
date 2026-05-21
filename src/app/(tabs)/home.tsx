import NavBar from '@/components/NavBar';

import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type MetricCard = {
  label: string;
  amount: string;
  tone: 'income' | 'expense' | 'neutral';
  icon: 'arrow-up' | 'arrow-down';
};

type Transaction = {
  id: string;
  title: string;
  category: string;
  amount: string;
  time: string;
};

const metricCards: MetricCard[] = [
  { label: 'Monthly income', amount: '$4,800', tone: 'income', icon: 'arrow-down' },
  { label: 'Monthly expenses', amount: '$3,120', tone: 'expense', icon: 'arrow-up' },
];

const transactions: Transaction[] = [
  { id: '1', title: 'Whole Foods', category: 'Food', amount: '-$62.40', time: 'Today, 2:15 PM' },
  { id: '2', title: 'Uber', category: 'Transport', amount: '-$18.75', time: 'Today, 9:05 AM' },
  { id: '3', title: 'Spotify', category: 'Subscriptions', amount: '-$9.99', time: 'Yesterday' },
  { id: '4', title: 'Salary', category: 'Income', amount: '+$2,400.00', time: 'May 15' },
];

const chartHeights = [44, 62, 51, 70, 58, 76, 63];

const Home = () => {
  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <View className="flex-1">
        <NavBar />

        <ScrollView
          contentContainerClassName="gap-4 px-4 pb-28 pt-4"
          showsVerticalScrollIndicator={false}>
          <View className="rounded-3xl bg-primary p-5">
            <Text className="text-white/80">Total balance</Text>
            <Text
              className="mt-2 text-white"
              style={{ fontSize: 36, lineHeight: 40, fontWeight: '700' }}>
              $12,450.22
            </Text>
            <Text className="mt-2 text-white/80">+8.2% from last month</Text>
          </View>

          <View className="flex-row flex-wrap gap-3">
            {metricCards.map((card) => {
              const amountColor =
                card.tone === 'income'
                  ? 'text-emerald-600'
                  : card.tone === 'expense'
                    ? 'text-rose-600'
                    : 'text-slate-800';

              return (
                <View
                  key={card.label}
                  className="w-[48%] flex-1 rounded-2xl bg-white p-4 shadow-sm">
                  <View className="flex-row items-center gap-1">
                    <Ionicons
                      name={card.icon}
                      size={16}
                      color={amountColor === 'text-emerald-600' ? '#16A34A' : '#DC2626'}
                      className="mb-1"
                    />
                    <Text className="text-slate-500">{card.label}</Text>
                  </View>
                  <Text
                    className={`mt-2 ${amountColor}`}
                    style={{ fontSize: 22, lineHeight: 28, fontWeight: '700' }}>
                    {card.amount}
                  </Text>
                </View>
              );
            })}
          </View>

          <View className="rounded-2xl border border-blue-200 bg-blue-50 p-4">
            <View className="mb-2 flex-row items-center gap-2">
              <Ionicons name="sparkles" size={18} color="#2563EB" />
              <Text className="text-blue-800" style={{ fontSize: 16, fontWeight: '700' }}>
                AI Insight
              </Text>
            </View>
            <Text className="text-blue-900">
              You've used 72% of your food budget with 12 days left.
            </Text>
          </View>

          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Spending Trends</Text>
              <Text className="text-slate-500">Last 7 days</Text>
            </View>
            <View className="mt-4 flex-row items-end justify-between rounded-xl bg-slate-100 px-3 py-4">
              {chartHeights.map((height, index) => (
                <View key={`${height}-${index}`} className="items-center">
                  <View className="w-7 rounded-md bg-primary/80" style={{ height }} />
                </View>
              ))}
            </View>
          </View>

          <View className="rounded-2xl bg-white p-4 shadow-sm">
            <View className="mb-2 flex-row items-center justify-between">
              <Text className="text-lg font-bold">Recent transactions</Text>
              <Text className="text-primary">See all</Text>
            </View>

            {transactions.map((transaction, index) => (
              <View
                key={transaction.id}
                className={`flex-row items-center justify-between py-3 ${index !== transactions.length - 1 ? 'border-b border-slate-100' : ''}`}>
                <View className="flex-1">
                  <Text style={{ fontSize: 15, fontWeight: '600' }}>{transaction.title}</Text>
                  <Text className="text-slate-500">
                    {transaction.category} • {transaction.time}
                  </Text>
                </View>
                <Text
                  className={
                    transaction.amount.startsWith('+') ? 'text-emerald-600' : 'text-slate-800'
                  }
                  style={{ fontSize: 15, fontWeight: '700' }}>
                  {transaction.amount}
                </Text>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* <Pressable className="absolute bottom-6 right-6 flex-row items-center gap-2 rounded-full bg-primary px-5 py-4 shadow-lg">
          <Ionicons name="add" size={20} color="#FFFFFF" />
          <Text className="text-white">Add expense</Text>
        </Pressable> */}
      </View>
    </SafeAreaView>
  );
};

export default Home;
