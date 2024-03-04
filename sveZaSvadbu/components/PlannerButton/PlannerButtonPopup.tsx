import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native'
import React from 'react'
import YellowInfoPopup from '../YellowInfoPopup/YellowInfoPopup'
import { t } from 'i18next'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const PlannerButtonPopup = ({
  callPlannerModal,
  callTaskModal,
  show,
  setShow,
}: {
  callTaskModal: () => void
  callPlannerModal: () => void
  show: boolean
  setShow: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <Modal visible={show} transparent={true}>
      <TouchableWithoutFeedback onPress={() => setShow(false)}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>
      <View style={styles.redPlusPopup}>
        {/* Yellow rounded infoBtn reusable component*/}
        <YellowInfoPopup
          right={0}
          top={-130}
          infoText={t('plannerPopUpInfo')}
        />

        {/* ADD PLANNER OPTION */}
        <TouchableOpacity style={{ width: '80%' }} onPress={callPlannerModal}>
          <CustomText
            weight={FONT_MAPPER.FontBold}
            style={styles.addPlannerOption}
          >
            {t('plannerAdd')}
          </CustomText>
        </TouchableOpacity>

        {/* ADD TASK OPTION */}
        <TouchableOpacity style={{ width: '80%' }}>
          <CustomText
            weight={FONT_MAPPER.FontBold}
            onPress={callTaskModal}
            style={styles.addTaskOption}
          >
            {t('taskAdd')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  redPlusPopup: {
    width: 200,
    height: 100,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    position: 'absolute',
    bottom: 110,
    right: 40,
  },
  addPlannerOption: {
    color: 'white',
    fontSize: 18,
    padding: 10,
  },
  addTaskOption: {
    color: 'white',
    fontSize: 18,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
})

export default PlannerButtonPopup
