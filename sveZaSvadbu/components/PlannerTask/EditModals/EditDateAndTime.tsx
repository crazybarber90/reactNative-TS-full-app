import React, { useState } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  Platform,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { t } from 'i18next'
import { COLOR_MAPPER } from '../../../theme'
import { CustomText } from '../../../custom'

interface EditDateAndTimeModalProps {
  localDate: Date
  showDateModal: boolean
  setShowDateModal: React.Dispatch<React.SetStateAction<boolean>>
  setLocalDate: React.Dispatch<React.SetStateAction<Date>>
  setSplitedDate: React.Dispatch<React.SetStateAction<string>>
  setSplitedTime: React.Dispatch<React.SetStateAction<string>>
  handleChangeTimeAndDate: () => void
}

const EditDateAndTimeModal = ({
  localDate,
  setLocalDate,
  setSplitedDate,
  setSplitedTime,
  showDateModal,
  setShowDateModal,
  handleChangeTimeAndDate,
}: EditDateAndTimeModalProps) => {
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false)
  const [showTimePicker, setShowTimePicker] = useState<boolean>(false)

  //function for formating Date into yyyy-mm-dd
  const formatDate = (rawDate: Date) => {
    const date = new Date(rawDate)
    const year = date.getFullYear()
    let month: string | number = date.getMonth() + 1
    let day: string | number = date.getDate()

    month = month < 10 ? `0${month}` : month
    day = day < 10 ? `0${day}` : day

    return `${year}-${month}-${day}`
  }

  const onChangeDate = ({ type }: { type: any }, date?: Date) => {
    if (type === 'set' && date) {
      const currentDate = date
      Platform.OS === 'android' && setShowDatePicker(false)

      setLocalDate(currentDate)
      setSplitedDate(formatDate(currentDate))
      // close modal only on android
      // prevent closing datePicker modal when change on IOS
    }
  }

  const onTimeChange = ({ type }: { type: any }, time?: Date) => {
    const hours = time?.getHours().toString().padStart(2, '0')
    const minutes = time?.getMinutes().toString().padStart(2, '0')

    const scheduled_time = `${hours}:${minutes}`
    localDate.setHours(Number(hours))
    localDate.setMinutes(Number(minutes))

    if (type === 'set' && time) {
      Platform.OS === 'android' && setShowTimePicker(false)
      setSplitedTime(scheduled_time)

      // close modal only on android
      // prevent closing datePicker modal when change on IOS
    }
  }

  return (
    <Modal visible={showDateModal} transparent={true}>
      <TouchableWithoutFeedback onPress={() => setShowDateModal(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />
      </TouchableWithoutFeedback>
      <View style={styles.container}>
        <View style={styles.buttonContainer}>
          {!showDatePicker && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => !showTimePicker && setShowDatePicker(true)}
            >
              <CustomText>{t('changeDate')}</CustomText>
            </TouchableOpacity>
          )}

          {showDatePicker && (
            <DateTimePicker
              mode="date"
              display="spinner"
              value={localDate}
              onChange={onChangeDate}
            />
          )}
          {showDatePicker && Platform.OS === 'ios' && (
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                padding: 7,
                backgroundColor: 'blue',
              }}
              onPress={() => setShowDatePicker(false)}
            >
              <CustomText
                style={{ width: 100, color: 'white', textAlign: 'center' }}
              >
                {t('submit')}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.buttonContainer}>
          {!showTimePicker && (
            <TouchableOpacity
              style={styles.button}
              onPress={() => !showDatePicker && setShowTimePicker(true)}
            >
              <CustomText>{t('changeTime')}</CustomText>
            </TouchableOpacity>
          )}
          {showTimePicker && (
            <DateTimePicker
              mode="time"
              display="spinner"
              value={localDate}
              is24Hour={true}
              onChange={onTimeChange}
            />
          )}

          {showTimePicker && Platform.OS === 'ios' && (
            <TouchableOpacity
              style={{
                alignSelf: 'center',
                padding: 7,
                backgroundColor: 'blue',
              }}
              onPress={() => setShowTimePicker(false)}
            >
              <CustomText
                style={{ width: 100, color: 'white', textAlign: 'center' }}
              >
                {t('submit')}
              </CustomText>
            </TouchableOpacity>
          )}
        </View>
        {!showDatePicker && !showTimePicker && (
          <TouchableOpacity onPress={() => handleChangeTimeAndDate()}>
            <CustomText style={styles.submit}>{t('taskEditDate')}</CustomText>
          </TouchableOpacity>
        )}
      </View>
    </Modal>
  )
}

export default EditDateAndTimeModal

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'lightgray',
    // width: 340,
    width: '80%',
    // height: 330,
    position: 'absolute',
    top: '30%',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
  buttonContainer: {
    width: '80%',
    marginBottom: 10,
  },
  button: {
    width: '100%',
    backgroundColor: 'whitesmoke',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  submit: {
    backgroundColor: COLOR_MAPPER.ALTERNATE,
    padding: 10,
    fontSize: 18,
    color: 'white',
    alignSelf: 'center',
    marginTop: 40,
    borderRadius: 6,
  },
})
