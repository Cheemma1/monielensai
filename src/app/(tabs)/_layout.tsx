// import { Slot } from 'expo-router';
// import { Image, Text, View } from 'react-native';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function TabsLayout() {
//   return (
//     <SafeAreaView className="flex-1 bg-[F8F9FD]">

//       <Slot />
//     </SafeAreaView>
//   );
// }

import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabsLayout() {
  return (
    // <SafeAreaView className="flex-1 bg-[F8F9FD]">
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#0052FE',
        tabBarInactiveTintColor: '#46464D',
        tabBarStyle: {
          height: 100,
          paddingBottom: 30,
          paddingTop: 8,
        },
      }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="budget"
        options={{
          title: 'Budgets',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="wallet-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="scan"
        options={{
          title: 'Scan',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="qr-code-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="analytics-outline" size={size} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="aichat"
        options={{
          title: 'AI Chat',
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubbles-outline" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
    // </SafeAreaView>
  );
}
