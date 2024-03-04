import React, { useState, useEffect, useRef } from 'react'
import { Text, View, Button, Platform, AppState } from 'react-native'
import * as Location from 'expo-location'
import * as TaskManager from 'expo-task-manager'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import { PlannerItem } from '../../common/services/planners/types'
import { useGetPlanners } from '../../common/services/planners/useGetPlanners'
// Interfejs za definisanje strukture podataka za lokacije
interface locationsI {
  address: string
  city: string
  country: string
  lat: number
  lng: number
}

// Definišite funkcije za praćenje rastojanja i konvertovanje uglova
// Funkcija za konvertovanje uglova u radijane
const toRadians = (angle: number) => {
  return angle * (Math.PI / 180)
}

// ============================ PUSHHHHH ==========================================
// Postavljanje handlera za notifikacije
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
})

// Funkcija za slanje push notifikacije korisniku
//Ova funkcija sendPushNotification šalje push notifikaciju korisniku čiji Expo Push token je prosleđen kao parametar.
// Ova funkcija očekuje Expo Push token kao parametar. Expo Push token jedinstveno identifikuje uređaj korisnika u Expo servisu i koristi se kako bi se push notifikacija ispravno dostavila određenom uređaju.
async function sendPushNotification(expoPushToken: string, task: any) {

  const message = {
    to: expoPushToken,
    sound: 'default',
    // title: 'Original Title', // dinaminac title za notifikaciju
    title: task?.content_title ? task?.content_title : task?.title, // dinaminac title za notifikaciju
    body: 'And here is the body!', // dinamican body notifikacije
    data: { someData: 'goes here' },
  }

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  })
}

// Funkcija za registraciju za Expo Push notifikacije
async function registerForPushNotificationsAsync() {
  let token

  // Postavljanje kanala za notifikacije (samo za Android)
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    })
  }

  // Provera da li se aplikacija pokreće na stvarnom uređaju fonu/tabletu/...
  if (Device.isDevice) {
    // Dobijanje projectId-a iz Constants-a
    const projectId = Constants?.expoConfig?.extra?.projectId

    // Provera i traženje dozvola za notifikacije
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    // Ako dozvole nisu već odobrene, zatraži korisničku saglasnost
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      console.log("STATUS ZA NOTIFIKACIJU", status)
      finalStatus = status
      console.log("FINAL STATUS ZA NOTIFIKACIJU", finalStatus)
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!')
      return
    }
    // Dobijanje Expo Push tokena
    //Ovde se pokušava dobiti push token pomoću getExpoPushTokenAsync, koristeći projectId iz konstanti. Kada je aplikacija u produkciji, Expo Push servis će generisati stvaran push token za stvarni uređaj.
    //Ako su dozvole odobrene, koristi se funkcija getExpoPushTokenAsync za dobijanje Expo Push tokena,
    token = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    })
    console.log('EXPO PUSH TOKEN', token)
  } else {
    // Ako se aplikacija ne pokreće na stvarnom uređaju, prikaži upozorenje
    alert('Must use physical device for Push Notifications')
  }

  //  Vraćanje Expo Push tokena (ako postoji): Na kraju funkcije, Expo Push token se vraća kao rezultat funkcije. Ako token ne postoji, funkcija će vratiti undefined.
  return token?.data
}
// ========================== PUSH END ============================================

// Funkcija za izračunavanje da li se trenutna lokacija nalazi u radijusu ciljnih lokacija iz taskova
const radiusCalculate = (data: any, taskLocations: locationsI[] | null) => {
  const radijus = 0.1 // 0.1 decimalna stepena odgovara oko 11 km
  const earthRadius = 6371 // Zemljina srednja vrednost radiusa u kilometrima

  const currentLocation = data.locations[0].coords

  // console.log("currentLocation iz radiusCalculate", currentLocation)
  // console.log("taskLocations iz radiusCalculate", taskLocations)

  const inRadius = taskLocations && taskLocations.some((taskLocation) => {
    const lat1 = currentLocation.latitude
    const lon1 = currentLocation.longitude
    const lat2 = taskLocation.lat
    const lon2 = taskLocation.lng

    const dLat = toRadians(lat2 - lat1)
    const dLon = toRadians(lon2 - lon1)

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

    const distance = earthRadius * c

    return distance <= radijus
  })

  return inRadius
}

// Komponenta za praćenje lokacije i slanje notifikacija
const LocationComponent = (task: PlannerItem | undefined) => {
  const [location, setLocation] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [appState, setAppState] = useState(AppState.currentState)
  const { data: planners, isRefetching, isLoading } = useGetPlanners()
  const [locationUpdatesStopped, setLocationUpdatesStopped] = useState(false);

  // Funkcija za praćenje promene stanja aplikacije foreground/background
  const handleAppStateChange = (nextAppState: any) => {
    console.log('App State Changed:', nextAppState)
    setAppState(nextAppState)
  }

  // Stanje za Expo Push token i notifikacije
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>('')
  const [notification, setNotification] = useState<any>(false)
  const notificationListener: React.MutableRefObject<any> = useRef()
  const responseListener: React.MutableRefObject<any> = useRef()

  useEffect(() => {
    // Registracija za Expo Push notifikacije
    //Kada je registracija uspešna, dobijeni Expo Push token se postavlja u stanju komponente pomoću setExpoPushToken.
    registerForPushNotificationsAsync().then((token) => setExpoPushToken(token))

    // Dodavanje listenera za pristigle notifikacije i odgovore
    // Kada notifikacija stigne, postavi je kao trenutnu notifikaciju u stanju komponente
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notify) => {
        setNotification(notify)
      })

    console.log("NOTIFIKACIJAAA IZ STEJTA", notification)

    // Dodavanje listenera za odgovore na notifikacije
    // Kada korisnik reaguje na notifikaciju (npr. tapne na notifikaciju), prikaži odgovor u konzoli
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        //odgovor na notifikaciju isao bi ovde
        console.log('odgovor notifikacije', response)
      })

    // Cleanup koda: uklanjanje listenera prilikom unmount-a komponente
    return () => {
      // Uklanjanje listenera za pristigle notifikacije
      Notifications.removeNotificationSubscription(notificationListener.current)
      // Uklanjanje listenera za odgovore na notifikacije
      Notifications.removeNotificationSubscription(responseListener.current)
    }
  }, [])

  // Funkcija za slanje testne notifikacije
  const sendNotification = async () => {
    const content = {
      title: 'Ušli ste u radijus',
      body: 'Približili ste se ciljnoj lokaciji!',
    }

    await Notifications.scheduleNotificationAsync({
      content,
      trigger: null,
    })
  }
  // console.log("TASKKKK", task)
  useEffect(() => {

    console.log("PONOVO USAO U USEEFFECT  212 LINIJA")
    // Dodavanje listenera za promene AppState-a
    // Kada dođe do promene u AppState-u (npr. kada se aplikacija prebaci između pozadine i prednjeg plana), poziva se funkcija handleAppStateChange
    const changeAppState = AppState.addEventListener(
      'change',
      handleAppStateChange,
    )

    // Definisanje TaskManager zadatka za praćenje lokacije u pozadini
    // Koristi se TaskManager.defineTask za definisanje zadatka KOJI CE PRATITI LOKACIJU U POZADINI
    // Ovaj zadatak će reagovati na promene lokacije i proveriti da li se nalazi u radijusu određenih lokacija iz task prop-a
    TaskManager.defineTask(
      LocationComponent.LOCATION_TASK_NAME,
      async ({ data, error }) => {
        console.log('------------ ++++++++++ Background location task executed:', data);
        if (error) {
          console.error(error.message)
          return
        }

        // console.log('Background location data:', data);

        // Provera da li se trenutna lokacija nalazi u radijusu određenih lokacija iz task prop-a
        if (task?.locations) {
          // console.log('Background location data:', data)
          // if (radiusCalculate(data, task?.locations)) {
          // OVO SALJE TASK LOKACIJE U FUNKCIJU ,
          // AKO JE PROIZVOD ,SALJE CONTENT_LOCATIONS
          // AKO JE TASK ,SALJE LOCATIONS
          if (radiusCalculate(data, task.content_locations ? task?.content_locations : task.locations)) {
            // Ako jeste, poziva se funkcija sendNotification za slanje notifikacije
            // setTimeout(() => {
            // console.log('usao u setTimeout za slanje pushNotifikacije')
            if (expoPushToken) {
              // Provjera da li expoPushToken nije undefined
              sendPushNotification(expoPushToken, task)
              console.log('POSLAT PUSH NOTIFIKACIJA DOLE')
            }
            // }, 70000)
            // sendNotification()
            // console.log('POSLATA NOTIFIKACIJA ASDADASDASDASDASDASD')
          }
        }
      },
    )

    // Funkcija za dobijanje trenutne lokacije i pokretanje praćenja
    // Definicija funkcije za dobijanje trenutne lokacije i startovanje praćenja lokacije u pozadini
    const getLocationAndStartUpdates = async () => {
      try {
        // Traženje dozvola za praćenje lokacije
        // Dobija se trenutni status dozvola za praćenje lokacije
        let { status: foregroundStatus } =
          await Location.requestForegroundPermissionsAsync()
        if (foregroundStatus !== 'granted') {
          setErrorMsg('Permission to access location was denied')
          console.log('Permission to access location was denied')
          return
        } else {
          let { status: backgroundStatus } =
            await Location.requestBackgroundPermissionsAsync()
          console.log("backgroundStatus STATUS 273 LINIJA ", backgroundStatus)
          if (backgroundStatus !== 'granted') {
            setErrorMsg(
              'Permission to access location in the background was denied',
            )
            console.log(
              'Permission to access location in the background was denied',
            )
            return
          } else {
            console.log('RADIII')
          }
        }
        // Startovanje praćenja lokacije u pozadini
        // Koristi se Location.startLocationUpdatesAsync kako bi se započelo praćenje lokacije u pozadini
        // U ovom slučaju, koristi se definisani LocationComponent.LOCATION_TASK_NAME kao naziv zadatka
        // Postavljena je preciznost praćenja na Location.Accuracy.Balanced
        await Location.startLocationUpdatesAsync(
          LocationComponent.LOCATION_TASK_NAME,
          {
            accuracy: Location.Accuracy.Balanced,
          },
        )
        // Postavljanje trenutne lokacije u stanje komponente i logovanje u konzolu
        const updateLocationData = async () => {
          let locationData = await Location.getCurrentPositionAsync({});
          setLocation(locationData);
          if (expoPushToken) {
            // Provjera da li expoPushToken nije undefined
            sendPushNotification(expoPushToken, task)
            console.log('POSLAT PUSH NOTIFIKACIJA DOLE')
          }
        };

        // Prvo ažuriranje lokacije odmah nakon startovanja praćenja
        await updateLocationData();

        // Postavljanje intervala za ažuriranje lokacije svakih 5 minuta
        const locationUpdateInterval = setInterval(updateLocationData, 0.30 * 60 * 1000);


        // Dobijanje trenutne lokacije
        // Koristi se Location.getCurrentPositionAsync kako bi se dobila trenutna lokacija
        let locationData = await Location.getCurrentPositionAsync({})

        // Postavljanje trenutne lokacije u steht komponente i logovanje u konzolu
        setLocation(locationData)
        // Cleanup funkcija: zaustavi interval kada se komponenta unmountuje
        return () => {
          clearInterval(locationUpdateInterval);
        };

      } catch (error: any) {
        setErrorMsg(`Error: ${error.message}`)
        console.error('Error fetching location:', error)
      }
    }

    // Pokretanje funkcije za dobijanje lokacije i startovanje praćenja
    getLocationAndStartUpdates()

    // Cleanup koda: zaustavljanje praćenja lokacije prilikom unmount-a komponente
    // return () => {
    //     AppState.removeEventListener('change', handleAppStateChange);
    //     Location.stopLocationUpdatesAsync(LocationComponent.LOCATION_TASK_NAME);
    //     console.log('ZAUSTAVLJENO UPDEJTOVANJE');
    // };

    // Manualno kastovanje tipa AppState u AppStateStatic
    // const appState = AppState as AppState & { removeEventListener: Function };

    // Cleanup koda: uklanjanje listenera prilikom unmount-a komponente
    // Koristi se return funkcija kako bi se definisale akcije koje će se izvršiti prilikom "čišćenja" komponente
    return () => {
      // Uklanjanje listenera za promene AppState-a
      changeAppState.remove()

      // Zaustavljanje praćenja lokacije u pozadini pomoću Location.stopLocationUpdatesAsync
      // Location.hasStartedLocationUpdatesAsync(LocationComponent.LOCATION_TASK_NAME)
      Location.stopLocationUpdatesAsync(LocationComponent.LOCATION_TASK_NAME)
      // setLocationUpdatesStopped(true);


      // Logovanje u konzolu informacija o zaustavljanju praćenja lokacije
      console.log('ZAUSTAVLJENO UPDEJTOVANJE')
    }
  }, [expoPushToken])

  return (
    <View>
      <Text>
        {errorMsg
          ? `Error: ${errorMsg}`
          : `Location: ${JSON.stringify(location)}`}
      </Text>
      <Text>App State: {appState}</Text>
    </View>
  )
}

// Ime zadatka za praćenje lokacije u pozadini
LocationComponent.LOCATION_TASK_NAME = 'background-location-task'

export default LocationComponent

// export default function App() {
//     const [expoPushToken, setExpoPushToken] = useState('');
//     const [notification, setNotification] = useState(false);
//     const notificationListener = useRef();
//     const responseListener = useRef();

//     useEffect(() => {
//         registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//         notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
//             setNotification(notification);
//         });

//         responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
//             console.log(response);
//         });

//         return () => {
//             Notifications.removeNotificationSubscription(notificationListener.current);
//             Notifications.removeNotificationSubscription(responseListener.current);
//         };
//     }, []);

//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
//             <Text>Your expo push token: {expoPushToken}</Text>
//             <View style={{ alignItems: 'center', justifyContent: 'center' }}>
//                 <Text>Title: {notification && notification.request.content.title} </Text>
//                 <Text>Body: {notification && notification.request.content.body}</Text>
//                 <Text>Data: {notification && JSON.stringify(notification.request.content.data)}</Text>
//             </View>
//             <Button
//                 title="Press to Send Notification"
//                 onPress={async () => {
//                     await sendPushNotification(expoPushToken);
//                 }}
//             />
//         </View>
//     );
// }
