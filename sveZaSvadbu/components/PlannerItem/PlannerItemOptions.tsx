import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import { NewPlannerResponse } from '../../../common/services/planners/types'
import { useDeletePlanner } from '../../../common/services/planners/useDeletePlanner'
import Toast from 'react-native-toast-message'
import YellowInfoPopup from '../YellowInfoPopup/YellowInfoPopup'
import { t } from 'i18next'
import { CustomText } from '../../custom'

interface PlannerOptionsProps {
  planner: NewPlannerResponse
  openEditPlanner: React.Dispatch<React.SetStateAction<boolean>>
  setShowOptions: React.Dispatch<React.SetStateAction<boolean>>
}

const PlannerItemOptions = ({
  planner,
  openEditPlanner,
  setShowOptions,
}: PlannerOptionsProps) => {
  const { mutateAsync: deletePlanner } = useDeletePlanner()

  const handleDeletePlanner = async () => {
    const data = await deletePlanner(planner.id)
    try {
      if (data.status === 200) {
        Toast.show({
          type: 'success',
          text1: t('plannerDeletedSuccessfully'),
        })
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: t('plannerDeletingError'),
      })
    }
  }

  const handleEditPlanner = () => {
    setShowOptions(false)

    setTimeout(() => {
      openEditPlanner(true)
    }, 500)
  }

  return (
    <View style={[styles.content]}>
      {/* DELETE PLANNER  */}
      <View style={{ width: '80%' }}>
        <TouchableOpacity onPress={() => handleDeletePlanner()}>
          <CustomText style={styles.deletePlannerText}>
            {t('plannerDelete')}
          </CustomText>
        </TouchableOpacity>
      </View>

      {/* EDIT PLANNER */}
      <TouchableOpacity style={{ width: '80%' }} onPress={handleEditPlanner}>
        <CustomText style={styles.deletePlannerText}>
          {t('plannerEdit')}
        </CustomText>
      </TouchableOpacity>

      {/* Yellow rounded infoBtn reusable component*/}
      <YellowInfoPopup top={35} right={0} infoText={'tekst info buttona'} />
    </View>
  )
}

export default PlannerItemOptions

const styles = StyleSheet.create({
  content: {
    width: 220,
    height: 80,
    backgroundColor: 'white',
    padding: 10,
  },
  deletePlannerText: {
    color: 'black',
    fontSize: 18,
    marginVertical: 3,
    zIndex: 20,
  },
})
