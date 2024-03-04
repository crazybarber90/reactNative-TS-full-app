import React, { useState } from 'react'
import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { Entypo } from '@expo/vector-icons'
import { NewTaskProps } from '../../../common/services/planners/useCreatePlannerTask'
import { t } from 'i18next'
import { COLOR_MAPPER } from '../../theme'
import { CustomText } from '../../custom'

const ImagePickerComponent = ({
  taskData,
  setTaskData,
}: {
  taskData: NewTaskProps
  setTaskData: React.Dispatch<React.SetStateAction<NewTaskProps>>
}) => {
  const [localImage, setLocalImage] = useState('')

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    const perrmision = await ImagePicker.requestMediaLibraryPermissionsAsync()

    if (perrmision.granted) {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
        // NEEDS to add base64 becouse of backend. base64-file to big string
      })

      if (result.canceled) {
        console.log('Korisnik je otkazao odabir slike')
      } else {
        setTaskData({
          ...taskData,
          imageData: `data:image/jpeg;base64,${result.assets[0].base64}`,
        })
        setLocalImage(result.assets[0].uri)
      }
    }
  }

  const takeImage = async () => {
    // No permissions request is necessary for launching the image library
    const perrmision = await ImagePicker.requestCameraPermissionsAsync()

    if (perrmision.granted) {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        base64: true,
      })

      if (result.canceled) {
        console.log('Korisnik je otkazao odabir slike')
      } else {
        setTaskData({
          ...taskData,
          imageData: `data:image/jpeg;base64,${result.assets[0].base64}`,
        })
        setLocalImage(result.assets[0].uri)
      }
    }
  }

  return (
    <View>
      {taskData.imageData && localImage ? (
        <View style={{ height: 120, width: 120, alignSelf: 'center' }}>
          <Image
            style={{ height: '100%', width: '100%' }}
            source={{ uri: localImage }}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={{
              position: 'absolute',
              top: 15,
              right: 0,
              backgroundColor: 'white',
              opacity: 0.8,
              width: 25,
              height: 25,
              borderWidth: 1,
              borderColor: 'black',
            }}
            onPress={() => setTaskData({ ...taskData, imageData: '' })}
          >
            <CustomText style={{ fontSize: 16, textAlign: 'center' }}>
              X
            </CustomText>
          </TouchableOpacity>
        </View>
      ) : (
        <View
          style={{
            flexDirection: 'row',
            height: 80,
            width: '85%',
            alignSelf: 'center',
            justifyContent: 'space-between',
          }}
        >
          <View style={styles.container}>
            <TouchableOpacity
              style={{ justifyContent: 'center', alignItems: 'center' }}
              onPress={pickImage}
            >
              <Entypo name="images" size={40} color={COLOR_MAPPER.ALTERNATE} />
              <CustomText>{t('imageGalleryAdd')}</CustomText>
            </TouchableOpacity>
          </View>
          <View style={styles.container}>
            <TouchableOpacity
              onPress={takeImage}
              style={{ justifyContent: 'center', alignItems: 'center' }}
            >
              <Entypo name="camera" size={40} color={COLOR_MAPPER.ALTERNATE} />
              <CustomText style={{ textAlign: 'center' }}>
                {t('imageGalleryTake')}
              </CustomText>
            </TouchableOpacity>
          </View>

          <View />
        </View>
      )}
    </View>
  )
}

export default ImagePickerComponent

const styles = StyleSheet.create({
  container: {
    width: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
