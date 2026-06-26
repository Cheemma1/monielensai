import { useEffect, useState } from 'react';
import { Alert, ScrollView,  TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthUser } from '@/features/auth/Authcontext';
import { useLogOut, useUpdateUserDetails } from '@/features/auth/hooks/useAuth';
import { currencyOptions } from '@/constants/categories';
import Text from '@/components/Text';

const Profile = () => {
  const { user, userDetails, refreshUser } = useAuthUser();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [currency, setCurrency] = useState<(typeof currencyOptions)[number]>(currencyOptions[0]);
  const [showCurrencyOptions, setShowCurrencyOptions] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasLoadedInitials, setHasLoadedInitials] = useState(false);

  const {
    updateUserDetails,
    isLoading: isUpdating,
    isError,
    error,
    isSuccess,
    reset,
  } = useUpdateUserDetails();
  const { logOut, isLoading: isLoggingOut } = useLogOut();

  useEffect(() => {
    if (userDetails && !hasLoadedInitials) {
      setDisplayName(userDetails.displayName || '');
      setEmail(userDetails.email || '');
      if (
        typeof userDetails.currency === 'string' &&
        currencyOptions.includes(userDetails.currency as (typeof currencyOptions)[number])
      ) {
        setCurrency(userDetails.currency as (typeof currencyOptions)[number]);
      }
      setHasLoadedInitials(true);
      setLoadingProfile(false);
    } else if (!user) {
      setLoadingProfile(false);
    }
  }, [user, userDetails, hasLoadedInitials]);

  useEffect(() => {
    const applyRefresh = async () => {
      if (!isSuccess) return;

      await refreshUser();
      Alert.alert('Profile updated', 'Your details were saved successfully.');
      reset();
    };

    applyRefresh();
  }, [isSuccess, refreshUser, reset]);

  const handleSave = () => {
    updateUserDetails({ displayName, email, currency });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50" edges={['top']}>
      <ScrollView contentContainerClassName="px-4 pb-28 pt-4">
        <View className="rounded-2xl bg-white p-5 shadow-sm">
          <View className="mx-auto mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-primary text-white">
            <Text className="text-3xl font-bold text-white">
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text className="text-center text-2xl font-semibold text-slate-900">
            Profile Settings
          </Text>
          <Text className="mt-1 text-center text-slate-500">Update your account details here.</Text>

          {loadingProfile ? <Text className="mt-4 text-slate-500">Loading profile...</Text> : null}
          {isError ? <Text className="mt-4 text-red-600">{error}</Text> : null}

          <View className="mt-5">
            <Text className="pb-1 text-slate-600">Full Name</Text>
            <TextInput
              className="rounded-md border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900"
              placeholder="Enter your full name"
              value={displayName}
              onChangeText={setDisplayName}
            />
          </View>

          <View className="mt-4">
            <Text className="pb-1 text-slate-600">Email</Text>
            <TextInput
              className="rounded-md border border-slate-300 bg-slate-100 px-4 py-3 text-slate-900"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View className="mt-4">
            <Text className="pb-1 text-slate-600">Currency</Text>
            <TouchableOpacity
              className="rounded-md border border-slate-300 bg-slate-100 px-4 py-3"
              onPress={() => setShowCurrencyOptions((prev) => !prev)}>
              <Text className="text-slate-900">{currency}</Text>
            </TouchableOpacity>
            {showCurrencyOptions ? (
              <View className="mt-2 overflow-hidden rounded-md border border-slate-200 bg-white">
                {currencyOptions.map((option) => (
                  <TouchableOpacity
                    key={option}
                    className={`px-4 py-3 ${currency === option ? 'bg-slate-100' : 'bg-white'}`}
                    onPress={() => {
                      setCurrency(option);
                      setShowCurrencyOptions(false);
                    }}>
                    <Text className="text-slate-800">{option}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            ) : null}
          </View>

          <TouchableOpacity
            className="mt-6 rounded-md bg-primary py-4"
            disabled={isUpdating || loadingProfile}
            onPress={handleSave}>
            <Text className="text-center font-medium text-white">
              {isUpdating ? 'Saving...' : 'Save Changes'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-3 rounded-md border border-slate-300 bg-white py-4"
            disabled={isLoggingOut}
            onPress={() => logOut()}>
            <Text className="text-center font-medium text-slate-700">
              {isLoggingOut ? 'Logging out...' : 'Log Out'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Profile;
