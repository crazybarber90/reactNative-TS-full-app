import React from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from './NavigationTypes'
import DrawerNavigation from './DrawerNavigation'
import {
  radiusCalculate,
  sendPushNotification,
} from '../LocationUtills/BackgroundGeolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as TaskManager from 'expo-task-manager'

// SCREENS
import Loader from '../components/Loader'
import Login from '../screens/Login'
import Register from '../screens/Register'
import TermsAndConditions from '../screens/TermsAndConditions'
import { PlannerItem } from '../../common/services/planners/types'
const LOCATION_TASK_NAME = 'background-location-task'

const LoginStack = createStackNavigator<RootStackParamList>()

const BACKGROUND_FETCH_TASK = 'background-fetch'

// const LOCATION_TASK_NAME = 'background-location-task'
// const BACKGROUND_FETCH_TASK = 'background-fetch'

// Function which trying to get "locations" from asyncStorage 3 times
// Because its undefined first time
async function tryGetDataWithRetry(
  key: string,
  maxRetries = 5,
  delayMs = 1000,
): Promise<any> {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    const data = await AsyncStorage.getItem(key)
    if (data !== null && data !== undefined) {
      return JSON.parse(data as string)
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs))
  }
  return null
}

// FG TASK
// TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
//   console.log('FG SMRDLJIVI ROOT NAVIGATOR IZ DEFINE TASKA')

//   // getPlannerItems(380).then((data) => console.log('nestooooooo', data))

//   if (error) {
//     console.log('puca error u background initialization taskalsknd', error)
//   } else {
//     // Dovatanje fakat trenutne lokacije unutar zadaće fakat
//     // const location = await Location.getCurrentPositionAsync({})
//     const { locations } = data

//     if (locations) {
//       console.log('DATAAAAAA', data)

//       const locationsData = await tryGetDataWithRetry('locations')

//       console.log(
//         locationsData?.length,
//         'lokacije => locationsData iz FG taska',
//       )

//       locationsData?.map(async (content: PlannerItem) => {
//         if (radiusCalculate(data, content).includes(true)) {
//           // console.log('USAO U LOKACIJU NASUU -> ovde je kontent')

//           const expoPushToken = await AsyncStorage.getItem('expoToken')

//           if (expoPushToken) {
//             console.log('FOREGROUND === ima token, salje notifikaciju')
//             sendPushNotification(expoPushToken, content)
//           } else {
//             console.log('nema tokena u FG tasku')
//           }
//         }
//       })
//     } else {
//       console.log('NEMA DATE U FG TASKU')
//     }
//   }
// })

// // BG TASK
// TaskManager.defineTask(BACKGROUND_FETCH_TASK, async ({ data, error }: any) => {
//   console.log('BG SMRDLJIVI ROOT NAVIGATOR IZ DEFINE TASKA')

//   if (error) {
//     console.log('puca error u background initialization taskalsknd', error)
//   } else {
//     // await deletePlanner(382)
//     //   .then((data) => console.log('IZBRISAO PLANNER', data))
//     //   .catch((err) => console.log('erroriii', err))
//     const { locations } = data

//     console.log('lokacija iz background taska', locations)
//     if (locations) {
//       const locationsData = await tryGetDataWithRetry('locations')

//       console.log(locationsData?.length, 'BACKGROUND LOCATIONS DATA')

//       locationsData?.map(async (content: PlannerItem) => {
//         if (radiusCalculate(data, content).includes(true)) {
//           console.log('BACKGROUND USAO U LOKACIJU NASUU -> ovde je kontent')

//           const expoPushToken = await AsyncStorage.getItem('expoToken')

//           if (expoPushToken) {
//             console.log(' BACKGROUND === ima token, salje notifikaciju')
//             sendPushNotification(expoPushToken, content)
//           } else {
//             console.log(' BACKGROUND nema tokena BG u tasku')
//           }
//         }
//       })
//     } else {
//       console.log('NEMA DATE U BG TASKU')
//     }
//   }
// })

const RootStack = () => {
  // START HANDLE ITEMS WHEN LOGGED -> to fetch all tasks and locations

  const navTheme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent',
    },
  }

  return (
    <NavigationContainer theme={navTheme}>
      <LoginStack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: 'transparent',
          },
          headerTransparent: true,
          headerTitle: '',
          headerLeftContainerStyle: {
            paddingLeft: 20,
          },
        }}
        initialRouteName={'Loader'}
      >
        <LoginStack.Screen name="Loader" component={Loader} />
        <LoginStack.Screen name="Login" component={Login} />
        <LoginStack.Screen name="Register" component={Register} />
        <LoginStack.Screen
          name="Home"
          component={DrawerNavigation}
          options={{ headerShown: false }}
        />
        <LoginStack.Screen
          name="TermsAndConditions"
          component={TermsAndConditions}
        />
      </LoginStack.Navigator>
    </NavigationContainer>
  )
}

export default RootStack
