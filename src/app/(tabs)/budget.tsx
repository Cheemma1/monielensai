import NavBar from '@/components/NavBar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type BudgetCategory = {
  name: string;
  spent: number;
  limit: number;
  icon?: keyof typeof Ionicons.glyphMap;
};

const budgetCategories: BudgetCategory[] = [
  { name: 'Food', spent: 100, limit: 650, icon: 'fast-food' },
  { name: 'Transport', spent: 220, limit: 300, icon: 'car' },
  { name: 'Shopping', spent: 75, limit: 500, icon: 'cart' },
  { name: 'Subscriptions', spent: 68, limit: 120, icon: 'book' },
  { name: 'Entertainment', spent: 190, limit: 280, icon: 'bulb' },
  { name: 'Health', spent: 10, limit: 200, icon: 'medkit' },
];

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

const Budget = () => {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <NavBar />
      <ScrollView
        contentContainerClassName="gap-4 px-4 pb-28 pt-4"
        showsVerticalScrollIndicator={false}>
        <View className="">
          <Text className="mt-1 text-2xl font-bold text-black">Budgets</Text>
          <Text className=" text-slate-600">Manage your financial limits with precision.</Text>
        </View>

        {budgetCategories.map((category) => {
          const percentage = Math.min(Math.round((category.spent / category.limit) * 100), 100);
          const usageColors = getUsageColors(percentage);

          return (
            <View key={category.name} className="rounded-2xl bg-white p-4 shadow-sm">
              <View className="mb-3 flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  {category.icon && (
                    <View
                      className="mr-2 flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: usageColors.iconBg }}>
                      <Ionicons name={category.icon} size={16} color={usageColors.iconColor} />
                    </View>
                  )}
                  <Text className="text-lg font-semibold">{category.name}</Text>
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
                <Text className="text-slate-600">Spent: ${category.spent.toFixed(2)}</Text>
                <Text className="text-slate-600">Limit: ${category.limit.toFixed(2)}</Text>
              </View>
            </View>
          );
        })}
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

export default Budget;
