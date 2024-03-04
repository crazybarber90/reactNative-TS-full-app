import React, { useState } from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Pressable,
  Platform,
  ScrollView,
} from 'react-native'
import { useGetPlanners } from '../../../common/services/planners/useGetPlanners'
import { useGetContent } from '../../../common/services/content/useGetContent'
import DateTimePicker from '@react-native-community/datetimepicker'
import GoogleAutocomplete from '../GoogleAutocomplete/GoogleAutocomplete'
import { GooglePlaceData } from 'react-native-google-places-autocomplete'
import {
  NewTaskProps,
  useCreatePlannerTask,
} from '../../../common/services/planners/useCreatePlannerTask'
import ImagePickerComponent from '../ImagePickerComponent/ImagePickerComponent'
import RNSelectPicker from '../RNSelectPicker/RNSelectPicker'
import { ContentCategorie } from '../../../common/services/models'
import Toast from 'react-native-toast-message'
import KeyboardAware from '../KeyboadAware/KeyboardAware'
import { t } from 'i18next'
import { COLOR_MAPPER } from '../../theme'
import { useNavigation } from '@react-navigation/native'
import { HomePageScreenNavigationProp } from '../../navigator/NavigationTypes'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const AddNewTaskModal = ({
  showTaskModal,
  setShowTaskModal,
}: {
  setShowTaskModal: React.Dispatch<React.SetStateAction<boolean>>
  showTaskModal: boolean
}) => {
  const { data: planners, isRefetching } = useGetPlanners()
  const { data: content } = useGetContent()
  const [showDate, setShowDate] = useState(false)
  const [showTime, setShowTime] = useState(false)
  const [localDate, setLocalDate] = useState(new Date())
  const [openedAutocomplete, setOpenedAutoComplete] = useState(false)

  const { mutateAsync: createTask } = useCreatePlannerTask()
  const navigation = useNavigation<HomePageScreenNavigationProp>()

  const handleCreateTask = async () => {
    const isValid = validateForm()
    try {
      if (isValid) {
        const data = await createTask(taskData)
        setShowTaskModal(false)
        navigation.reset({
          routes: [{ name: 'HomePage' }],
        })
        Toast.show({
          type: 'success',
          text1: t('createTaskSucces'),
        })
      }
    } catch (error) {
      console.error(error)
    }
  }

  const allProductCategories = content && content[0].content_type_categories

  const [taskData, setTaskData] = useState<NewTaskProps>({
    selectedPlanner: 0,
    title: '',
    category_id: 0,
    remark: '',
    imageData: '',
    // scheduled_date: formatDate(localDate),
    // scheduled_time: formatTime(localDate),
    scheduled_date: '',
    scheduled_time: '',
    address: '',
    country: '',
    city: '',
    contact_phone: '',
    contact_email: '',
    price: '',
    currency_id: '',
  })

  const [errors, setErrors] = useState({
    selectedPlannerError: '',
    titleError: '',
    category_idError: '',
    scheduled_dateError: '',
    scheduled_timeError: '',
    fullAddressError: '',
  })

  const {
    selectedPlanner,
    title,
    category_id,
    scheduled_date,
    scheduled_time,
    address,
    country,
    city,
  } = taskData

  const validateForm = () => {
    let minLength = 2
    let selectedPlannerError = ''
    let titleError = ''
    let category_idError = ''
    let scheduled_dateError = ''
    let scheduled_timeError = ''
    // let addressError = "";
    // let countryError = "";
    // let cityError = "";
    let fullAddressError = ''

    const trimTitle = title.trim()

    //CHOOSE PLANNER ERROR CONDITION
    if (selectedPlanner === 0 || selectedPlanner === undefined) {
      selectedPlannerError = t('createTaskPickPlanner')
    }
    //TIITLE ERROR CONDITION
    if (trimTitle.length === 0) {
      titleError = t('createTaskTitle')
    }
    //CHOOSE CATEGORY ERROR CONDITION
    if (category_id === 0 || category_id === undefined) {
      category_idError = t('createTaskPickCategorie')
    }
    //DATE ERROR CONDITION
    if (scheduled_date.length === 0) {
      scheduled_dateError = t('createTaskPickDate')
    }
    //TIME ERROR CONDITION
    if (scheduled_time.length === 0) {
      scheduled_timeError = t('createTaskPickTime')
    }
    //ADDRESS ERROR CONDITION
    if (address === '' || city === '' || country === '') {
      fullAddressError = t('createTaskPickLocation')
    }

    if (
      selectedPlannerError ||
      titleError ||
      category_idError ||
      scheduled_dateError ||
      scheduled_timeError ||
      fullAddressError
    ) {
      setErrors({
        selectedPlannerError,
        titleError,
        category_idError,
        scheduled_dateError,
        scheduled_timeError,
        fullAddressError,
      })
      return false
    }
    return true
  }

  const toggleDatePicker = () => setShowDate(!showDate)
  const toggleTimePicker = () => setShowTime(!showTime)

  //If you want to use formatDate or formatTime for initialState of taskData
  //Use normal function(not arrow) because of hoisting availability
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

  const confirmIosDate = () => {
    setTaskData({ ...taskData, scheduled_date: formatDate(localDate) })
    toggleDatePicker()
  }

  const onChangeDate = ({ type }: { type: any }, date?: Date) => {
    if (type === 'set' && date) {
      const currentDate = date
      if (Platform.OS === 'android') {
        toggleDatePicker()
      }
      setLocalDate(currentDate)

      if (Platform.OS === 'android') {
        setTaskData({ ...taskData, scheduled_date: formatDate(currentDate) })
      }
    } else toggleDatePicker()
  }

  const onTimeChange = ({ type }: { type: any }, time?: Date) => {
    const hours = time?.getHours().toString().padStart(2, '0')
    const minutes = time?.getMinutes().toString().padStart(2, '0')

    const scheduled_time = `${hours}:${minutes}`
    localDate.setHours(Number(hours))
    localDate.setMinutes(Number(minutes))

    if (type === 'set' && time) {
      toggleTimePicker()
      setTaskData({
        ...taskData,
        scheduled_time: scheduled_time,
      })
    } else toggleTimePicker()
  }

  const handleAddress = (data: GooglePlaceData) => {
    const address = data.description.split(',')

    setTaskData({
      ...taskData,
      address: address[0].trim(),
      city: address[1] ? address[1].trim() : '',
      country: address[2] ? address[2].trim() : '',
    })

    setOpenedAutoComplete(false)
  }

  const plannerPickerItems = planners?.map((planner) => {
    return {
      key: planner.id,
      label: planner.title,
      value: planner.id,
    }
  })

  const categoriePickerItems = allProductCategories?.map(
    (categorie: ContentCategorie) => {
      return {
        key: categorie.id,
        label: categorie.name,
        value: categorie.id,
      }
    },
  )

  // NEED'S TO BE REFACTORED to small components
  return (
    <Modal visible={showTaskModal} transparent={true}>
      {/* Blur when open task modal */}
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' }} />

      {/* Wrapper */}
      <View
        style={[
          styles.TaskModalWrapper,
          openedAutocomplete && { height: '70%', top: '10%' },
          Platform.OS === 'ios' && { height: '80%', top: '10%' },
        ]}
      >
        {openedAutocomplete ? (
          <KeyboardAware
            keyboardVerticalOffset={0}
            style={{ height: '100%', width: '100%' }}
          >
            <View
              style={{
                width: '100%',
                alignSelf: 'center',
                height: '100%',
              }}
            >
              <GoogleAutocomplete handleAddress={handleAddress} />
            </View>
          </KeyboardAware>
        ) : (
          // {/* </KeyboardAvoidingView> */}
          <ScrollView style={{ width: '100%', height: '100%' }}>
            <KeyboardAware
              keyboardVerticalOffset={0}
              style={{ width: '100%', height: '100%', gap: 10 }}
            >
              {/* close modal btn */}
              <TouchableOpacity
                style={styles.closeButtonContainer}
                onPress={() => setShowTaskModal(false)}
              >
                <CustomText style={styles.closeModalBtn}>X</CustomText>
              </TouchableOpacity>

              <CustomText weight={FONT_MAPPER.FontBold} style={styles.topText}>
                {t('createTask')}
              </CustomText>

              {/* ********** Planner Picker  ********** */}
              {planners && (
                <View
                  style={[
                    styles.inputContainerStyle,
                    {
                      borderBottomColor: errors.selectedPlannerError
                        ? 'red'
                        : 'black',
                    },
                    Platform.OS === 'ios' && { marginTop: 20 },
                  ]}
                >
                  {planners && (
                    <RNSelectPicker
                      handleChange={(value) =>
                        setTaskData({ ...taskData, selectedPlanner: value })
                      }
                      value={taskData.selectedPlanner}
                      pickerItems={plannerPickerItems}
                      label={t('createTaskPickPlanner')}
                      error={errors.selectedPlannerError}
                    />
                  )}
                </View>
              )}

              {/* TASK TITLE */}
              <View style={styles.inputContainerStyle}>
                <TextInput
                  placeholder={t('createTaskTitle')}
                  value={taskData.title}
                  onChangeText={(text) =>
                    setTaskData({ ...taskData, title: text })
                  }
                  style={[
                    styles.inputStyle,
                    errors.titleError ? { borderBottomColor: 'red' } : null,
                  ]}
                  placeholderTextColor={errors.titleError ? 'red' : 'black'}
                />
              </View>

              {/* PICKER FOR CATEGORIES */}
              {allProductCategories && (
                <View
                  style={[
                    styles.inputContainerStyle,
                    {
                      borderBottomColor: errors.category_idError
                        ? 'red'
                        : 'black',
                    },
                  ]}
                >
                  {allProductCategories && (
                    <RNSelectPicker
                      handleChange={(value) =>
                        setTaskData({ ...taskData, category_id: value })
                      }
                      pickerItems={categoriePickerItems}
                      label={t('createTaskPickCategorie')}
                      value={taskData.category_id}
                      error={errors.category_idError}
                    />
                  )}
                </View>
              )}

              {/* DATE TIME PICKER */}
              {showDate && (
                <DateTimePicker
                  mode="date"
                  display="spinner"
                  value={localDate}
                  onChange={onChangeDate}
                />
              )}

              {showTime && (
                <DateTimePicker
                  mode="time"
                  display="spinner"
                  value={localDate}
                  is24Hour={true}
                  onChange={onTimeChange}
                />
              )}

              {showDate && Platform.OS === 'ios' && (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-around',
                  }}
                >
                  <TouchableOpacity onPress={confirmIosDate}>
                    <CustomText
                      style={{
                        backgroundColor: 'green',
                        color: 'white',
                        padding: 6,
                      }}
                    >
                      {t('submit')}
                    </CustomText>
                  </TouchableOpacity>

                  <TouchableOpacity onPress={toggleDatePicker}>
                    <CustomText
                      style={{
                        backgroundColor: 'red',
                        color: 'white',
                        padding: 6,
                      }}
                    >
                      {t('cancel')}
                    </CustomText>
                  </TouchableOpacity>
                </View>
              )}

              {/* DATE PICKER */}
              <View
                style={[
                  {
                    flexDirection: 'row',
                    width: '85%',
                    alignSelf: 'center',
                    justifyContent: 'space-between',
                  },
                  // styles.inputContainerStyle,
                ]}
              >
                <View
                  style={[
                    styles.inputContainerStyle,
                    { width: '45%', borderBottomWidth: 0 },
                  ]}
                >
                  <Pressable onPress={toggleDatePicker}>
                    <TextInput
                      style={[
                        styles.inputStyle,
                        {
                          backgroundColor: COLOR_MAPPER.ALTERNATE,
                          color: 'white',
                          textAlign: 'center',
                        },
                        errors.scheduled_dateError
                          ? { borderBottomColor: 'red' }
                          : null,
                      ]}
                      placeholder={t('createTaskPickDate')}
                      value={localDate.toDateString()}
                      editable={false}
                      onPressIn={toggleDatePicker}
                    />
                  </Pressable>
                  {errors.scheduled_dateError && (
                    <CustomText style={{ color: 'red', fontSize: 12 }}>
                      {errors.scheduled_dateError}
                    </CustomText>
                  )}
                </View>

                {/* TIME PICKER */}
                <View
                  style={[
                    styles.inputContainerStyle,
                    { width: '45%', borderBottomWidth: 0 },
                  ]}
                >
                  <Pressable onPress={toggleTimePicker}>
                    <TextInput
                      style={[
                        styles.inputStyle,
                        {
                          backgroundColor: COLOR_MAPPER.ALTERNATE,
                          color: 'white',
                          textAlign: 'center',
                        },
                        errors.scheduled_timeError
                          ? { borderBottomColor: 'red' }
                          : null,
                      ]}
                      placeholder={t('createTaskPickTime')}
                      value={localDate.toLocaleTimeString()}
                      editable={false}
                      onPressIn={toggleTimePicker}
                    />
                  </Pressable>
                  {errors.scheduled_dateError && (
                    <CustomText style={{ color: 'red', fontSize: 12 }}>
                      {errors.scheduled_timeError}
                    </CustomText>
                  )}
                </View>
              </View>

              {/* Google Autocomplete */}
              {!openedAutocomplete ? (
                <View>
                  <TouchableOpacity
                    onPress={() => setOpenedAutoComplete(true)}
                    style={styles.inputContainerStyle}
                  >
                    <CustomText
                      style={[
                        styles.inputStyle,
                        { fontSize: 16 },
                        errors.fullAddressError ? { color: 'red' } : null,
                      ]}
                    >
                      {taskData.address === ''
                        ? t('createTaskPickLocation')
                        : `${taskData.address}, ${taskData.city}, ${taskData.country}`}
                    </CustomText>
                  </TouchableOpacity>
                  {errors.fullAddressError && (
                    <CustomText
                      style={{
                        width: '85%',
                        alignSelf: 'center',
                        color: 'red',
                        fontSize: 12,
                      }}
                    >
                      {t('taskAddressError')}
                    </CustomText>
                  )}
                </View>
              ) : (
                <View
                  style={{
                    width: '90%',
                    alignSelf: 'center',
                    height: openedAutocomplete ? 200 : 50,
                  }}
                >
                  <GoogleAutocomplete handleAddress={handleAddress} />
                </View>
              )}

              {/* Description */}
              <View style={styles.inputContainerStyle}>
                <TextInput
                  style={styles.inputStyle}
                  multiline
                  placeholder={t('createTaskDescription')}
                  value={taskData.remark}
                  onChangeText={(text) =>
                    setTaskData({ ...taskData, remark: text })
                  }
                />
              </View>

              <View
                style={[
                  styles.inputContainerStyle,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingBottom: 5,
                  },
                ]}
              >
                <View style={{ height: '100%', width: '48%' }}>
                  <TextInput
                    style={[styles.inputStyle, { paddingVertical: 13 }]}
                    keyboardType="numeric"
                    placeholder="0.00"
                    textAlign="center"
                    value={taskData.price}
                    onChangeText={(text) =>
                      setTaskData({ ...taskData, price: text })
                    }
                  />
                </View>
                <View
                  style={{
                    height: '100%',
                    width: '48%',
                  }}
                >
                  <RNSelectPicker
                    handleChange={(value) =>
                      setTaskData({ ...taskData, currency_id: value })
                    }
                    value={taskData.currency_id}
                    pickerItems={[
                      { label: 'RSD', value: 1 },
                      { label: 'EUR', value: 2 },
                    ]}
                    label={t('pickCurrency')}
                  />
                </View>
              </View>
              {/* Component for image picker */}
              <ImagePickerComponent
                taskData={taskData}
                setTaskData={setTaskData}
              />
              <View
                style={[
                  styles.inputContainerStyle,
                  {
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    borderBottomWidth: 0,
                  },
                ]}
              >
                <TextInput
                  placeholder={t('enterNumber')}
                  textAlign="center"
                  keyboardType="numeric"
                  style={[
                    styles.inputStyle,
                    {
                      width: '48%',
                      borderBottomColor: 'black',
                      borderBottomWidth: 1,
                    },
                  ]}
                  value={taskData.contact_phone}
                  onChangeText={(text) =>
                    setTaskData({ ...taskData, contact_phone: text })
                  }
                />
                <TextInput
                  placeholder={t('enterEmail')}
                  textAlign="center"
                  style={[
                    styles.inputStyle,
                    {
                      width: '48%',
                      borderBottomColor: 'black',
                      borderBottomWidth: 1,
                    },
                  ]}
                  value={taskData.contact_email}
                  onChangeText={(text) =>
                    setTaskData({ ...taskData, contact_email: text })
                  }
                />
              </View>

              {/* <Button title="Dodaj task" onPress={handleCreateTask} /> */}
              <TouchableOpacity
                onPress={handleCreateTask}
                style={[
                  {
                    width: '87%',
                    alignSelf: 'flex-start',
                    marginLeft: 25,
                    backgroundColor: COLOR_MAPPER.ALTERNATE,
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: 10,
                  },
                  Platform.OS === 'ios' && { marginTop: 20 },
                ]}
              >
                <CustomText
                  weight={FONT_MAPPER.FontBold}
                  style={{ color: 'white', fontSize: 18 }}
                >
                  {t('taskAdd')}
                </CustomText>
              </TouchableOpacity>
            </KeyboardAware>
          </ScrollView>
        )}
      </View>
    </Modal>
  )
}

export default AddNewTaskModal

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  TaskModalWrapper: {
    position: 'absolute',
    width: '90%',
    height: '95%',
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignSelf: 'center',
    top: '2%',
    backgroundColor: 'whitesmoke',
    alignItems: 'center',
    zIndex: 20,
  },
  closeButtonContainer: {
    position: 'absolute',
    right: 15,
    top: -10,
    padding: 5,
    zIndex: 10,
  },
  closeModalBtn: {
    color: 'red',
    fontSize: 24,
  },
  topText: {
    fontSize: 20,
    alignSelf: 'center',
  },
  inputContainerStyle: {
    width: '85%',
    alignSelf: 'center',
    paddingTop: 5,
    borderBottomColor: 'black',
    borderBottomWidth: 1,
  },
  inputStyle: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    width: '100%',
    fontFamily: FONT_MAPPER.FontNormal,
    // marginVertical: 10,
    // fontSize: 14,
    backgroundColor: 'white',
    // borderBottomWidth: 1,
    // borderBottomColor: 'black',
  },
})
