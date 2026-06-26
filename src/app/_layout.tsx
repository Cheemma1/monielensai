import '../../global.css';
import { Stack } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/features/auth/Authcontext';
import {
  useFonts,
  Montserrat_400Regular,
  Montserrat_500Medium,
  Montserrat_600SemiBold,
  Montserrat_700Bold,
} from '@expo-google-fonts/montserrat';
import { Text, View, ActivityIndicator } from 'react-native';

// ─── Global font override ─────────────────────────────────────────────────────
// In React Native fonts don't cascade like CSS. This patches Text.defaultProps
// so EVERY Text in the app uses Montserrat-Regular unless explicitly overridden.
// const defaultTextStyle = (Text as any).defaultProps?.style ?? {};
// (Text as any).defaultProps = {
//   ...((Text as any).defaultProps ?? {}),
//   style: [defaultTextStyle, { fontFamily: 'Montserrat-Regular' }],
// };


const queryClient = new QueryClient();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Regular': Montserrat_400Regular,
    'Montserrat-Medium': Montserrat_500Medium,
    'Montserrat-SemiBold': Montserrat_600SemiBold,
    'Montserrat-Bold': Montserrat_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#03071D' }}>
        <ActivityIndicator color="#0052FE" />
      </View>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(onboarding)" />
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </AuthProvider>
    </QueryClientProvider>
  );
}
