import React from 'react';
import { Text as RNText, StyleProp, TextStyle } from 'react-native';

type Props = React.ComponentProps<typeof RNText>;

const BASE_FONT: TextStyle = { fontFamily: 'Montserrat-Regular' };


export default function Text({ style, ...props }: Props) {
  const mergedStyle: StyleProp<TextStyle> = style
    ? [BASE_FONT, ...(Array.isArray(style) ? style : [style])]
    : BASE_FONT;

  return <RNText style={mergedStyle} {...props} />;
}
