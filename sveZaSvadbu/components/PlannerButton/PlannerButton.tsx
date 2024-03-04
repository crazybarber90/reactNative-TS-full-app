import React, { useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import PlannerButtonPopup from './PlannerButtonPopup'
import AddNewPlannerModal from '../Modals/AddNewPlannerModal'
// import AddNewTaskModal from '../Modals/AddNewTaskModal'
import AddNewTaskModal from '../Modals/AddNewTaskModal'
import { CustomText } from '../../custom'

const PlannerButton = () => {
  const [show, setShow] = useState(false)
  const [showPlannerModal, setShowPlannerModal] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)

  const callPlannerModal = () => {
    setShowPlannerModal(true)
    setShow(false)
  }

  const callTaskModal = () => {
    setShowTaskModal(true)
    setShow(false)
  }

  // console.log("showPlannerModal", showPlannerModal)
  // console.log("showTaskModal", showTaskModal)
  return (
    <>
      {/* ADD NEW PLANNER MODAL */}
      {showPlannerModal && (
        <AddNewPlannerModal
          setShowPlannerModal={setShowPlannerModal}
          showPlannerModal={showPlannerModal}
        />
      )}
      {/* ADD NE TASK MODAL */}
      {showTaskModal && (
        <AddNewTaskModal
          setShowTaskModal={setShowTaskModal}
          showTaskModal={showTaskModal}
        />
      )}

      {/* RED PLUS POPUP */}
      <PlannerButtonPopup
        show={show}
        setShow={setShow}
        callPlannerModal={callPlannerModal}
        callTaskModal={callTaskModal}
      />

      {/* RED PLUS */}
      <TouchableOpacity
        style={{
          height: 85,
          width: 85,
          bottom: 20,
          right: 20,
          position: 'absolute',
        }}
        onPress={() => setShow(!show)}
      >
        <View style={styles.redPlusBtn}>
          <CustomText style={styles.whiteCross}>+</CustomText>
        </View>
      </TouchableOpacity>
    </>
  )
}

export default PlannerButton

const styles = StyleSheet.create({
  redPlusBtn: {
    // height: 85,
    // width: 85,
    // bottom: 20,
    // right: 20,
    // position: 'absolute',
    backgroundColor: 'red',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  whiteCross: {
    fontSize: 48,
    color: 'white',
    bottom: 2,
  },
})
