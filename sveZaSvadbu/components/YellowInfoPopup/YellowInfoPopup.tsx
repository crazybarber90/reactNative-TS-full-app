import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { CustomText } from '../../custom'

interface YellowInfoPropos {
  right?: number
  top?: number
  infoText: string
}

const YellowInfoPopup = ({ right, top, infoText }: YellowInfoPropos) => {
  const [openPopup, setOpenPopup] = useState(false)

  const touch = () => {
    setOpenPopup(!openPopup)
  }

  return (
    <View style={{ position: 'absolute', right: 0, top: 0, zIndex: 99 }}>
      <TouchableOpacity style={{ width: 30, height: 30 }} onPress={touch}>
        <View style={styles.yellowSign}>
          <CustomText style={styles.sign}>?</CustomText>
          {openPopup && (
            <View
              style={{
                width: 200,
                height: 'auto',
                minHeight: 30,
                backgroundColor: 'black',
                position: 'absolute',
                // bottom: 40,
                // right: 0,
                top: top,
                right: right,
                padding: 10,
                borderRadius: 8,
              }}
            >
              <CustomText style={styles.popupText}>{infoText}</CustomText>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </View>
  )
}

export default YellowInfoPopup

const styles = StyleSheet.create({
  yellowSign: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderRadius: 50,
    top: 5,
    right: 5,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 55,
  },
  sign: {
    color: 'black',
    fontSize: 18,
    zIndex: 99,
  },
  popupText: {
    color: 'white',
    fontSize: 16,
    zIndex: 99,
  },
})
