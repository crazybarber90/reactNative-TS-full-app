import React, { useState, useEffect } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  TextInput,
  ScrollView,
} from 'react-native'
// import { ScrollView, TextInput } from 'react-native-gesture-handler'
import {
  useEditPlanner,
  EditPlannerProps,
} from '../../../common/services/planners/useEditPlanner'
import Toast from 'react-native-toast-message'
import { Planner } from '../../../common/services/models'
import { t } from 'i18next'
import { COLOR_MAPPER } from '../../theme'
import { TurboModuleRegistry } from 'react-native'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const EditPlannerModal = ({
  planner,
  closeEditPlanner,
  editPlannerState,
}: {
  planner: Planner
  closeEditPlanner: React.Dispatch<React.SetStateAction<boolean>>
  editPlannerState: boolean
}) => {
  const [plannerData, setPlannerData] = useState({
    title: '',
    description: '',
  })
  const [showEdit, setShowEdit] = useState<boolean>(editPlannerState)

  // useEffect(() => {
  //   console.log("USAO U MODALs")
  // }, [showEdit])

  useEffect(() => {
    setPlannerData({ title: planner.title, description: planner.description })
  }, [])

  const { mutateAsync: editPlanner } = useEditPlanner()

  const handleEditPlanner = async (payload: EditPlannerProps) => {
    try {
      const res = await editPlanner(payload)
      if (res.status === 200) {
        closeEditPlanner(false)
        Toast.show({
          type: 'success',
          text1: t('editPlannerSuccess'),
        })
      }
    } catch (error) {
      console.log(error)
      Toast.show({
        type: 'error',
        text1: t('editPlannerError'),
      })
    }
  }

  return (
    <Modal visible transparent>
      <TouchableWithoutFeedback onPress={() => closeEditPlanner(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.plannerModalWrapper}>
        <CustomText weight={FONT_MAPPER.FontBold} style={styles.topText}>
          {t('editPlanner')}
        </CustomText>

        <TouchableOpacity
          style={{ position: 'absolute', top: 5, right: 15 }}
          onPress={() => closeEditPlanner(false)}
        >
          <CustomText style={styles.closeModalBtn}>X</CustomText>
        </TouchableOpacity>

        <TextInput
          placeholderTextColor={'gray'}
          placeholder={t('createPlannerTitle')}
          style={[styles.inputStyle, { marginBottom: 10 }]}
          value={plannerData.title}
          onChangeText={(text) =>
            setPlannerData({ ...plannerData, title: text })
          }
        />
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{ flex: 1, width: '100%', maxHeight: 170, height: 'auto' }}
        >
          <TextInput
            placeholder={t('createPlannerDescription')}
            placeholderTextColor={'gray'}
            multiline={true}
            numberOfLines={4}
            style={[styles.inputStyle, { alignSelf: 'center' }]}
            value={plannerData.description}
            onChangeText={(text) =>
              setPlannerData({ ...plannerData, description: text })
            }
          />
        </ScrollView>

        <TouchableOpacity
          style={{ width: '80%' }}
          onPress={() => handleEditPlanner({ ...plannerData, id: planner.id })}
        >
          <CustomText weight={FONT_MAPPER.FontBold} style={styles.addButton}>
            {t('edit')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default EditPlannerModal

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  plannerModalWrapper: {
    position: 'absolute',
    width: 330,
    alignSelf: 'center',
    top: '25%',
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
  inputStyle: {
    padding: 15,
    width: '80%',
    // maxHeight: 300,r
    backgroundColor: 'white',
    fontSize: 16,
    borderBottomColor: 'lightgray',
    borderBottomWidth: 1,
    fontFamily: FONT_MAPPER.FontNormal,
  },
  addButton: {
    width: '100%',
    backgroundColor: COLOR_MAPPER.ALTERNATE,
    color: 'white',
    alignItems: 'center',
    marginVertical: 20,
    padding: 10,
    fontSize: 20,
    textAlign: 'center',
  },
})
