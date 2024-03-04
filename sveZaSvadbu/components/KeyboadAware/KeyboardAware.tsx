import React, { ReactNode } from 'react'
import {
  KeyboardAvoidingView as KAV,
  Platform,
  StyleProp,
  ViewStyle,
} from 'react-native'

type KeyboardAwareProps = {
  children: ReactNode | ReactNode[]
  style?: StyleProp<ViewStyle>
  keyboardVerticalOffset: number
}

export default function KeyboardAware({
  children,
  style,
  keyboardVerticalOffset,
}: KeyboardAwareProps): React.ReactElement {
  return (
    <KAV
      enabled={Platform.OS === 'ios'}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={keyboardVerticalOffset}
      style={style}
    >
      {children}
    </KAV>
  )
}
