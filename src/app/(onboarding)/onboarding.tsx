import React, { useRef, useState } from 'react';
import { View, Text, FlatList, Dimensions, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Track your money easily',
    description:
      'Automate your expense tracking with AI-powered categorization and real-time syncing across all your bank accounts.',
    image: require('../../../assets/onboarding1.png'),
  },
  {
    id: '2',
    title: 'Stay within your budget',
    description: 'Set monthly budgets and get alerts before you overspend.',
    image: require('../../../assets/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Understand your spending',
    description: 'See where your money goes with simple charts and AI insights.',
    image: require('../../../assets/onboarding2.png'),
  },
];

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    } else {
      await AsyncStorage.setItem('hasSeenOnboarding', 'true');
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center bg-[#fff]">
      <View className="flex-1">
        <FlatList
          ref={flatListRef}
          data={slides}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          renderItem={({ item }) => (
            <View style={{ width }} className="flex-1 items-center justify-center px-8">
              <Image source={item.image} className="mb-8 h-[200px] w-[200px]" />
              <Text className="mb-4 text-center font-montserratBold text-5xl font-extrabold text-textdark">
                {item.title}
              </Text>
              <Text className="text-center font-montserrat text-[18px] leading-6 text-textGray">
                {item.description}
              </Text>
            </View>
          )}
        />

        <View className="p-6">
          <View className="mb-6 flex-row justify-center">
            {slides.map((_, index) => (
              <View
                key={index}
                className={`mx-[5px] h-[10px] rounded-full ${
                  currentIndex === index ? 'w-6 bg-primary' : 'w-[10px] bg-primary/50'
                }`}
              />
            ))}
          </View>

          <TouchableOpacity
            className="items-center rounded-2xl bg-primary py-4 text-white"
            onPress={handleNext}>
            <Text className="font-montserratBold text-base text-white">
              {currentIndex === slides.length - 1 ? 'Get Started' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
