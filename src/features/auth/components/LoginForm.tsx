import { Image, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import Input from '@/features/auth/components/Input';
import { useState } from 'react';
import { useLogIn, useGoogleLogIn } from '../hooks/useAuth';
import google from '../../../../assets/goggle.png';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn, isLoading, isError, error, reset } = useLogIn();
  const {
    logInWithGoogle,
    isLoading: isGoogleLoading,
    isError: isGoogleError,
    error: googleError,
  } = useGoogleLogIn();

  const handleLogin = () => {
    logIn({ email, password });
  };

  const handleGoogleLogin = () => {
    logInWithGoogle();
  };

  return (
    <View>
      {(isError || isGoogleError) && (
        <Text style={{ color: 'red', marginBottom: 8 }}>{error || googleError}</Text>
      )}

      <View>
        <Text className="pb-1 text-textGray">Email</Text>
        <Input
          placeholder="Enter your email"
          icon="mail-outline"
          value={email}
          onChangeText={setEmail}
        />
      </View>
      <View>
        <View className="flex flex-row items-center justify-between py-2">
          <Text className="text-textGray">Password</Text>
          <Link className="text-primary" href="/forgot-password">
            <Text className="font-montserrat text-sm text-primary"> forget password?</Text>
          </Link>
        </View>

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
        onPress={handleLogin}
        disabled={isLoading || isGoogleLoading}>
        <Ionicons name="log-in-outline" size={22} color="#fff" className="mr-2" />
        <Text className="font-montserrat text-white">
          {isLoading ? 'Logging in...' : 'Login to Dashboard'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <View className="mb-4 flex-row items-center justify-center gap-2">
          <View className="h-px w-40 bg-gray-300" />
          <Text className="text-center font-montserratSemiBold">OR</Text>
          <View className="h-px w-40 bg-gray-300" />
        </View>
        {/* <TouchableOpacity
          className="mt-2 flex w-full cursor-pointer flex-row items-center justify-center gap-2 rounded-md border border-gray-300 bg-white py-4"
          onPress={handleGoogleLogin}
          disabled={isLoading || isGoogleLoading}>
          <Image source={google} alt="google-logo" className="h-6 w-6" />
          <Text className="font-montserrat text-textdark">
            {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
          </Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
};

export default LoginForm;
