import React from 'react'
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native'
import {
  GooglePlaceData,
  GooglePlacesAutocomplete,
} from 'react-native-google-places-autocomplete'

const googleMapApiKey =
  Platform.OS === 'android'
    ? 'AIzaSyB8YRahAIRvxSE-2DcxIjmhRfMTv-Serb8'
    : 'AIzaSyB-GsNugRiLaxaV3j8hWknan-dna0lp1XE'

const GoogleAutocomplete = ({
  handleAddress,
}: {
  handleAddress: (data: GooglePlaceData) => void
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <View style={{ flex: 1 }}>
        <GooglePlacesAutocomplete
          placeholder="Unesite adresu"
          onPress={handleAddress}
          query={{
            key: 'AIzaSyBq2U_Tet83IoF69HXdHCz34bArXwjESjg',
            language: 'en',
          }}
          onFail={(error) => console.error(error)}
          textInputProps={{
            autoCapitalize: 'none',
            autoCorrect: false,
          }}
          styles={{
            row: {
              padding: 6,
            },
          }}
        />
      </View>
    </KeyboardAvoidingView>
  )
}

export default GoogleAutocomplete
