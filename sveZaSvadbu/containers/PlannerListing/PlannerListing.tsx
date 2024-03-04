import React, { useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import PlannerItem from '../../components/PlannerItem/PlannerItem'
import { useGetPlanners } from '../../../common/services/planners/useGetPlanners'
import Loader from '../../components/Loader'
import { ScrollView } from 'react-native-gesture-handler'

const PlannerListing = () => {
  const { data: planners, isRefetching, isLoading } = useGetPlanners()

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={{ width: '100%' }}>
      <View
        style={{ flex: 1, width: '100%', paddingBottom: '30%', marginTop: 20 }}
      >
        {isRefetching || isLoading ? (
          <Loader />
        ) : (
          planners?.map((planner, index) => (
            <PlannerItem planner={planner} key={planner.id} index={index} />
          ))
        )}
      </View>
    </ScrollView>
  )
}

export default PlannerListing

const styles = StyleSheet.create({})
