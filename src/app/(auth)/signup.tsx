import { View, Text, TouchableOpacity } from 'react-native';
import React from 'react';
import { Link } from 'expo-router';

import SignUpForm from '@/features/auth/components/SignUpForm';

const signup = () => {
  return (
    <View className="flex-1">
      <View className="mx-6 mt-8  rounded-2xl bg-white p-6 shadow-lg">
        <View className="items-left mb-4 flex justify-start gap-2">
          <Text className="text-2xl font-semibold">Create an Account</Text>
          <Text className="font-montserrat text-textGray text-base">
            Sign up for a new account.
          </Text>
        </View>

        <SignUpForm />

        <View className="mt-4 flex flex-row items-center justify-center gap-1">
          <Text className="text-textGray">Already have an account?</Text>
          <Link href="/login">
            <Text className="text-primary font-montserrat text-sm"> Sign In</Text>
          </Link>
        </View>
      </View>
    </View>
  );
};

export default signup;
