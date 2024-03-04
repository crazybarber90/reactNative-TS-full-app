import React, { useState, useEffect } from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
import { RootStackParamList } from './NavigationTypes'
import DrawerNavigation from './DrawerNavigation'
import {
  registerForPushNotificationsAsync,
  sendPushNotification,
} from '../LocationUtills/BackgroundGeolocation'
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'
import * as BackgroundFetch from 'expo-background-fetch'
import * as Location from 'expo-location'
import { radiusCalculate } from '../LocationUtills/BackgroundGeolocation'
// SCREENS
import Loader from '../components/Loader'
import Login from '../screens/Login'
import Register from '../screens/Register'
import TermsAndConditions from '../screens/TermsAndConditions'
import { useGetPlanners } from '../../common/services/planners/useGetPlanners'
import { getPlannerItems } from '../../common/services/planners/useGetPlannerItems'
import { PlannerItem } from '../../common/services/planners/types'

const LOCATION_TASK_NAME = 'background-location-task'

const BACKGROUND_FETCH_TASK = 'background-neki-location'

const LoginStack = createStackNavigator<RootStackParamList>()

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {

  console.log('radi ovo')

  // let a = 1
  // setInterval(() => {
  //   a += 1
  //   console.log(a + 1)
  // }, 1400)

  await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
    accuracy: Location.Accuracy.Lowest,
    deferredUpdatesInterval: 60000,
    deferredUpdatesDistance: 1000,
    distanceInterval: 1000,
    foregroundService: {
      notificationBody: 'Uploading Jobs if available',
      notificationTitle: 'Background Fetch',
    },
  })
})

TaskManager.defineTask(
  LOCATION_TASK_NAME,
  async ({ data, error, executionInfo }: any) => {
    let a = 1
    setInterval(() => {
      a += 1
      console.log(a + 1, "ovo je log")
    }, 9400)
    if (error) {
      console.log('Something went wrong with background locations')
    } else {
      if (data) {
        const { locations } = data
        console.log(locations, 'locations')
        const locationsData = JSON.parse(
          (await AsyncStorage.getItem('locations')) as string,
        )

        locationsData &&
          locationsData.length > 0 &&
          locationsData.map(async (content: PlannerItem) => {
            if (radiusCalculate(data, content).includes(true)) {
              const expoPushToken = await AsyncStorage.getItem('expoToken')

              if (expoPushToken) {
                sendPushNotification(expoPushToken, content)
              } else {
                console.log('nema tokena u tasku')
              }
            }
          })
      }
    }
  },
)

const RootStack = () => {
  const [expoPushTokenState, setExpoPushTokenState] = useState<boolean>(false)
  const { data: planners } = useGetPlanners()
  const [userId, setUserId] = useState<object | null>()
  const [allData, setAllData] = useState<PlannerItem[]>([])


  // GASENJE TASKA KADA KORISNIK NIJE ULOGOVAN
  useEffect(() => {
    console.log("USAO U USEEFFECT ZA GASENJE TASKA")
    const brokeTask = async () => {
      await TaskManager.unregisterAllTasksAsync()
      console.log("okinuto gasenje taska")
    }
    !userId && userId === undefined && brokeTask()
  }, [])

  useEffect(() => {
    const initBackgroundFetch = async () => {
      const locationPermission = await requestPermissions()

      if (locationPermission === 'granted') {
        const registered =
          await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)
        if (registered) {
          console.log('registered')
        }

        const backgroundFetchStatus = await BackgroundFetch.getStatusAsync()
        switch (backgroundFetchStatus) {
          case BackgroundFetch.BackgroundFetchStatus.Restricted:
            console.log('Background fetch execution is restricted')
            return

          case BackgroundFetch.BackgroundFetchStatus.Denied:
            console.log('Background fetch execution is disabled')
            return

          default:
            console.log('Background fetch execution allowed')

            let isRegistered =
              await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)
            if (isRegistered) {
              console.log(`Task ${BACKGROUND_FETCH_TASK} already registered`)
              // await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
              //   minimumInterval: 5,
              //   startOnBoot: false,
              //   stopOnTerminate: false,
              // })
            } else {
              console.log('Background Fetch Task not found - Registering task')
              // userId && userId !== undefined && await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
              //   minimumInterval: 5,
              //   startOnBoot: false,
              //   stopOnTerminate: false,
              // })
            }

            await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
              minimumInterval: 5,
              startOnBoot: false,
              stopOnTerminate: false,
            })

            // await BackgroundFetch.setMinimumIntervalAsync(10)
            console.log('registerTaskAsync')
            break
        }
      }
    }
    userId && initBackgroundFetch()
    userId && console.log("ALOOOOOOOOOOOOOO")
  }, [userId])

  // console.log("userID", userId)

  useEffect(() => {
    const status = async () => {
      let isRegistered =
        await TaskManager.isTaskRegisteredAsync(BACKGROUND_FETCH_TASK)
      if (isRegistered) {
        console.log(`Task JE REOGSTROVANNNN`, isRegistered)
        await BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
          minimumInterval: 5,
          startOnBoot: false,
          stopOnTerminate: false,
        })
      } else {
        console.log('NOT found - Registering task', isRegistered)
      }
    }
    status()
  }, [userId])

  const requestPermissions = async () => {
    const { status: foregroundStatus } =
      await Location.requestForegroundPermissionsAsync()
    if (foregroundStatus === 'granted') {
      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync()
      if (backgroundStatus === 'granted') {
        // await Location.startLocationUpdatesAsync(BACKGROUND_FETCH_TASK, {
        //   accuracy: Location.Accuracy.Balanced,
        // })

        return backgroundStatus
      }
    }
  }

  useEffect(() => {
    const userDataFn = async () => {
      const data = JSON.parse((await AsyncStorage.getItem('user')) as string)
      setUserId(data)
    }
    if (planners && planners.length > 0) {
      handleItems()
    }
    userDataFn()
  }, [planners])

  useEffect(() => {
    const registerAndSetToken = async () => {
      const token = await registerForPushNotificationsAsync()
      token && AsyncStorage.setItem('expoToken', token)
    }

    // Registracija za Expo Push notifikacije
    registerAndSetToken()

    // Dodavanje listenera za pristigle notifikacije i odgovore
    const notificationListener = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log('Ovde treba da bude notification data:')
      },
    )

    const responseListener =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification response received:', response)
      })

    // Cleanup koda: uklanjanje listenera prilikom unmount-a komponente
    return () => {
      Notifications.removeNotificationSubscription(notificationListener)
      Notifications.removeNotificationSubscription(responseListener)
    }
  }, [userId])

  const handleItems = async () => {
    const ids = planners?.map((planner) => planner.id)

    if (ids) {
      Promise.all(ids.map((id) => getPlannerItems(id))).then((data) => {
        const allLocationData = data.flat()
        setAllData(allLocationData)

        AsyncStorage.setItem('locations', JSON.stringify(allLocationData))
        setExpoPushTokenState(true)
      })
    }
  }

  // const getLocationAndStartUpdates = async () => {
  //   try {
  //     let { status: foregroundStatus } =
  //       await Location.requestForegroundPermissionsAsync()

  //     if (foregroundStatus !== 'granted') {
  //       console.log('Permission to access location was denied')
  //       return
  //     }

  //     const { status: backgroundStatus } =
  //       await Location.requestBackgroundPermissionsAsync()

  //     if (backgroundStatus !== 'granted') {
  //       console.log(
  //         'Permission to access location in the background was denied',
  //       )
  //       return
  //     }

  //     const started =
  //       await Location.hasStartedLocationUpdatesAsync(LOCATION_TASK_NAME)

  //     started ? console.log('pokrenut task') : console.log('nije pokrenut task')

  //     userId &&
  //       userId !== undefined &&
  //       (await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
  //         accuracy: Location?.Accuracy?.Balanced,
  //         timeInterval: 30 * 1000,
  //         showsBackgroundLocationIndicator: true,
  //       }))

  //     const registerdTask =
  //       await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
  //   } catch (error: any) {
  //     console.error('Error fetching location:', error)
  //   }
  // }

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
