import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { ImageGallery as GaleryImage } from '@georstat/react-native-image-gallery'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { t } from 'i18next'
import { CustomText } from '../../custom'

interface ImageGalleryProps {
  imageGallery: { id: number; image: string }[]
  galleryVisible: boolean
  openGallery: () => void
  closeGallery: () => void
}

const ImageGallery = ({
  imageGallery,
  openGallery,
  closeGallery,
  galleryVisible,
}: ImageGalleryProps) => {
  const galleryData = imageGallery.map((image) => {
    return {
      id: image.id,
      url: image.image,
    }
  })

  return (
    <View style={{ marginTop: 30 }}>
      <CustomText
        style={{ textAlign: 'center', fontSize: 20, marginBottom: 5 }}
      >
        {t('galleryImage')}
      </CustomText>
      <TouchableOpacity onPress={openGallery} style={{ position: 'relative' }}>
        <Image
          source={{ uri: imageGallery[0].image }}
          height={300}
          width={300}
          style={{ alignSelf: 'center' }}
        />
        <MaterialCommunityIcons
          name="gesture-tap"
          size={30}
          color="white"
          style={{ bottom: '50%', left: '45%' }}
        />
      </TouchableOpacity>
      <GaleryImage
        images={galleryData}
        isOpen={galleryVisible}
        close={closeGallery}
      />
    </View>
  )
}

export default ImageGallery

const styles = StyleSheet.create({})
