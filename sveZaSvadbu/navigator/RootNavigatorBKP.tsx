import React, { useState, useRef, useEffect } from 'react'
import { AppState } from 'react-native'
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
import * as Location from 'expo-location'
import { radiusCalculate } from '../LocationUtills/BackgroundGeolocation'

//SCFREENS
import Loader from '../components/Loader'
import Login from '../screens/Login'
import Register from '../screens/Register'
import TermsAndConditions from '../screens/TermsAndConditions'
import { useGetPlanners } from '../../common/services/planners/useGetPlanners'
import { getPlannerItems } from '../../common/services/planners/useGetPlannerItems'
import { PlannerItem } from '../../common/services/planners/types'

const LOCATION_TASK_NAME = 'background-location-task'

const LoginStack = createStackNavigator<RootStackParamList>()

console.log('SMRDLJIVI ROOT NAVIGATOR')

TaskManager.defineTask(LOCATION_TASK_NAME, async ({ data, error }: any) => {
  console.log('SMRDLJIVI ROOT NAVIGATOR IZ DEFINE TASKA')

  // alert('usao u define task')
  if (error) {
    console.log('Something went wrong with background locations')
    // alert(`${error} ovo je error iz define-a`)
  } else {
    // alert('Radi ovo nesot san kdmsnb')
  }
  if (data) {
    // alert('Something went right with background locations')
    const { locations } = data

    console.log(locations, 'locations')
    const locationsData = await AsyncStorage.getItem('locations')
    const parsedData: PlannerItem[] = JSON.parse(locationsData as string)

    // console.log('PARSERD DATAAA ', parsedData)
    parsedData?.map(async (content: PlannerItem) => {
      // alert('usao u parsed data')
      // radiusCalculate(data,content) je niz booleana,
      // proveravamo ako u nizu postoji true, onda da okine notifikaciju
      // [true,false,true,false] u zavisnosti od lokacija :)

      if (radiusCalculate(data, content).includes(true)) {
        console.log('USAO U LOKACIJU NASUU', content)

        const expoPushToken = await AsyncStorage.getItem('expoToken')
        // alert(
        //   `${expoPushToken} usao u if radius calculate i uzima expo push token`,
        // )
        // Ako jeste, poziva se funkcija sendNotification za slanje notifikacije
        if (expoPushToken) {
          // Provjera da li expoPushToken nije undefined
          sendPushNotification(expoPushToken, content)
          // registerBackgroundFetchAsync()
        } else {
          console.log('nesto')
        }
      }
    })
  } else {
    // alert('nema date')
  }
})

const RootStack = () => {
  const [location, setLocation] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [appState, setAppState] = useState(AppState.currentState)
  const [locationUpdatesStopped, setLocationUpdatesStopped] = useState(false)
  const [status, requestPermission] = Location.useBackgroundPermissions()
  // Stanje za Expo Push token i notifikacije
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('')
  const [notification, setNotification] = useState<any>(false)
  const notificationListener: React.MutableRefObject<any> = useRef()
  const responseListener: React.MutableRefObject<any> = useRef()
  const [notificationSent, setNotificationSent] = useState<boolean>(false)
  const [expoPushTokenState, setExpoPushTokenState] = useState<boolean>(false)
  const [userToken, setUserToken] = useState<string | null>()
  const {
    data: planners,
    isRefetching,
    isLoading,
    isSuccess,
  } = useGetPlanners()

  const handleItems = () => {
    // uzima id'jeve svih planera
    const ids = planners?.map((planner) => planner.id)

    if (ids) {
      console.log('ovo su svi planner.id', ids)
      // poziva api poziv(getPlannerItems) nad svakim id'jem
      // i onda nam vraca datu svih api poziva(sve taskove svih planera)
      Promise.all(ids.map((id) => getPlannerItems(id))).then((data) => {
        const allData = data.flat()

        // console.log(
        //   '120: RootNavigator => ALL DATA  - sve adrese sa flat() PRE upisa u asyncStorage 120',
        //   allData,
        // )

        // console.log("ALLLLLLLLL DATA", allData)
        AsyncStorage.setItem('locations', JSON.stringify(allData))
        setExpoPushTokenState(true)
      })
    }
  }

  useEffect(() => {
    console.log(appState, 'APP STATE LOGOVAN, iz use effecta')

    // Ako planners postoje i nisu prazni, te notifikacija nije već poslana
    // if (planners && planners.length > 0 && !notificationSent) {
    if (planners && planners.length > 0) {
      console.log('usao u if idss')
      handleItems()

      // Postavite stanje da označi da je notifikacija poslana
      // setNotificationSent(true)
    }
    // }, [planners, notificationSent])
  }, [planners])

  // Funkcija za praćenje promene stanja aplikacije foreground/background
  const handleAppStateChange = (nextAppState: any) => {
    // Kada notifikacija stigne, postavi je kao trenutnu notifikaciju u stanju komponente    console.log('App State Changed:', nextAppState)
    setAppState(nextAppState)
  }

  useEffect(() => {
    // Registracija za Expo Push notifikacije
    //Kada je registracija uspešna, dobijeni Expo Push token se postavlja u stanju kompoente pomoću setExpoPushToken.
    registerForPushNotificationsAsync().then((token) => {
      //       console.log("------------------------------------------------------------------------------------------------------ TOKEN IZ registerForPushNotificationsAsync()", token)

      // alert(`${token}----> ovo je token nas :)`)

      token && AsyncStorage.setItem('expoToken', token)
    })

    // Dodavanje listenera za pristigle notifikacije i odgovore
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        console.log(' 164: OVO JE addNotificationReceivedListener ===> ')
      })

    // Dodavanje listenera za odgovore na notifikacije
    // Kada korisnik reaguje na notifikaciju (npr. tapne na notifikaciju), prikaži odgovor u konzoli
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //odgovor na notifikaciju isao bi ovde
        console.log('172: OVO JE addNotificationResponseReceivedListener ===> ')
      })

    // Cleanup koda: uklanjanje listenera prilikom unmount-a komponente
    return () => {
      // Uklanjanje listenera za pristigle notifikacije
      Notifications.removeNotificationSubscription(notificationListener.current)
      // Uklanjanje listenera za odgovore na notifikacije
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  useEffect(() => {
    // Dodavanje listenera za promene AppState-as
    // Kada dođe do promene u AppState-u (npr. kada se aplikacija prebaci između pozadine i prednjeg plana), poziva se funkcija handleAppStateChange

    const stateListener = AppState.addEventListener(
      'change',
      handleAppStateChange,
    )

    // alert(`${expoPushTokenState} ulazi u use effect`)
    // Funkcija za dobijanje trenutne lokacije i pokretanje praćenja
    // Definicija funkcije za dobijanje trenutne lokacije i startovanje praćenja lokacije u pozadini
    const getLocationAndStartUpdates = async () => {
      // alert('usao u prvu funkciju')
      try {
        // Traženje dozvola za praćenje lokacije
        // Dobija se trenutni status dozvola za praćenje lokacije

        console.log('radi u try')

        let { status: foregroundStatus } =
          await Location.requestForegroundPermissionsAsync()
        if (foregroundStatus !== 'granted') {
          setErrorMsg('Permission to access location was denied')
          // alert('nema foreground')
          return
        } else {
          console.log(foregroundStatus, 'foreground status')
          const { status: backgroundStatus } =
            await Location.requestBackgroundPermissionsAsync()

          console.log(backgroundStatus, 'background tatus')
          if (backgroundStatus !== 'granted') {
            setErrorMsg(
              'Permission to access location in the background was denied',
            )
            console.log('NEMAS BACKGROUND PERMISIJU')
            // alert('nema background')
            return
          } else {
            console.log('RADIII')
            // alert('dosao do poslednjeg elsa')
          }
        }
        // Startovanje praćenja lokacije u pozadini
        // Koristi se Location.startLocationUpdatesAsync kako bi se započelo praćenje lokacije u pozadini
        // U ovom slučaju, koristi se definisani LocationComponent.LOCATION_TASK_NAME kao naziv zadatka
        // Postavljena je preciznost praćenja na Location.Accuracy.Balanced
        await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
          accuracy: Location?.Accuracy?.Balanced,
          timeInterval: 5 * 1000,
          showsBackgroundLocationIndicator: true,
          // distanceInterval: 200,
        })
      } catch (error: any) {
        console.log('OVDE PRAVI ERROR')
        setErrorMsg(`Error: ${error.message}`)
        console.error('Error fetching location:', error)
        // alert(`${error}, error iz catcha`)
      }
    }

    // Pokretanje funkcije za dobijanje lokacije i startovanje praćenja
    expoPushTokenState && getLocationAndStartUpdates()

    // Cleanup koda: uklanjanje listenera prilikom unmount-a komponente
    // Koristi se return funkcija kako bi se definisale akcije koje će se izvršiti prilikom "čišćenja" komponente
    console.log('APPSTATEEEE', appState)

    return () => {
      stateListener.remove()
    }
  }, [expoPushTokenState, appState])

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
