import React, { useState, useEffect } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useGetPlannerItems } from '../../../common/services/planners/useGetPlannerItems'
import Loader from '../../components/Loader'
import PlannerTask from '../../components/PlannerTask/PlannerTask'
import { t } from 'i18next'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const SinglePlanner = ({ route }: { route: any }) => {
  const { id } = route.params

  //singlePlanner is array of tasks
  //GETTING TASKS FROM PROPER PLANNER BY SENDING ID
  const {
    data: singlePlanner,
    refetch: refetchPlannerItem,
    isRefetching,
    isLoading,
  } = useGetPlannerItems(id)

  const [activePrice, setActivePrice] = useState({ rsd: 0, eur: 0 })

  const totalPrice = () => {
    let rsdTotal = 0
    let eurTotal = 0

    singlePlanner?.forEach((planner) => {
      if (planner.calculate_price === 'yes') {
        if (planner?.currency?.id === 1) {
          rsdTotal += Number(planner.price)
        } else {
          eurTotal += Number(planner.price)
        }
      }
    })

    setActivePrice({ rsd: rsdTotal, eur: eurTotal })
  }

  useEffect(() => {
    refetchPlannerItem()
  }, [route])

  useEffect(() => {
    totalPrice()
  }, [singlePlanner])

  // Show loader when refetching or loading plannerItems when route is changed
  if (isRefetching || isLoading) {
    return <Loader />
  }
  return (
    <View style={{ flex: 1 }}>
      <View style={{ paddingBottom: 150 }}>
        {singlePlanner && singlePlanner.length !== 0 && (
          <CustomText style={styles.title}>
            {singlePlanner[0].planner_title}
          </CustomText>
        )}
        {singlePlanner && singlePlanner.length !== 0 && (
          <FlatList
            data={singlePlanner}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => <PlannerTask task={item} />}
          />
        )}
      </View>
      <View style={styles.priceTab}>
        <CustomText style={styles.priceText}>{t('totalPrice')}:</CustomText>
        <View>
          <CustomText style={styles.priceText}>
            {activePrice.eur.toString()} EUR
          </CustomText>
          <CustomText style={styles.priceText}>
            {activePrice.rsd.toString()} RSD
          </CustomText>
        </View>
      </View>
    </View>
  )
}

export default SinglePlanner

const styles = StyleSheet.create({
  title: {
    fontFamily: FONT_MAPPER.FontBold,
    fontSize: 20,
    paddingLeft: 5,
    marginBottom: 20,
  },
  priceTab: {
    position: 'absolute',
    bottom: 0,
    width: '97%',
    height: 80,
    alignSelf: 'center',
    backgroundColor: 'pink',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    flexDirection: 'row',
    paddingTop: 20,
    gap: 10,
  },
  priceText: {
    fontSize: 18,
    fontFamily: FONT_MAPPER.FontBold,
    marginLeft: 10,
    color: 'white',
  },
})
