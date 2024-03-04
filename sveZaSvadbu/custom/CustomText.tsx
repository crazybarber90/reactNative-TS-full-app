import { Text, TextProps } from 'react-native'
import React from 'react'
import { FONT_MAPPER } from './enums'

interface ICustomText extends TextProps {
  weight?: FONT_MAPPER
  children?: JSX.Element | string | string[]
}

export const CustomText = ({
  weight = FONT_MAPPER.FontNormal,
  children,
  ...props
}: ICustomText) => {
  return (
    <Text {...props} style={[props.style, { fontFamily: weight }]}>
      {children}
    </Text>
  )
}
