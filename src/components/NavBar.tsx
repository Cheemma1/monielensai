import { View, Text } from 'react-native';
import React from 'react';
import { useAuthUser } from '@/features/auth/Authcontext';
import { Ionicons } from '@expo/vector-icons';

const NavBar = () => {
  const { user } = useAuthUser();
  return (
    <View className="mx-4 mt-4 rounded-full bg-white  shadow-md">
      <View className="flex-row items-center gap-2 px-2 py-2">
        <View className="flex  h-10 w-10 items-center justify-center rounded-full bg-primary text-white">
          <Text className="text-lg text-white">{user?.displayName?.charAt(0) ?? 'U'}</Text>
        </View>
        <Text className="text-lg font-bold text-black">MoneyLenAi</Text>
      </View>
      <Ionicons name="notifications" size={20} color="#333" className="absolute right-4 top-4" />
    </View>
  );
};

export default NavBar;
