import { View, Text } from 'react-native';
import React from 'react';

import { Link } from 'expo-router';

import LoginForm from '@/features/auth/components/LoginForm';

const login = () => {
  return (
    <View className="flex-1">
      <View className="mx-6 mt-8  rounded-2xl bg-white p-6 shadow-lg">
        <View className="items-left mb-4 flex justify-start gap-2">
          <Text className="text-2xl font-semibold">Welcome Back</Text>
          <Text className="font-montserrat text-textGray text-base">
            Enter your credentials to access your dashboard.
          </Text>
        </View>

        <LoginForm />
        <View className="mt-4 flex flex-row items-center justify-center gap-1">
          <Text className="text-textGray">Don't have an account?</Text>
          <Link href="/signup">
            <Text className="text-primary font-montserrat text-sm"> Sign Up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default login;
