import React from 'react'
import { SectionList, StyleSheet, Text, View } from 'react-native'
import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  DrawerItem,
} from '@react-navigation/drawer'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { useNavigation } from '@react-navigation/native'
import {
  DrawerScreenNavigationProp,
  HeaderPageScreenNavigationProp,
} from '../NavigationTypes'
import { useGetContent } from '../../../common/services/content/useGetContent'
import { t } from 'i18next'
import { COLOR_MAPPER } from '../../theme'
import * as TaskManager from 'expo-task-manager'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const CustomDrawer = (props: DrawerContentComponentProps) => {
  const navigation = useNavigation<HeaderPageScreenNavigationProp>()
  const drawerNavigation = useNavigation<DrawerScreenNavigationProp>()

  async function logout() {
    navigation.reset({
      routes: [{ name: 'Login' }],
    })
    await TaskManager.unregisterAllTasksAsync()
    await AsyncStorage.clear()
  }
  const { data: content } = useGetContent()

  const DATA =
    content?.map((contentt) => ({
      title: contentt.content_type.name,
      data: contentt.content_type_categories,
    })) ?? []

  const renderTitle = (title: string) => {
    switch (title) {
      case 'Product':
        return t('searchProductsLabel')

      case 'Article':
        return t('chooseWhatToReadLabel')

      default:
        return ''
    }
  }

  return (
    <DrawerContentScrollView {...props}>
      {/* returning all categories in leftDrawer with labels */}
      {/* sectionList is same as .map, flatlist...... */}
      <SectionList
        scrollEnabled={false}
        sections={DATA}
        renderItem={({ item }) => (
          <DrawerItem
            style={{ marginVertical: 0 }}
            label={item.name}
            labelStyle={{
              color: 'black',
              fontFamily: FONT_MAPPER.FontNormal,
              fontSize: 16,
            }}
            onPress={() =>
              // postojao je problem da kada hocemo da okinemo dependency na useeffect u odnosu na categorie ili nesto
              // da promeni state, on ne okida use effect zato sto u pozadini, i dalje stoji screen aktivan,
              // promenom state-a navigacije, brisemo stare screenove, i imamo aktivan samo poslednji screen

              // navigate stackuje screenove, i pamti state u pozadini za svaki state

              // drawerNavigation.navigate(`${item.name}`, {
              //   categorie: item,
              // })

              // reset restartuje state navigacije, i imamo samo poslednji screen
              drawerNavigation.reset({
                routes: [{ name: item.name, params: { categorie: item } }],
              })
            }
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View
            style={[
              styles.labelConatiner,
              title === 'Product' && { backgroundColor: COLOR_MAPPER.PRIMARY },
              title === 'Article' && {
                backgroundColor: COLOR_MAPPER.SECONDARY,
              },
              !renderTitle(title) && { height: 0, padding: 0, margin: 0 },
            ]}
          >
            <CustomText weight={FONT_MAPPER.FontBold} style={styles.label}>
              {renderTitle(title)}
            </CustomText>
          </View>
        )}
        ListFooterComponent={
          <DrawerItem
            style={{
              // borderWidth: 1,
              // borderColor: 'black',
              marginTop: 130,
              backgroundColor: 'red',
              width: '45%',
            }}
            label={t('logOut')}
            labelStyle={{ color: 'white', fontSize: 16, textAlign: 'center' }}
            onPress={() => logout()}
          />
        }
      />

      {/* LOGOUT BUTTON IN LEFT DRAWER */}
    </DrawerContentScrollView>
  )
}

export default CustomDrawer

const styles = StyleSheet.create({
  labelConatiner: {
    justifyContent: 'center',
    paddingLeft: 20,
    width: '100%',
    height: 40,
  },
  label: {
    fontSize: 20,
    color: 'white',
  },
})