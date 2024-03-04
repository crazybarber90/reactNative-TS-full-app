// import 'expo-dev-client'
import 'react-native-gesture-handler'
import React from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { SafeAreaView } from 'react-native-safe-area-context'
import RootStack from './navigator/RootNavigator'
import Toast from 'react-native-toast-message'
import './i18n'
import * as TaskManager from 'expo-task-manager'

import { StatusBar } from 'react-native'
import {
  radiusCalculate,
  sendPushNotification,
} from './LocationUtills/BackgroundGeolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { PlannerItem } from '../common/services/planners/types'
import { deletePlanner } from '../common/services/planners/useDeletePlanner'

const queryClient = new QueryClient()
const LOCATION_TASK_NAME = 'background-location-task'
const BACKGROUND_FETCH_TASK = 'background-fetch'

// Function which trying to get "locations" from asyncStorage 3 times
// Because its undefined first time
async function tryGetDataWithRetry(key: string, maxRetries = 3, delayMs = 1000): Promise<any> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const data = await AsyncStorage.getItem(key);
    if (data !== null && data !== undefined) {
      return JSON.parse(data as string);
    }
    await new Promise(resolve => setTimeout(resolve, delayMs));
  }
  return null;
}

// // FG TASK
TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  console.log('FG ROOT NAVIGATOR IZ DEFINE TASKA')

  // getPlannerItems(380).then((data) => console.log('nestooooooo', data))

  if (error) {
    console.log('puca error u background initialization taskalsknd', error)
  } else {
    // Dovatanje fakat trenutne lokacije unutar zadaće fakat
    // const location = await Location.getCurrentPositionAsync({})
    const { locations } = data

    if (locations) {
      console.log('DATAAAAAA', data)

      const locationsData = await tryGetDataWithRetry("locations")

      console.log(locationsData?.length, 'lokacije => locationsData iz FG taska')

      locationsData?.map(async (content: PlannerItem) => {
        if (radiusCalculate(data, content).includes(true)) {
          console.log('USAO U LOKACIJU NASUU -> ovde je kontent')

          const expoPushToken = await AsyncStorage.getItem('expoToken')

          if (expoPushToken) {
            console.log('FOREGROUND === ima token, salje notifikaciju')
            sendPushNotification(expoPushToken, content)
          } else {
            console.log('nema tokena u FG tasku')
          }
        }
      })
    } else {
      console.log('NEMA DATE U FG TASKU')
    }
  }
},
)

// // BG TASK
TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ data, error }: any) => {

  console.log('BG ROOT NAVIGATOR IZ DEFINE TASKA')

  if (error) {
    console.log('puca error u background initialization taskalsknd', error)
  } else {
    // await deletePlanner(382)
    //   .then((data) => console.log('IZBRISAO PLANNER', data))
    //   .catch((err) => console.log('erroriii', err))
    const { locations } = data

    console.log('lokacija iz background taska', locations)
    if (locations) {

      const locationsData = await tryGetDataWithRetry("locations")

      console.log(locationsData?.length, 'BACKGROUND LOCATIONS DATA')

      locationsData?.map(async (content: PlannerItem) => {
        if (radiusCalculate(data, content).includes(true)) {
          console.log('BACKGROUND USAO U LOKACIJU NASUU -> ovde je kontent')

          const expoPushToken = await AsyncStorage.getItem('expoToken')

          if (expoPushToken) {
            console.log(' BACKGROUND === ima token, salje notifikaciju')
            sendPushNotification(expoPushToken, content)
          } else {
            console.log(' BACKGROUND nema tokena BG u tasku')
          }
        }
      })
    } else {
      console.log('NEMA DATE U BG TASKU')
    }
  }
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="dark-content" backgroundColor="white" />
        <RootStack />
        <Toast />
      </SafeAreaView>
    </QueryClientProvider>
  )
}
