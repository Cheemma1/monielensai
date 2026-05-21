import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import Input from '@/features/auth/components/Input';
import { useState } from 'react';
import { useLogIn } from '../hooks/useAuth';

const LoginForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { logIn, isLoading, isError, error, reset } = useLogIn();

  const handleLogin = () => {
    logIn({ email, password });
  };

  return (
    <View>
      {isError && <Text style={{ color: 'red', marginBottom: 8 }}>{error}</Text>}

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
        onPress={handleLogin}>
        <Ionicons name="log-in-outline" size={22} color="#fff" className="mr-2" />
        <Text className="font-montserrat text-white">
          {isLoading ? 'Logging in...' : 'Login to Dashboard'}
        </Text>
      </TouchableOpacity>

      <View className="mt-4">
        <Text className="text-center font-montserratSemiBold">OR</Text>

        <TouchableOpacity className="mt-4 flex w-full cursor-pointer flex-row items-center justify-center rounded-md border border-gray-300 bg-white py-4">
          <Ionicons name="logo-google" size={22} color="#000" className="mr-2" />
          <Text className="font-montserrat text-textdark">Continue with Google</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginForm;
