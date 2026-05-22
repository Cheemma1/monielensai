import NavBar from '@/components/NavBar';
import { useAddBudget, useBudget, useUpdateBudget } from '@/features/budget/hooks/useBudget';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from '@/features/auth/Authcontext';

const categoryOptions = [
  'Food',
  'Transport',
  'Shopping',
  'Subscriptions',
  'Entertainment',
  'Health',
  'Utilities',
] as const;

const getDefaultMonth = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${now.getFullYear()}-${month}`;
};

const AddBudget = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ budgetId?: string }>();
  const budgetId = typeof params.budgetId === 'string' ? params.budgetId : undefined;
  const isEditing = Boolean(budgetId);
  const { symbol } = useCurrency();

  const [budgetName, setBudgetName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [selectedCategory, setSelectedCategory] =
    useState<(typeof categoryOptions)[number]>('Food');
  const [note, setNote] = useState('');
  const [month, setMonth] = useState(getDefaultMonth());

  const { data: budget, isLoading: isLoadingBudget } = useBudget(budgetId);
  const { addBudgetAsync, isLoading: isAdding, error: addError } = useAddBudget();
  const { updateBudgetAsync, isLoading: isUpdating, error: updateError } = useUpdateBudget();

  useEffect(() => {
    if (!budget) return;

    setBudgetName(budget.name);
    setMonthlyLimit(String(budget.limit));
    setSelectedCategory((budget.category as (typeof categoryOptions)[number]) ?? 'Food');
    setNote(budget.note ?? '');
    setMonth(budget.month);
  }, [budget]);

  const isSaving = isAdding || isUpdating;

  const isFormValid = useMemo(() => {
    const limit = Number(monthlyLimit);
    const monthRegex = /^\d{4}-(0[1-9]|1[0-2])$/;

    return (
      budgetName.trim().length > 0 &&
      !Number.isNaN(limit) &&
      limit > 0 &&
      monthRegex.test(month.trim())
    );
  }, [budgetName, monthlyLimit, month]);

  const handleCreateOrUpdateBudget = async () => {
    if (!isFormValid) return;

    const payload = {
      name: budgetName.trim(),
      limit: Number(monthlyLimit),
      category: selectedCategory,
      note: note.trim(),
      month: month.trim(),
    };

    try {
      if (isEditing && budgetId) {
        await updateBudgetAsync({ budgetId, payload });
        Alert.alert('Budget updated', 'Your budget changes were saved.');
      } else {
        await addBudgetAsync(payload);
        Alert.alert('Budget created', 'Your new budget was added successfully.');
      }

      router.back();
    } catch (error) {
      console.error('Failed to save budget', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <NavBar />

      <ScrollView contentContainerClassName="px-4 pb-8 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-5">
          <Text className="text-2xl font-bold text-black">
            {isEditing ? 'Edit Budget' : 'Add Budget'}
          </Text>
          <Text className="text-slate-600">
            {isEditing
              ? 'Update your monthly spending target.'
              : 'Create a monthly spending target to keep your finances in check.'}
          </Text>
        </View>

        {isLoadingBudget ? <Text className="mb-4 text-slate-500">Loading budget...</Text> : null}
        {addError ? <Text className="mb-4 text-red-600">{addError}</Text> : null}
        {updateError ? <Text className="mb-4 text-red-600">{updateError}</Text> : null}

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
          <Text className="mb-2 font-semibold text-slate-800">Monthly limit ({symbol})</Text>
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
          <Text className="mb-2 font-semibold text-slate-800">Month (YYYY-MM)</Text>
          <TextInput
            value={month}
            onChangeText={setMonth}
            placeholder="2026-05"
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
            onPress={handleCreateOrUpdateBudget}
            disabled={!isFormValid || isSaving || isLoadingBudget}
            className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-4 ${
              isFormValid && !isSaving && !isLoadingBudget ? 'bg-primary' : 'bg-slate-300'
            }`}>
            <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
            <Text className="font-semibold text-white">
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : 'Create Budget'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddBudget;
