import React from 'react'
import {
  Modal,
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useGetPlanners } from '../../../common/services/planners/useGetPlanners'
import { DrawerNavigationProp } from '@react-navigation/drawer'
import { DrawerStackParamList } from '../NavigationTypes'
import { COLOR_MAPPER } from '../../theme'
import { t } from 'i18next'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

interface RightPlannerSidebarProps {
  isVisible: boolean
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>
  navigation: DrawerNavigationProp<DrawerStackParamList>
}
const RightPlannerSidebar = ({
  isVisible,
  setIsVisible,
  navigation,
}: RightPlannerSidebarProps) => {
  const { data: planners } = useGetPlanners()

  return (
    <View>
      <Modal visible={isVisible} transparent animationType="none">
        <TouchableWithoutFeedback onPress={() => setIsVisible(false)}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <View style={styles.modal}>
          <View style={styles.label}>
            <CustomText weight={FONT_MAPPER.FontBold} style={styles.labelText}>
              {t('searchPlannersLabel')}
            </CustomText>
          </View>
          <FlatList
            data={planners}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('SinglePlanner', { id: item.id })
                  setIsVisible(false)
                }}
                style={styles.planner}
              >
                <CustomText key={index} style={{ fontSize: 17 }}>
                  {item.title}
                </CustomText>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  )
}

export default RightPlannerSidebar

const styles = StyleSheet.create({
  modal: {
    position: 'absolute',
    height: '100%',
    width: '75%',
    right: 0,
    backgroundColor: 'whitesmoke',
    paddingTop: 40,
  },
  planner: {
    width: '100%',
    height: 60,
    alignSelf: 'center',
    borderBottomWidth: 1,
    borderBottomColor: COLOR_MAPPER.ALTERNATE,
    justifyContent: 'center',
    paddingLeft: 10,
  },
  label: {
    width: '100%',
    backgroundColor: COLOR_MAPPER.ALTERNATE,
    height: 50,
    justifyContent: 'center',
    paddingLeft: 5,
  },
  labelText: {
    fontSize: 18,
    color: 'white',
  },
})
