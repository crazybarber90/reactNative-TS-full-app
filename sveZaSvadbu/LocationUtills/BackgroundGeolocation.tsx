import React from 'react'
import { Text, View, Platform } from 'react-native'

import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'
import * as Device from 'expo-device'
import { PlannerItem } from '../../common/services/planners/types'
import { useGetPlanners } from '../../common/services/planners/useGetPlanners'

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
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

// Funkcija za slanje push notifikacije korisniku
//Ova funkcija sendPushNotification šalje push notifikaciju korisniku čiji Expo Push token je prosleđen kao parametar.
// Ova funkcija očekuje Expo Push token kao parametar. Expo Push token jedinstveno identifikuje uređaj korisnika u Expo servisu i koristi se kako bi se push notifikacija ispravno dostavila određenom uređaju.
export async function sendPushNotification(
  expoPushToken: string,
  content?: PlannerItem,
) {
  console.log('USAO U SENDPUSH I POSLAO NOTIFIKACIJU', expoPushToken)
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: `Vas zadatak: ${
      content?.content_title ? content?.content_title : content?.title
    }`,

    // title: 'Defoltna notifikacija', // dinaminac title za notifikaciju
    // body: 'Body push notifikacije!', // dinamican body notifikacije
    body: `Iz kategorije: ${content?.category_name}`, // dinamican body notifikacije
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
export async function registerForPushNotificationsAsync() {
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
    const projectId = Constants?.expoConfig?.extra?.eas?.projectId
    // const projectId = 'ffc8c1b9-99c5-4c77-ace3-10279d79e6cf'

    // Provera i traženje dozvola za notifikacije
    const { status: existingStatus } = await Notifications.getPermissionsAsync()
    let finalStatus = existingStatus
    // Ako dozvole nisu već odobrene, zatraži korisničku saglasnost
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync()
      finalStatus = status
    } else {
      console.log(`OVO JE FINALSTATUS ZA EXISTING :${existingStatus}`)
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!')
      return
    } else {
      console.log(`OVO JE FINALSTATUS ZA BACKGROUD :${finalStatus}`)
    }
    // Dobijanje Expo Push tokena
    //Ovde se pokušava dobiti push token pomoću getExpoPushTokenAsync, koristeći projectId iz konstanti. Kada je aplikacija u produkciji, Expo Push servis će generisati stvaran push token za stvarni uređaj.
    //Ako su dozvole odobrene, koristi se funkcija getExpoPushTokenAsync za dobijanje Expo Push tokena,
    token = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    })
    // console.log('EXPO PUSH TOKEN', token)
  } else {
    // Ako se aplikacija ne pokreće na stvarnom uređaju, prikaži upozorenje
    // alert('Must use physical device for Push Notifications')
  }

  // alert(`OVO JE TOKEN.DATA ${token?.data}`)

  //  Vraćanje Expo Push tokena (ako postoji): Na kraju funkcije, Expo Push token se vraća kao rezultat funkcije. Ako token ne postoji, funkcija će vratiti undefined.
  return token?.data
}

// Funkcija za izračunavanje da li se trenutna lokacija nalazi u radijusu ciljnih lokacija iz taskova
export const radiusCalculate = (data: any, taskLocations: PlannerItem) => {
  const radijus = 0.1 // 0.1 decimalna stepena odgovara oko 11 km
  const earthRadius = 6371 // Zemljina srednja vrednost radiusa u kilometrima

  const currentLocation = data.locations[0].coords

  // console.log('radi radiusCalculate na svim taskovima')
  const productLocations = () => {
    // pronadjene zajednice lokacije iz user_locations i content_locations

    const data = taskLocations?.content_user_locations?.map((contLoc) => {
      return taskLocations?.content_locations?.filter(
        (authLoc) => contLoc.user_location_id === authLoc.id,
      )
    })

    // console.log(data?.flat(), 'RADI LI OVOV NEAKAKOASOD8888888888888')
    return data?.flat() || []
  }

  // LAT AND LNG OF CURRENT DEVICE LOCATION
  const lat1 = currentLocation.latitude
  const lon1 = currentLocation.longitude

  const productLocs = productLocations()

  // ako je proizvod u planneru, onda on ima productLocs(), i to koristi kao lokacije
  // ako je task u planneru, onda on nema productLocs() i uzima .locations
  // prolazi kroz sve lokacije u nizu, i vraca niz booleana, da li su lokacije u radiusu ili ne

  const locations =
    productLocs.length > 0 ? productLocs : taskLocations.locations

  const distances = locations.map(
    (
      loc:
        | {
            address: string
            city: string
            country: string
            lat: number
            lng: number
            id: number
          }
        | {
            address: string
            city: string
            country: string
            lat: number
            lng: number
          }
        | undefined,
    ) => {
      const lat2 = loc?.lat as number
      const lon2 = loc?.lng as number

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

      return distance
    },
  )
  // vraca [true, false, true, false] u zavisnosti od lokacija

  return distances.map((distance) => distance <= radijus)
}

// Komponenta za praćenje lokacije i slanje notifikacija
const LocationComponent = (data: any) => {
  const { data: planners, isRefetching, isLoading } = useGetPlanners()

  return (
    <View>
      <Text>Radi nesto</Text>
    </View>
  )
}

export default LocationComponent
