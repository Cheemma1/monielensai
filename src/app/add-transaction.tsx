import NavBar from '@/components/NavBar';
import { incomeCategories, expenseCategories } from '@/constants/categories';
import {
  useAddTransaction,
  useTransaction,
  useUpdateTransaction,
  useDeleteTransaction,
} from '@/features/transactions/hooks/useTransaction';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCurrency } from '@/features/auth/Authcontext';
import Text from '@/components/Text';

const getDefaultDate = () => {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${now.getFullYear()}-${month}-${day}`;
};

const getDaysInMonth = (year: number, month: number) => {
  return new Date(year, month + 1, 0).getDate();
};

const getFirstDayOfMonth = (year: number, month: number) => {
  return new Date(year, month, 1).getDay();
};

const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const AddTransaction = () => {
  const router = useRouter();
  const params = useLocalSearchParams<{ transactionId?: string }>();
  const transactionId = typeof params.transactionId === 'string' ? params.transactionId : undefined;
  const isEditing = Boolean(transactionId);
  const { symbol } = useCurrency();

  // Form State
  const [transactionType, setTransactionType] = useState<'expense' | 'income'>('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [date, setDate] = useState(getDefaultDate());
  const [merchant, setMerchant] = useState('');
  const [notes, setNotes] = useState('');

  // Calendar State
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());

  // React Query Hooks
  const { data: transaction, isLoading: isLoadingTransaction } = useTransaction(transactionId);
  const { addTransactionAsync, isLoading: isAdding, error: addError } = useAddTransaction();
  const { updateTransactionAsync, isLoading: isUpdating, error: updateError } = useUpdateTransaction();
  const { deleteTransactionAsync, isLoading: isDeleting } = useDeleteTransaction();

  // Populate data when editing
  useEffect(() => {
    if (!transaction) return;

    setTransactionType(transaction.type);
    setAmount(String(transaction.amount));
    setCategory(transaction.category);
    setDate(transaction.date);
    setMerchant(transaction.merchant);
    setNotes(transaction.notes ?? '');
  }, [transaction]);

  const isSaving = isAdding || isUpdating || isDeleting;

  const isSaveDisabled = useMemo(() => {
    const parsed = Number(amount);
    const dateRegex = /^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/;

    return (
      Number.isNaN(parsed) ||
      parsed <= 0 ||
      category.trim().length === 0 ||
      merchant.trim().length === 0 ||
      !dateRegex.test(date.trim())
    );
  }, [amount, category, merchant, date]);

  // Set default category when switching types
  const handleTypeChange = (type: 'expense' | 'income') => {
    setTransactionType(type);
    if (type === 'expense') {
      setCategory('Food');
    } else {
      setCategory('Salary');
    }
  };

  const handleAmountChange = (value: string) => {
    const sanitized = value.replace(/[^0-9.]/g, '');
    setAmount(sanitized);
  };

  const handleSave = async () => {
    if (isSaveDisabled || isSaving) return;

    const payload = {
      type: transactionType,
      amount: Number(amount),
      category: category.trim(),
      date: date.trim(),
      merchant: merchant.trim(),
      notes: notes.trim(),
    };

    try {
      if (isEditing && transactionId) {
        await updateTransactionAsync({ transactionId, payload });
        Alert.alert('Success', 'Transaction updated successfully.');
      } else {
        await addTransactionAsync(payload);
        Alert.alert('Success', 'Transaction added successfully.');
      }
      router.back();
    } catch (error) {
      console.error('Failed to save transaction', error);
    }
  };

  const handleDelete = async () => {
    if (!transactionId || isSaving) return;

    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteTransactionAsync(transactionId);
            Alert.alert('Deleted', 'Transaction was successfully deleted.');
            router.back();
          } catch (error) {
            console.error('Failed to delete transaction', error);
          }
        },
      },
    ]);
  };

  // Calendar Helpers
  const toggleCalendar = () => {
    const parts = date.split('-');
    if (parts.length === 3) {
      const y = parseInt(parts[0], 10);
      const m = parseInt(parts[1], 10) - 1;
      if (!isNaN(y) && !isNaN(m) && m >= 0 && m <= 11) {
        setCalendarYear(y);
        setCalendarMonth(m);
      }
    }
    setShowCalendar(!showCalendar);
  };

  const handlePrevMonth = () => {
    if (calendarMonth === 0) {
      setCalendarMonth(11);
      setCalendarYear(calendarYear - 1);
    } else {
      setCalendarMonth(calendarMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (calendarMonth === 11) {
      setCalendarMonth(0);
      setCalendarYear(calendarYear + 1);
    } else {
      setCalendarMonth(calendarMonth + 1);
    }
  };

  const selectCalendarDay = (day: number) => {
    const formattedDate = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setDate(formattedDate);
    setShowCalendar(false);
  };

  const calendarCells = useMemo(() => {
    const emptyDays = getFirstDayOfMonth(calendarYear, calendarMonth);
    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
    const cells: { id: string; day: number | null }[] = [];

    for (let i = 0; i < emptyDays; i++) {
      cells.push({ id: `empty-${i}`, day: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      cells.push({ id: `day-${d}`, day: d });
    }

    return cells;
  }, [calendarYear, calendarMonth]);

  const activeCategoryOptions = transactionType === 'expense' ? expenseCategories : incomeCategories;

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <NavBar />

      <ScrollView contentContainerClassName="px-4 pb-12 pt-4" showsVerticalScrollIndicator={false}>
        <View className="mb-5 flex-row items-start justify-between">
          <View className="flex-1 pr-3">
            <Text className="text-2xl font-bold text-black">
              {isEditing ? 'Edit Transaction' : transactionType === 'income' ? 'Add Monthly Income' : 'Add Expense'}
            </Text>
            <Text className="text-slate-600">
              {transactionType === 'income'
                ? 'Track recurring monthly income to keep your cash flow accurate.'
                : 'Capture spending details to improve your budget insights.'}
            </Text>
          </View>

          <Pressable
            onPress={() => router.back()}
            className="h-10 w-10 items-center justify-center rounded-full bg-white shadow-sm">
            <Ionicons name="close" size={18} color="#334155" />
          </Pressable>
        </View>

        {isLoadingTransaction ? <Text className="mb-4 text-slate-500">Loading transaction...</Text> : null}
        {addError ? <Text className="mb-4 text-red-600">{addError}</Text> : null}
        {updateError ? <Text className="mb-4 text-red-600">{updateError}</Text> : null}

        {/* Transaction Type Expense/Income Toggle */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <View className="rounded-full bg-slate-100 p-1">
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => handleTypeChange('expense')}
                className={`flex-1 items-center rounded-full px-4 py-2.5 ${
                  transactionType === 'expense' ? 'bg-rose-600' : 'bg-transparent'
                }`}>
                <Text
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    transactionType === 'expense' ? 'text-white' : 'text-slate-500'
                  }`}>
                  Expense
                </Text>
              </Pressable>

              <Pressable
                onPress={() => handleTypeChange('income')}
                className={`flex-1 items-center rounded-full px-4 py-2.5 ${
                  transactionType === 'income' ? 'bg-emerald-600' : 'bg-transparent'
                }`}>
                <Text
                  className={`text-xs font-semibold uppercase tracking-wide ${
                    transactionType === 'income' ? 'text-white' : 'text-slate-500'
                  }`}>
                  Income
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Amount input */}
          <Text className="mb-2 mt-4 font-semibold text-slate-800">
            {transactionType === 'income' ? `Monthly amount (${symbol})` : `Amount (${symbol})`}
          </Text>
          <TextInput
            value={amount}
            onChangeText={handleAmountChange}
            keyboardType="decimal-pad"
            placeholder="0.00"
            className="rounded-xl border border-slate-200 px-4 py-3 text-slate-900"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* Date Dropdown Calendar Picker */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-slate-800">
            {transactionType === 'income' ? 'Month / Date Received' : 'Date'}
          </Text>
          <Pressable
            onPress={toggleCalendar}
            className="flex-row items-center justify-between rounded-xl border border-slate-200 px-3 py-3">
            <View className="flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="#64748B" />
              <Text className="ml-2 text-slate-800 font-medium">{date}</Text>
            </View>
            <Ionicons name={showCalendar ? 'chevron-up' : 'chevron-down'} size={16} color="#64748B" />
          </Pressable>

          {/* Custom Dropdown Calendar */}
          {showCalendar && (
            <View className="mt-3 rounded-xl border border-slate-100 bg-slate-50 p-3 shadow-inner">
              {/* Calendar Header */}
              <View className="mb-3 flex-row items-center justify-between">
                <Pressable onPress={handlePrevMonth} className="p-1">
                  <Ionicons name="chevron-back" size={20} color="#475569" />
                </Pressable>
                <Text className="font-semibold text-slate-700">
                  {monthNames[calendarMonth]} {calendarYear}
                </Text>
                <Pressable onPress={handleNextMonth} className="p-1">
                  <Ionicons name="chevron-forward" size={20} color="#475569" />
                </Pressable>
              </View>

              {/* Calendar Weekdays */}
              <View className="mb-1 flex-row flex-wrap">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <View key={day} style={{ width: '14.28%' }} className="items-center py-1">
                    <Text className="text-xs font-bold text-slate-400">{day}</Text>
                  </View>
                ))}
              </View>

              {/* Calendar Days Grid */}
              <View className="flex-row flex-wrap">
                {calendarCells.map((cell) => {
                  if (cell.day === null) {
                    return <View key={cell.id} style={{ width: '14.28%', aspectRatio: 1 }} />;
                  }

                  const cellDateString = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(cell.day).padStart(2, '0')}`;
                  const isSelected = date === cellDateString;

                  return (
                    <Pressable
                      key={cell.id}
                      onPress={() => selectCalendarDay(cell.day as number)}
                      style={{ width: '14.28%', aspectRatio: 1 }}
                      className="items-center justify-center p-0.5">
                      <View
                        className={`h-full w-full items-center justify-center rounded-full ${
                          isSelected ? 'bg-primary' : 'hover:bg-slate-200'
                        }`}>
                        <Text className={`text-xs font-semibold ${isSelected ? 'text-white' : 'text-slate-800'}`}>
                          {cell.day}
                        </Text>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          )}
        </View>

        {/* Category Pill Selection */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-3 font-semibold text-slate-800">Category</Text>
          <View className="flex-row flex-wrap gap-2">
            {activeCategoryOptions.map((cat) => {
              const isSelected = category === cat;
              return (
                <Pressable
                  key={cat}
                  onPress={() => setCategory(cat)}
                  className={`rounded-full border px-4 py-2 ${
                    isSelected ? 'border-primary bg-primary/10' : 'border-slate-200 bg-white'
                  }`}>
                  <Text className={`text-sm font-medium ${isSelected ? 'text-primary' : 'text-slate-700'}`}>
                    {cat}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Merchant/Payee input */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-slate-800">
            {transactionType === 'income' ? 'Income Source' : 'Merchant / Payee'}
          </Text>
          <View className="flex-row items-center rounded-xl border border-slate-200 px-3 py-3">
            <Ionicons name="storefront-outline" size={14} color="#64748B" />
            <TextInput
              value={merchant}
              onChangeText={setMerchant}
              placeholder={transactionType === 'income' ? 'Who paid you?' : 'Where did this happen?'}
              placeholderTextColor="#94A3B8"
              className="ml-2 flex-1 text-slate-800"
            />
          </View>
        </View>

        {/* Notes input */}
        <View className="mb-4 rounded-2xl bg-white p-4 shadow-sm">
          <Text className="mb-2 font-semibold text-slate-800">Note (optional)</Text>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Add a short note..."
            multiline
            numberOfLines={4}
            textAlignVertical="top"
            className="min-h-24 rounded-xl border border-slate-200 px-4 py-3 text-slate-900"
            placeholderTextColor="#94A3B8"
          />
        </View>

        {/* AI Insight message */}
        <View className="mb-4 rounded-2xl border border-blue-200 bg-blue-50 p-4">
          <View className="flex-row items-start gap-2">
            <Ionicons name="sparkles-outline" size={15} color="#2563EB" style={{ marginTop: 1 }} />
            <Text className="flex-1 text-blue-900">
              {transactionType === 'income'
                ? 'Tip: add your recurring monthly salary to keep monthly reports accurate.'
                : 'AI can auto-categorize this expense once you enter merchant details.'}
            </Text>
          </View>
        </View>

        {/* Save/Cancel actions */}
        <View className="flex-row gap-3">
          <Pressable
            onPress={() => router.back()}
            className="flex-1 items-center rounded-xl border border-slate-300 py-4">
            <Text className="font-semibold text-slate-700">Cancel</Text>
          </Pressable>

          <Pressable
            onPress={handleSave}
            disabled={isSaveDisabled || isSaving}
            className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-4 ${
              isSaveDisabled || isSaving ? 'bg-slate-300' : 'bg-primary'
            }`}>
            <Ionicons name={transactionType === 'income' ? 'cash-outline' : 'save-outline'} size={16} color="#FFFFFF" />
            <Text className="font-semibold text-white">
              {isSaving ? 'Saving...' : isEditing ? 'Save Changes' : transactionType === 'income' ? 'Save Income' : 'Save Expense'}
            </Text>
          </Pressable>
        </View>

        {/* Delete action in editing mode */}
        {isEditing && (
          <Pressable
            onPress={handleDelete}
            disabled={isSaving}
            className="mt-4 items-center rounded-xl border border-rose-200 bg-rose-50 py-4">
            <Text className="font-semibold text-rose-700">Delete Transaction</Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default AddTransaction;
