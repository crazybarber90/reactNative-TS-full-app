import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { CustomText } from '../custom'

const TermsAndConditions = () => {
  return (
    <View style={styles.container}>
      <CustomText>TermsAndConditions</CustomText>
      <CustomText>TermsAndConditions</CustomText>
      <CustomText>TermsAndConditions</CustomText>
      <CustomText>TermsAndConditions</CustomText>
      <CustomText>TermsAndConditions</CustomText>
      <CustomText>TermsAndConditions</CustomText>
    </View>
  )
}

export default TermsAndConditions

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
