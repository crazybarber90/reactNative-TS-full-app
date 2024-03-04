import React, { useEffect, useState } from 'react'
import { AppState, AppStateStatus, StyleSheet, View } from 'react-native'
import PlannerListing from '../containers/PlannerListing/PlannerListing'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { getPlannerItems } from '../../common/services/planners/useGetPlannerItems'
import { PlannerItem } from '../../common/services/planners/types'
import { useGetPlanners } from '../../common/services/planners/useGetPlanners'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'

const BACKGROUND_FETCH_TASK = 'background-fetch'
const LOCATION_TASK_NAME = 'background-location-task'

const HomePage = ({ route }: any) => {
  const [expoPushTokenState, setExpoPushTokenState] = useState<boolean>(false)
  const { data: planners } = useGetPlanners()
  const [userId, setUserId] = useState<object | null>()
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [allLocations, setAllLocations] = useState<PlannerItem[]>()
  const userDataFn = async () => {
    const data = JSON.parse((await AsyncStorage.getItem('user')) as string)
    setUserId(data)
  }

  useEffect(() => {
    userDataFn()
  }, [route.name])

  useEffect(() => {
    // console.log('PLANERI za handleIItems', planners)
    if (planners && planners.length > 0) {
      handleItems()
    }
    // userDataFn()

    console.log('cetvrti use effect da pokrene handleItems() kad se ulogujes ')
  }, [planners])

  // PREVENT INFINITE LOOP WHEN CHANGE appState
  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handlerAppStateChange,
    )
    return () => {
      subscription.remove()
    }
  }, [userId])

  // GASENJE SVIH TASKOVA KADA KORISNIK NIJE ULOGOVAN
  // useEffect(() => {
  //   console.log('USAO U USEEFFECT ZA GASENJE TASKA')
  //   const brokeTask = async () => {
  //     await TaskManager.unregisterAllTasksAsync()
  //     console.log('okinuto gasenje taska')
  //   }

  //   console.log(userId, 'USER ID')
  //   !userId && brokeTask()
  // }, [])

  // TRIGER NOTIFICATION ONLY WHEN USER LOGGED IN
  useEffect(() => {
    const triggerOnLogin = async () => {
      // await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
      //   accuracy: Location?.Accuracy?.Balanced,
      //   timeInterval: 20000,
      //   showsBackgroundLocationIndicator: true,
      //   activityType: Location.ActivityType.AutomotiveNavigation,
      // })

      userId && setIsLoggedIn(true)
      console.log('UNUTAR FUNKCIJE SE DESIO TRIGER NA LOGINU')
    }

    console.log('IZVAN FUNKCIJE SE DESIO TRIGER NA LOGINU')
    console.log('isLoggedIn u useEffecut', isLoggedIn)

    !isLoggedIn && userId && triggerOnLogin()
  }, [userId])

  // MAPIRA IDS I SETUJE U ASYNC STORAGE
  const handleItems = async () => {
    const ids = planners?.map((planner) => planner.id)

    // console.log(ids, 'id-jevi')

    if (ids) {
      Promise.all(ids.map((id) => getPlannerItems(id))).then((data) => {
        const allLocationData = data.flat()
        console.log('broj taskova', allLocationData.length)
        setAllLocations(allLocationData)
        AsyncStorage.setItem('locations', JSON.stringify(allLocationData))
        setExpoPushTokenState(true)
      })
    }
  }

  // appChange FUNKCIJA ZA TRIGER NOTIFIKACIJE
  const handlerAppStateChange = async (nextAppState: AppStateStatus) => {
    if (userId) {
      if (nextAppState !== 'active') {
        // BACKGROUND TRIGGER
        console.log('App has come to the background!', nextAppState)
        const registerdTask =
          await TaskManager.isTaskRegisteredAsync(LOCATION_TASK_NAME)
        console.log(registerdTask, 'registrovani task u fg')

        registerdTask &&
          (await TaskManager.unregisterTaskAsync(LOCATION_TASK_NAME))
        if (userId) {
          console.log('Ima usera pokrenuto je background task')
          // await Location.startLocationUpdatesAsync(BACKGROUND_FETCH_TASK, {
          //   accuracy: Location?.Accuracy?.Balanced,
          //   timeInterval: 30000,
          //   activityType: Location.ActivityType.AutomotiveNavigation,
          //   showsBackgroundLocationIndicator: true,
          // })
        } else {
          console.log(
            'Nema usera NIJEEE pokrenuto backgroundFetch  ili je pokrenut vec :)',
          )
        }
        // FOREGROUND TRIGGER
      } else if (nextAppState === 'active') {
        await TaskManager.unregisterAllTasksAsync()

        const registerdTask = await TaskManager.isTaskRegisteredAsync(
          BACKGROUND_FETCH_TASK,
        )
        // userId &&
        //   (await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        //     accuracy: Location?.Accuracy?.Balanced,
        //     timeInterval: 20000,
        //     showsBackgroundLocationIndicator: true,
        //     activityType: Location.ActivityType.AutomotiveNavigation,
        //   }))

        console.log('background task je ugasen', registerdTask)
      }
    }
  }

  return (
    <View style={styles.container}>
      <PlannerListing />
    </View>
  )
}

export default HomePage

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: '5%',
  },
})
