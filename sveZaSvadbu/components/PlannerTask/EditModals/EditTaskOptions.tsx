import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from 'react-native'
import React from 'react'
import { t } from 'i18next'
import { CustomText } from '../../../custom'

interface EditTaskOptionsProps {
  showEditTask: boolean
  title: string
  setShowEditTask: React.Dispatch<React.SetStateAction<boolean>>
  handleDeletePlannerItem: () => void
  handlePriceModal: () => void
  handleDateModal: () => void
}

const EditTaskOptionsModal = ({
  title,
  showEditTask,
  setShowEditTask,
  handleDeletePlannerItem,
  handlePriceModal,
  handleDateModal,
}: EditTaskOptionsProps) => {
  return (
    <Modal visible={showEditTask} transparent={true}>
      <TouchableWithoutFeedback onPress={() => setShowEditTask(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.xContainer}
          onPress={() => setShowEditTask(false)}
        >
          <CustomText style={styles.xStyle}>X</CustomText>
        </TouchableOpacity>
        <CustomText style={styles.titleStyle}>
          {t('task')}: {title}
        </CustomText>

        <TouchableOpacity
          onPress={() => handlePriceModal()}
          style={styles.optionContainer}
        >
          <CustomText style={styles.option}>{t('taskEditPrice')}</CustomText>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleDateModal()}
          style={styles.optionContainer}
        >
          <CustomText style={styles.option}>{t('taskEditDate')}</CustomText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDeletePlannerItem()}
          style={styles.optionContainer}
        >
          <CustomText style={[styles.option, { color: 'red' }]}>
            {t('taskDelete')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

export default EditTaskOptionsModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    width: 270,
    height: 190,
    position: 'absolute',
    top: '35%',
    alignSelf: 'center',
    paddingVertical: 25,
    paddingHorizontal: 15,
  },
  xContainer: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
  xStyle: {
    color: 'red',
    fontSize: 26,
    textAlign: 'center',
    width: '100%',
    height: '100%',
  },
  titleStyle: {
    width: '80%',
    textAlign: 'center',
    fontSize: 18,
    marginBottom: 10,
  },
  optionContainer: {
    width: '80%',
    marginBottom: 5,
  },
  option: {
    fontSize: 16,
    marginTop: 10,
    color: 'black',
  },
})
