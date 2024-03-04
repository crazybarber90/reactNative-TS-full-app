import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import { useCreatePlanner } from '../../../common/services/planners/useCreateNewPlanner'
import Toast from 'react-native-toast-message'
import KeyboardAware from '../KeyboadAware/KeyboardAware'
import { t } from 'i18next'
import { COLOR_MAPPER } from '../../theme'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const AddNewPlannerModal = ({
  setShowPlannerModal,
  showPlannerModal,
}: {
  setShowPlannerModal: React.Dispatch<React.SetStateAction<boolean>>
  showPlannerModal: boolean
}) => {
  const [plannerData, setPlannerData] = useState({
    title: '',
    description: '',
  })

  const [titleError, setTitleError] = useState<string>('')

  const { mutateAsync: createNewPlanner } = useCreatePlanner()

  const validateForm = () => {
    const trimTitle = plannerData.title.trim()

    // Checking if title is empty
    if (trimTitle.length === 0) {
      setTitleError(t('createPlannerTitleError'))
      return false
    }
    return true
  }

  const handleCreatePlanner = async () => {
    if (validateForm()) {
      try {
        const data = await createNewPlanner(plannerData)
        if (data.status === 200) {
          setShowPlannerModal(false)
          setPlannerData({ title: '', description: '' })
          Toast.show({
            type: 'success',
            text1: t('createPlannerSucces'),
          })
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: t('createPlannerError'),
        })
      }
    } else {
      Toast.show({
        type: 'error',
        text1: t('createPlannerTitleErrorMsg'),
      })
    }
  }

  return (
    <Modal visible={showPlannerModal} transparent={true}>
      <KeyboardAware keyboardVerticalOffset={0} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => setShowPlannerModal(false)}>
          <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
        </TouchableWithoutFeedback>
        <View style={styles.plannerModalWrapper}>
          <CustomText style={styles.topText}>{t('createPlanner')}</CustomText>

          {/* close modal btn */}
          <TouchableOpacity
            style={{ position: 'absolute', top: 5, right: 15 }}
            onPress={() => setShowPlannerModal(false)}
          >
            <CustomText style={styles.closeModalBtn}>X</CustomText>
          </TouchableOpacity>

          {/* 1st input */}
          <TextInput
            placeholderTextColor={'gray'}
            placeholder={t('createPlannerTitle')}
            style={styles.inputName}
            onChangeText={(text) =>
              setPlannerData({ ...plannerData, title: text })
            }
          />
          {titleError && (
            <CustomText
              style={{
                color: 'red',
                marginBottom: 10,
                width: '80%',
                textAlign: 'left',
              }}
            >
              {titleError}
            </CustomText>
          )}

          {/* 2nd input */}
          <TextInput
            placeholder={t('createPlannerDescription')}
            placeholderTextColor={'gray'}
            multiline={true} // Omogućava višelinijski unos
            numberOfLines={4} // Postavlja broj redova u prikazu
            style={styles.inputDescription}
            onChangeText={(text) =>
              setPlannerData({ ...plannerData, description: text })
            }
          />

          {/* add planner btn */}
          <TouchableOpacity
            onPress={handleCreatePlanner}
            style={{ width: '80%' }}
          >
            <CustomText style={styles.addButton}>{t('add')}</CustomText>
          </TouchableOpacity>
        </View>
      </KeyboardAware>
    </Modal>
  )
}

export default AddNewPlannerModal

const styles = StyleSheet.create({
  plannerModalWrapper: {
    position: 'absolute',
    width: 330,
    top: '35%',
    left: '10%',
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    justifyContent: 'center',
  },

  topText: {
    paddingVertical: 10,
    fontSize: 20,
  },
  closeModalBtn: {
    color: 'red',
    fontSize: 24,
  },
  inputName: {
    padding: 15,
    width: '80%',
    backgroundColor: 'white',
    fontSize: 16,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    marginBottom: 10,
    fontFamily: FONT_MAPPER.FontNormal,
  },
  inputDescription: {
    padding: 15,
    height: 100,
    width: '80%',
    backgroundColor: 'white',
    fontSize: 16,
    borderBottomColor: 'black',
    borderBottomWidth: 0.5,
    fontFamily: FONT_MAPPER.FontNormal,
  },
  addButton: {
    backgroundColor: COLOR_MAPPER.ALTERNATE,
    color: 'white',
    fontSize: 20,
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
    padding: 10,
    textAlign: 'center',
  },
})
