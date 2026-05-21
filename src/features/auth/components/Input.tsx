import { View, Text, TextInput } from 'react-native';
import React from 'react';
import Ionicons from '@expo/vector-icons/build/Ionicons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface InputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  icon?: IoniconName;
  value: string;
  onChangeText: (text: string) => void;
}

const Input = ({ placeholder, secureTextEntry, icon, value, onChangeText }: InputProps) => {
  return (
    <View className=" flex flex-row items-center gap-2 rounded-md border border-gray-300 bg-gray-100 px-4">
      {icon ? <Ionicons name={icon} size={22} color="#777" /> : null}

      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

export default Input;
