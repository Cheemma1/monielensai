import NavBar from '@/components/NavBar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const categoryOptions = [
  'Food',
  'Transport',
  'Shopping',
  'Subscriptions',
  'Entertainment',
  'Health',
  'Utilities',
] as const;

const AddBudget = () => {
  const router = useRouter();
  const [budgetName, setBudgetName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categoryOptions)[number]>('Food');
  const [note, setNote] = useState('');

  const isFormValid = useMemo(() => {
    const limit = Number(monthlyLimit);
    return budgetName.trim().length > 0 && !Number.isNaN(limit) && limit > 0;
  }, [budgetName, monthlyLimit]);

  const handleCreateBudget = () => {
    // Placeholder save flow until API/store wiring is added.
    router.back();
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <NavBar />

      <ScrollView contentContainerClassName="px-4 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-5">
          <Text className="text-2xl font-bold text-black">Add Budget</Text>
          <Text className="text-slate-600">
            Create a monthly spending target to keep your finances in check.
          </Text>
        </View>

        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-slate-800">Budget name</Text>
          <TextInput
            value={budgetName}
            onChangeText={setBudgetName}
            placeholder="e.g. Groceries"
            className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-slate-800">Monthly limit ($)</Text>
          <TextInput
            value={monthlyLimit}
            onChangeText={setMonthlyLimit}
            keyboardType="decimal-pad"
            placeholder="0.00"
            className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-3 font-semibold text-slate-800">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {categoryOptions.map((category) => {
              const isSelected = selectedCategory === category;

              return (
                <Pressable
                  key={category}
                  onPress={() => setSelectedCategory(category)}
                  className={`rounded-full border px-4 py-2 ${
                    isSelected ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white'
                  }`}>
                  <Text className={isSelected ? 'text-primary' : 'text-slate-700'}>{category}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mb-6 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-slate-800">Note (optional)</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add a short note..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-slate-900"
            placeholderTextColor="#94A3B8"
          />
        </View>

        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 items-center rounded-xl border border-slate-300 py-4">
            <Text className="font-semibold text-slate-700">Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleCreateBudget}
            disabled={!isFormValid}
            className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-4 ${
              isFormValid ? 'bg-primary' : 'bg-slate-300'
            }`}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text className="font-semibold text-white">Create Budget</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddBudget;
