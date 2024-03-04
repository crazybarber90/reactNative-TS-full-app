import AsyncStorage from '@react-native-async-storage/async-storage'
import React, { useEffect } from 'react'
import { View, StyleSheet, Image } from 'react-native'
import { LoginScreenNavigationProp } from '../navigator/NavigationTypes'
import { useGetLanguage } from '../../common/services/licence/useGetLanguage'
import { useFonts } from 'expo-font'
import { registerForPushNotificationsAsync } from '../LocationUtills/BackgroundGeolocation'
import i18n from '../i18n'
import * as Location from 'expo-location'
import * as Notifications from 'expo-notifications'

const Loader = ({ navigation }: { navigation?: LoginScreenNavigationProp }) => {
  const gifLoader = require('../assets/theme-loader.gif')

  const { data: language } = useGetLanguage()

  const [fontsLoaded] = useFonts({
    // FontNormal: require('../assets/fonts/RobotoCondensed-Regular.ttf'),
    // FontBold: require('../assets/fonts/RobotoCondensed-Bold.ttf'),
    FontNormal: require('../assets/fonts/PlayfairDisplay-Regular.ttf'),
    FontBold: require('../assets/fonts/PlayfairDisplay-Bold.ttf'),
  })

  useEffect(() => {
    const getToken = async () => {
      const token = await AsyncStorage.getItem('token')
      if (language) {
        // kada dobijemo language sa backenda, settujemo language u i18n
        // nakon toga navigiramo u odnosu na token
        i18n.changeLanguage(language.country_iso_code)
        if (token) {
          await navigation?.navigate('Home', {
            HomePage: undefined,
            Blogs: undefined,
          })
          setTimeout(async () => {
            await Location.getCurrentPositionAsync({})
          }, 2500)
        } else {
          await navigation?.navigate('Login')
          setTimeout(async () => {
            await Location.getCurrentPositionAsync({})
          }, 500)
        }
      }
    }
    getToken()
  }, [language])

  // POZIVA PERMISIJE ZA FG I BG
  const getLocationAndStartUpdates = async () => {
    try {
      let { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync()

      if (foregroundStatus !== 'granted') {
        console.log('Permission to access location was denied')
        return
      }

      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync()

      if (backgroundStatus !== 'granted') {
        console.log(
          'Permission to access location in the background was denied',
        )
        return
      }
    } catch (error: any) {
      console.error('Error fetching location:', error)
    }
  }

  // INICIJALNI USEEFFECT DA SE SETUJU PERMISIJE FG / BG
  // NEEDS TO BE FIXED: CALLING FUNCTION 3 TIMES BECOUSE OF DEPENDENCIES

  useEffect(() => {
    getLocationAndStartUpdates()
    console.log('Pozivanje permisija za fg / bg ')
  }, [])

  // ZA TOKEN I NOTIFIKACIJE
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
  }, [])

  if (!fontsLoaded) {
    return null
  }

  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 200,
      }}
    >
      <Image
        source={gifLoader}
        alt="Loading"
        style={{ width: 100, height: 100 }}
      />
    </View>
  )
}

const styles = StyleSheet.create({})

export default Loader
