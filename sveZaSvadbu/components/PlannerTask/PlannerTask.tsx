import {
  Image,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import React, { useEffect, useState } from 'react'
import { PlannerItem } from '../../../common/services/planners/types'
import GoogleMap from '../GoogleMap/GoogleMap'
import { useChangeCalculatePrice } from '../../../common/services/planners/useChangeCalculatePrice'
import { Entypo } from '@expo/vector-icons'
import { useDeletePlannerItem } from '../../../common/services/planners/useDeletePlannerItem'
import { useChangePlannerItemDate } from '../../../common/services/planners/useChangePlannerItemDate'
import Toast from 'react-native-toast-message'
import EditTaskOptionsModal from './EditModals/EditTaskOptions'
import EditProductTaskOptionsModal from './EditModals/EditProductTaskOptions'
import EditPriceAndCurrencyModal from './EditModals/EditPriceAndCurrency'
import EditDateAndTimeModal from './EditModals/EditDateAndTime'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const PlannerTask = ({ task }: { task: PlannerItem }) => {
  const [showEditProductPrice, setShowEditProductPrice] =
    useState<boolean>(false)
  const [showEditTask, setShowEditTask] = useState<boolean>(false)
  const [showPriceModa, setShowPriceModal] = useState<boolean>(false)
  const [showDateModal, setShowDateModal] = useState<boolean>(false)
  const [localDate, setLocalDate] = useState(new Date())

  const [splitedDate, setSplitedDate] = useState<string>('')
  const [splitedTime, setSplitedTime] = useState<string>('')

  const [date, setDate] = useState<string>('')
  const [time, setTime] = useState<string>('')
  const [calculatePlannerPrice, setCalculatePlannerPrice] =
    useState<boolean>(false)

  // Actions from react query
  const { mutateAsync: changePrice } = useChangeCalculatePrice()
  const { mutateAsync: deletePlannerItem } = useDeletePlannerItem()
  const { mutateAsync: changePlannerDate } = useChangePlannerItemDate()

  // DELETE PLANNER FUNCTION
  const handleDeletePlannerItem = async () => {
    const data = await deletePlannerItem({
      plannerItemId: task.id,
      plannerId: task.planner_id,
    })
    try {
      if (data.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Uspešno si obrisao zadatak',
        })
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Došlo je do greške pri brisanju zadatka',
      })
    }
  }

  // SUBMIT EDIT TIME AND DATE MODAL
  const handleChangeTimeAndDate = async () => {
    const payload = {
      plannerItemId: task.id,
      scheduled_date: `${splitedDate} ${splitedTime}:00`,
    }
    try {
      const data = await changePlannerDate(payload)
      if (data.status === 200) {
        Toast.show({
          type: 'success',
          text1: 'Uspešno si izmenio vreme zadatka',
        })
      }
      setShowDateModal(false)
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Došlo je do greške pri izmeni zadatka',
      })
    }
  }

  // is product or task
  const isProduct = () => (task.content_id ? true : false)

  // funckija za izdvajanje datuma i vremena, jer task.scheduled_date.datetime vraca oblik: 22.11.2023 16:00:00
  useEffect(() => {
    if (task.scheduled_date) {
      let [date, time] = task.scheduled_date.datetime.split(' ')
      const splitTime = time.split('')
      const sliceTime = splitTime.slice(0, 5)
      const newTime = sliceTime.join('')
      setDate(date)
      setTime(newTime)
    }

    if (task.calculate_price === 'yes') {
      setCalculatePlannerPrice(true)
    } else {
      setCalculatePlannerPrice(false)
    }
  }, [task])

  // SWICH BUTTON  ( DO CALCULATE PRICE OR NO )
  const handleSwitch = async (calculate: 'yes' | 'no') => {
    try {
      const payload = {
        plannerItemId: task?.id,
        value: calculate === 'yes' ? 0 : 1,
      }
      setCalculatePlannerPrice(() => (calculate === 'yes' ? false : true))
      await changePrice(payload)
    } catch (error) {
      console.log(error)
    }
  }

  // console.log("TASK IZ TASKA", task)
  // PRICE HANDLING MODALS FUNCTION
  const handlePriceModal = () => {
    setShowEditProductPrice(false)
    setShowEditTask(false)
    setShowPriceModal(true)
  }

  // useEffect that spliting time from Backend and set splited states
  // If you save without changes or change only one parameter
  useEffect(() => {
    const splitDateAndTIme = () => {
      const splited = task?.scheduled_date?.datetime.split(' ')
      setSplitedDate(splited ? splited[0] : '')
      setSplitedTime(splited ? splited[1].slice(0, -3) : '')
    }

    splitDateAndTIme()
  }, [])

  //CHANGE DATE HANDLING MODALS
  const handleDateModal = () => {
    setShowEditTask(false)
    setShowDateModal(true)
  }

  // THIS EFFECT WILL SET INITIAL VALUE OF TIME AND DATE FROM BACKEND
  useEffect(() => {
    if (task.scheduled_date) {
      const initialDateTime = task.scheduled_date.datetime
      const initialDate = new Date(
        initialDateTime.replace(
          /(\d{2}).(\d{2}).(\d{4}) (\d{2}):(\d{2}):(\d{2})/,
          '$3-$2-$1T$4:$5:$6',
        ),
      )

      setLocalDate(initialDate)
    }

    if (task.calculate_price === 'yes') {
      setCalculatePlannerPrice(true)
    } else {
      setCalculatePlannerPrice(false)
    }
  }, [task])

  // triggerLocation(task)
  // triggerLocation(undefined)

  return (
    <View style={styles.container}>
      {/* TASK MODAL */}
      <EditTaskOptionsModal
        title={task.title as string}
        handleDateModal={handleDateModal}
        handleDeletePlannerItem={handleDeletePlannerItem}
        handlePriceModal={handlePriceModal}
        setShowEditTask={setShowEditTask}
        showEditTask={showEditTask}
      />

      {/* PRODUCT MODAL */}
      <EditProductTaskOptionsModal
        title={task.content_title as string}
        showEditProductPrice={showEditProductPrice}
        setShowEditProductPrice={setShowEditProductPrice}
        handlePriceModal={handlePriceModal}
        handleDeletePlannerItem={handleDeletePlannerItem}
      />

      {/* PRICE AND CURRENCY MODAL  */}
      <EditPriceAndCurrencyModal
        task={task}
        setShowPriceModal={setShowPriceModal}
        showPriceModal={showPriceModa}
      />

      {/* CHANGE DATE MODAL */}

      <EditDateAndTimeModal
        showDateModal={showDateModal}
        setShowDateModal={setShowDateModal}
        setSplitedTime={setSplitedTime}
        setSplitedDate={setSplitedDate}
        localDate={localDate}
        setLocalDate={setLocalDate}
        handleChangeTimeAndDate={handleChangeTimeAndDate}
      />

      <View style={styles.title}>
        <CustomText weight={FONT_MAPPER.FontBold} style={styles.titleText}>
          {isProduct() ? task.content_title : task.title}
        </CustomText>
        <TouchableOpacity
          onPress={() =>
            isProduct() ? setShowEditProductPrice(true) : setShowEditTask(true)
          }
        >
          <Entypo name="dots-three-vertical" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', gap: 20 }}>
        <Image
          source={
            isProduct() ? { uri: task.content_image } : { uri: task.image }
          }
          height={130}
          style={styles.imageAndMap}
        />
        <View style={styles.imageAndMap}>
          <GoogleMap coordinates={task.locations} />
        </View>
        <View style={{ gap: 10, justifyContent: 'space-between' }}>
          {!isProduct() && (
            <View>
              <CustomText weight={FONT_MAPPER.FontBold} style={styles.infoText}>
                {date}
              </CustomText>
              <CustomText weight={FONT_MAPPER.FontBold} style={styles.infoText}>
                {time}
              </CustomText>
            </View>
          )}
          {task.price && (
            <View>
              <CustomText weight={FONT_MAPPER.FontBold} style={styles.infoText}>
                {Number(task?.price).toLocaleString()} {task?.currency?.name}
              </CustomText>
              <View style={{ alignItems: 'flex-start' }}>
                <Switch
                  value={calculatePlannerPrice}
                  onValueChange={() => handleSwitch(task.calculate_price)}
                />
              </View>
            </View>
          )}
        </View>
      </View>
      <View>
        <CustomText>{task.remark}</CustomText>
      </View>
    </View>
  )
}

export default PlannerTask

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    gap: 20,
    borderBottomWidth: 0.7,
    borderBottomColor: 'black',
    paddingBottom: 20,
    paddingTop: 10,
  },
  title: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 18,
  },
  imageAndMap: {
    width: '33%',
    height: 130,
  },
  infoText: {
    fontSize: 16,
  },
})
