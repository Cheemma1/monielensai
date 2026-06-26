import { View, TextInput, Pressable, type TextInputProps } from 'react-native';
import React, { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

type IoniconName = React.ComponentProps<typeof Ionicons>['name'];

interface InputProps extends Pick<TextInputProps, 'secureTextEntry'> {
  placeholder: string;
  icon?: IoniconName;
  iconView?: IoniconName;
  value: string;
  onChangeText: (text: string) => void;
}

const Input = ({
  placeholder,
  secureTextEntry,
  icon,
  iconView,
  value,
  onChangeText,
}: InputProps) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <View className="flex-row items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-3">
      {icon ? <Ionicons name={icon} size={22} color="#777" /> : null}

      <TextInput
        placeholder={placeholder}
        secureTextEntry={secureTextEntry && !isPasswordVisible}
        value={value}
        onChangeText={onChangeText}
        className="flex-1 border-none bg-transparent"
      />
      {secureTextEntry ? (
        <Pressable
          onPress={() => setIsPasswordVisible((current) => !current)}
          hitSlop={10}
          accessibilityRole="button"
          accessibilityLabel={isPasswordVisible ? 'Hide password' : 'Show password'}>
          <Ionicons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={22}
            color="#777"
          />
        </Pressable>
      ) : iconView ? (
        <Ionicons name={iconView} size={22} color="#777" />
      ) : null}
    </View>
  );
};

export default Input;
