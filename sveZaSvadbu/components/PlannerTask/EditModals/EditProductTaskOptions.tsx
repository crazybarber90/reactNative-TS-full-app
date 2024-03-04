import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import { t } from 'i18next'
import { CustomText } from '../../../custom'

interface EditProductTaskOptionsModalProps {
  title: string
  showEditProductPrice: boolean
  setShowEditProductPrice: React.Dispatch<React.SetStateAction<boolean>>
  handleDeletePlannerItem: () => void
  handlePriceModal: () => void
}

const EditProductTaskOptionsModal = ({
  title,
  showEditProductPrice,
  setShowEditProductPrice,
  handleDeletePlannerItem,
  handlePriceModal,
}: EditProductTaskOptionsModalProps) => {
  return (
    <Modal visible={showEditProductPrice} transparent={true}>
      <TouchableWithoutFeedback onPress={() => setShowEditProductPrice(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeModal}
          onPress={() => setShowEditProductPrice(false)}
        >
          <CustomText style={styles.closeModalText}>x</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.title}>
          {t('product')}: {title}
        </CustomText>
        <TouchableOpacity
          onPress={() => handleDeletePlannerItem()}
          style={{ width: '80%', marginVertical: 10 }}
        >
          <CustomText style={[styles.options, { color: 'red' }]}>
            {t('productDelete')}
          </CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handlePriceModal()}
          style={{ width: '80%' }}
        >
          <CustomText style={styles.options}>
            {t('productEditPrice')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default EditProductTaskOptionsModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    width: 270,
    // height: 150,
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 25,
  },
  closeModal: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  closeModalText: {
    color: 'red',
    fontSize: 26,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  title: {
    width: '100%',
    // textAlign: 'center',
    fontSize: 20,
    fontWeight: '600',
  },
  options: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
})
