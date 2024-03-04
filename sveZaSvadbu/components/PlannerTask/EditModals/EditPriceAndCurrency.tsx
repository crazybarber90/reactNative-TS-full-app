import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  TextInput,
} from 'react-native'
import RNSelectPicker from '../../RNSelectPicker/RNSelectPicker'
import { PlannerItem } from '../../../../common/services/planners/types'
import { useChangePlannerItem } from '../../../../common/services/planners/useChangePlannerItemPrice'
import Toast from 'react-native-toast-message'
import { t } from 'i18next'
import { COLOR_MAPPER } from '../../../theme'
import { CustomText } from '../../../custom'
import { FONT_MAPPER } from '../../../custom/enums'

interface EditPriceAndCurrencyModalProps {
  showPriceModal: boolean
  setShowPriceModal: React.Dispatch<React.SetStateAction<boolean>>
  task: PlannerItem
}

const EditPriceAndCurrencyModal = ({
  showPriceModal,
  setShowPriceModal,
  task,
}: EditPriceAndCurrencyModalProps) => {
  const { mutateAsync: changePlannerItemPrice } = useChangePlannerItem()

  const [priceData, setPriceData] = useState({
    plannerItemId: task.id,
    currencyId: task?.currency?.id,
    price: task?.price,
  })

  // CHANGE PRICE FUNCTION
  const handleChangePriceAndCurrency = async () => {
    try {
      const data = await changePlannerItemPrice(priceData)
      if (data.status === 200) {
        Toast.show({
          type: 'success',
          text1: t('changePriceSucces'),
        })
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('changePriceError'),
      })
    }
  }

  const pickerItemsOption = [
    {
      label: 'RSD',
      value: 1,
    },
    {
      label: 'EUR',
      value: 2,
    },
  ]

  return (
    <Modal visible={showPriceModal} transparent={true}>
      <TouchableWithoutFeedback onPress={() => setShowPriceModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </TouchableWithoutFeedback>

      <View style={styles.container}>
        <TouchableOpacity
          style={styles.closeModal}
          onPress={() => setShowPriceModal(false)}
        >
          <CustomText style={styles.closeModalText}>X</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.title}>{t('changePrice')}</CustomText>

        {/* CONTENT */}
        <View style={styles.inputContainers}>
          <View style={{ backgroundColor: 'white', padding: 7, marginTop: 10 }}>
            <RNSelectPicker
              handleChange={(value) =>
                setPriceData({ ...priceData, currencyId: +value as 1 | 2 })
              }
              pickerItems={pickerItemsOption}
              label={t('pickCurrency')}
              value={priceData.currencyId}
            />
          </View>
          <TextInput
            keyboardType={'numeric'}
            placeholder="0.00"
            value={priceData.price}
            onChangeText={(text) => setPriceData({ ...priceData, price: text })}
            style={{
              padding: 10,
              backgroundColor: 'white',
              marginVertical: 10,
              fontFamily: FONT_MAPPER.FontNormal,
            }}
          />
        </View>
        <TouchableOpacity
          onPress={() => handleChangePriceAndCurrency()}
          style={styles.button}
        >
          <CustomText weight={FONT_MAPPER.FontBold} style={styles.buttonText}>
            {t('edit')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default EditPriceAndCurrencyModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'whitesmoke',
    width: '75%',
    // height: 230,
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    paddingHorizontal: 15,
    paddingVertical: 15,
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
    textAlign: 'center',
    fontSize: 18,
  },
  inputContainers: {
    width: '70%',
    alignSelf: 'center',
    paddingVertical: 10,
  },
  button: {
    width: '70%',
    backgroundColor: COLOR_MAPPER.ALTERNATE,
    alignSelf: 'center',
  },
  buttonText: {
    padding: 10,
    textAlign: 'center',
    color: 'white',
    fontSize: 18,
  },
})
