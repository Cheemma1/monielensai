import { Slot } from 'expo-router';
import { Image, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AuthLayout() {
  return (
    <SafeAreaView className="flex-1 bg-[F8F9FD]">
      <View className="flex items-center gap-1 pt-14">
        <Image source={require('../../../assets/logo.png')} className="h-[30px] w-[30px]" />
        <Text className="text-textdark font-montserratBold text-center text-3xl font-extrabold">
          MoneyLens
        </Text>
        <Text className="font-montserrat text-textGray w-72 text-center text-base">
          Precision financial intelligence at your fingertips.
        </Text>
      </View>

      <Slot />
    </SafeAreaView>
  );
}
