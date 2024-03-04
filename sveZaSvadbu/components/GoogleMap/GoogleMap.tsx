import React, { useState, useEffect } from 'react'
import { View } from 'react-native'
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps'

import * as Location from 'expo-location'

interface CordinatesProps {
  address: string
  city: string
  country: string
  id?: number
  lat: number
  lng: number
  location_no?: number
}

// React native maps - library alowing us to show map and all addresses entered in products with red markers
const GoogleMap = ({ coordinates }: { coordinates: CordinatesProps[] }) => {
  // const [location, setLocation] = useState<any>(null)

  useEffect(() => {
    ; (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()

      if (status !== 'granted') {
        console.log('Dozvola za lokaciju nije dodeljena')
        return
      }

      // let location = await Location.getCurrentPositionAsync({})
      // setLocation(location.coords)
    })()
  }, [])

  return (
    <View style={{ flex: 1 }}>
      {coordinates && (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          initialRegion={{
            latitude: coordinates[0].lat, // Latitude centra mape
            longitude: coordinates[0].lng, // Longitude centra mape
            latitudeDelta: 0.02, // Povećajte ovu vrednost za veći nivo zumiranja
            longitudeDelta: 0.02, // Povećajte ovu vrednost za veći nivo zumiranja
          }}
        >
          {coordinates.map(
            (productLocation: CordinatesProps, index: number) => (
              <Marker
                key={index}
                coordinate={{
                  latitude: productLocation.lat,
                  longitude: productLocation.lng,
                }}
                title={productLocation.address}
              />
            ),
          )}
        </MapView>
      )}
    </View>
    // );
  )
}

export default GoogleMap
