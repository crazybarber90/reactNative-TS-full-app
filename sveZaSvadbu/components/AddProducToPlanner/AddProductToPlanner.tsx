import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import PlannerImg from '../../assets/whitePlanner.svg'
import { FlatList } from 'react-native-gesture-handler'
import YellowInfoPopup from '../YellowInfoPopup/YellowInfoPopup'
import { useGetPlanners } from '../../../common/services/planners/useGetPlanners'
import { useAddProductToPlanner } from '../../../common/services/products/useAddProductToPlanner'
import Toast from 'react-native-toast-message'
import { t } from 'i18next'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

interface AddProtucToPlannerProps {
  showAddProductModal: boolean
  setShowAddProductModal: React.Dispatch<React.SetStateAction<boolean>>
  contentId: number
}
const AddProductToPlanner = ({
  showAddProductModal,
  setShowAddProductModal,
  contentId,
}: AddProtucToPlannerProps) => {
  const { data: planners, isRefetching, isLoading } = useGetPlanners()
  const { mutateAsync: linkProductToPlanner } = useAddProductToPlanner()

  const handleAddProductToPlanner = async (plannerId: number) => {
    try {
      const data = await linkProductToPlanner({
        plannerId: plannerId,
        contentId: contentId,
      })

      if (data.status === 200) {
        Toast.show({
          type: 'success',
          text1: t('addProductToPlannerSucces'),
        })
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: t('addProductToPlannerError'),
      })
      console.error(error.message)
    }
  }

  return (
    <View style={styles.circleWrapper}>
      <TouchableOpacity
        style={{
          width: '100%',
          height: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onPress={() => setShowAddProductModal(!showAddProductModal)}
      >
        <PlannerImg height={45} width={45} />
      </TouchableOpacity>

      <Modal visible={showAddProductModal} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setShowAddProductModal(false)}>
          <View style={{ flex: 1 }}></View>
        </TouchableWithoutFeedback>

        <View style={styles.modalWrapper}>
          <CustomText weight={FONT_MAPPER.FontBold} style={styles.title}>
            {t('addProductToPlanner')}
          </CustomText>
          <FlatList
            scrollEnabled={false}
            data={planners}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => handleAddProductToPlanner(item.id)}
              >
                <CustomText style={styles.singlePlannerTitle}>
                  {item.title}
                </CustomText>
              </TouchableOpacity>
            )}
          />

          <YellowInfoPopup
            top={35}
            right={0}
            infoText={'Dodaj proizvod u planer'}
          />
        </View>
      </Modal>
    </View>
  )
}

export default AddProductToPlanner

const styles = StyleSheet.create({
  circleWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    width: 85,
    height: 85,
    borderRadius: 50,
    backgroundColor: 'pink',
  },
  modalWrapper: {
    width: 250,
    minHeight: 100,
    height: 'auto',
    backgroundColor: 'lightblue',
    position: 'absolute',
    bottom: 110,
    left: 60,
    padding: 15,
  },
  title: {
    fontSize: 18,
    marginBottom: 5,
  },
  singlePlannerTitle: {
    fontSize: 16,
    marginVertical: 3,
  },
})
