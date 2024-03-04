import { StyleSheet } from 'react-native'
import React from 'react'
import RNPickerSelect from 'react-native-picker-select'

const RNSelectPicker = ({
  handleChange,
  pickerItems,
  label,
  value,
  error,
}: {
  handleChange: (value: string) => void
  pickerItems: any
  label: string
  value?: string | number
  error?: string
}) => {
  return (
    <RNPickerSelect
      placeholder={{ label: label, color: 'black' }}
      useNativeAndroidPickerStyle
      onValueChange={handleChange}
      items={pickerItems}
      value={value ? value : null}
      style={{
        inputAndroid: {
          color: 'black',
          backgroundColor: 'white',
        },
        inputIOS: {
          backgroundColor: 'white',
          paddingVertical: 8,
          paddingHorizontal: 16,
        },
        placeholder: {
          color: error ? 'red' : 'black',
        },
      }}
    />
  )
}

export default RNSelectPicker

const styles = StyleSheet.create({})
