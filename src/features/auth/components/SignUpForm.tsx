import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import Input from '@/features/auth/components/Input';
import { useSignUp } from '../hooks/useAuth';
import google from '../../../../assets/goggle.png';

const SignUpForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const { signUp, isLoading, isError, error } = useSignUp();

  const handleSignUp = () => {
    signUp({ email, password, displayName });
  };
  return (
    <View>
      {isError && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}
      <View className="mb-4">
        <Text className="pb-1 text-textGray">Full Name</Text>
        <Input
          placeholder="Enter your full name"
          icon="person-outline"
          value={displayName}
          onChangeText={setDisplayName}
        />
      </View>
      <View className="mb-4">
        <Text className="pb-1 text-textGray">Email</Text>
        <Input
          placeholder="Enter your email"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View>
        <Text className="pb-1 text-textGray">Password</Text>
        <Input
          placeholder="Enter your password"
          secureTextEntry
          icon="lock-closed"
          value={password}
          onChangeText={setPassword}
        />
      </View>
      <TouchableOpacity
        className="mt-4  flex w-full cursor-pointer flex-row items-center justify-center rounded-md bg-primary py-4 text-white"
        onPress={handleSignUp}>
        <Ionicons name="log-in-outline" size={22} color="#fff" className="mr-2" />
        <Text className="font-montserrat text-white">
          {isLoading ? 'Signing up...' : 'Sign Up'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <View className="mb-4 flex-row items-center justify-center gap-2">
          <View className="h-px w-40 bg-gray-300" />
          <Text className="text-center font-montserratSemiBold">OR</Text>
          <View className="h-px w-40 bg-gray-300" />
        </View>

        {/* <TouchableOpacity className="mt-2 flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-4">
          <Image source={google} alt="google-logo" className="h-6 w-6" />
          <Text className="font-montserrat text-textdark">Continue with Google</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default SignUpForm;
