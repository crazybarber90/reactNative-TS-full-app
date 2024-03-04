import React, { useState } from 'react'
import {
  ImageBackground,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
} from 'react-native'
import { useRegister } from '../../common/services/Auth/useRegister'
import { LoginScreenNavigationProp } from '../navigator/NavigationTypes'
import { RegisterCredentials } from '../../common/services/Auth/useRegister'
import Toast from 'react-native-toast-message'
import Checkbox from 'expo-checkbox'
import { useGetLicenceDetails } from '../../common/services/licence/useGetLicence'
import { Ionicons } from '@expo/vector-icons'
import { t } from 'i18next'
import YellowInfoPopup from '../components/YellowInfoPopup/YellowInfoPopup'
import { FONT_MAPPER } from '../custom/enums'
import { CustomText } from '../custom'

const Register = ({
  navigation,
}: {
  navigation: LoginScreenNavigationProp
}) => {
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [userData, setUserData] = useState({
    name: '',
    username: '',
    email: '',
    password: '',
  })
  const [isChecked, setChecked] = useState(false)
  const { mutateAsync: queryRegister } = useRegister()
  const { data: licence } = useGetLicenceDetails()

  const [errors, setErrors] = useState({
    nameError: '',
    usernameError: '',
    emailError: '',
    passwordError: '',
  })

  const validateForm = () => {
    let minLength = 2
    let nameError = ''
    let usernameError = ''
    let emailError = ''
    let passwordError = ''

    const trimName = userData.name.trim()
    const trimUsername = userData.username.trim()
    const trimEmail = userData.email.trim()
    const trimPassword = userData.password.trim()

    // Checking if email is empty, to have minimum length and to check if is valid format
    if (trimEmail.length === 0) {
      emailError = t('emailErrorRequired')
    } else if (trimEmail.length < minLength) {
      emailError = t('emailErrorLength')
    } else if (
      !trimEmail.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      emailError = t('emailErrorFormat')
    }

    // Checking if password is empty & to have minimum length
    if (trimPassword.length === 0) {
      passwordError = t('passwordErrorRequired')
    } else if (trimPassword.length < minLength) {
      passwordError = t('passwordErrorLength')
    }

    // checking length of name

    if (trimName.length === 0) {
      nameError = t('nameAndLastnameError')
    }

    // checking length of userName

    if (trimUsername.length === 0) {
      usernameError = t('usernameError')
    }

    if (emailError || passwordError || nameError || usernameError) {
      setErrors({
        nameError,
        usernameError,
        emailError,
        passwordError,
      })
      return false
    }
    return true
  }

  const handleRegisterUser = async (userData: RegisterCredentials) => {
    const isValid = validateForm()

    if (isChecked && isValid) {
      try {
        const data = await queryRegister(userData)
        if (data.status === 200) {
          Toast.show({
            type: 'success',
            text1: data.message,
          })
          navigation.navigate('Login')
        }
      } catch (err) {
        console.log('Error:', err)
      }
    } else {
      Toast.show({
        type: 'error',
        text1: t('requiredFieldsError'),
      })
    }
  }

  return (
    <ImageBackground
      source={{ uri: licence?.site_image }}
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        {/* top 180 */}
        <View
          style={{ position: 'absolute', right: 10, top: '24%', zIndex: 999 }}
        >
          <YellowInfoPopup
            right={35}
            top={5}
            infoText={t('infoBtnNameAndSurname')}
          />
        </View>
        <TextInput
          placeholder={t('nameAndLastname')}
          placeholderTextColor="gray"
          onChangeText={(text) => setUserData({ ...userData, name: text })}
          value={userData.name}
          style={styles.inputField}
        />
        {errors.nameError && (
          <CustomText style={styles.errorMsg}>{errors.nameError}</CustomText>
        )}
        <View
          style={{ position: 'absolute', right: 10, top: '34%', zIndex: 100 }}
        >
          <YellowInfoPopup right={35} top={5} infoText={t('infoBtnUsername')} />
        </View>
        <TextInput
          placeholder={t('username')}
          placeholderTextColor="gray"
          onChangeText={(text) => setUserData({ ...userData, username: text })}
          value={userData.username}
          style={styles.inputField}
        />
        {errors.usernameError && (
          <CustomText style={styles.errorMsg}>
            {errors.usernameError}
          </CustomText>
        )}
        {/* top 320 */}
        <View
          style={{ position: 'absolute', right: 10, top: '43.5%', zIndex: 999 }}
        >
          <YellowInfoPopup right={35} top={5} infoText={t('loginInfoBtn')} />
        </View>
        <TextInput
          placeholder={t('enterEmail')}
          placeholderTextColor="gray"
          onChangeText={(text) => setUserData({ ...userData, email: text })}
          value={userData.email}
          style={styles.inputField}
        />
        {/* </View> */}
        {errors.emailError && (
          <CustomText style={styles.errorMsg}>{errors.emailError}</CustomText>
        )}

        <View style={styles.wrapper}>
          <TextInput
            placeholder={t('enterPassword')}
            placeholderTextColor="gray"
            onChangeText={(text) =>
              setUserData({ ...userData, password: text })
            }
            value={userData.password}
            secureTextEntry={!showPassword}
            style={styles.inputField}
          />
          <TouchableOpacity
            style={{ position: 'absolute', right: '15%', top: '35%' }}
            onPress={() => setShowPassword((prev) => !prev)}
          >
            <Ionicons
              name={!showPassword ? 'eye-off-sharp' : 'eye-sharp'}
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>
        {errors.passwordError && (
          <CustomText style={styles.errorMsg}>
            {errors.passwordError}
          </CustomText>
        )}

        <View style={styles.checkBoxWrapper}>
          <Checkbox
            style={styles.checkbox}
            value={isChecked}
            onValueChange={setChecked}
            color={isChecked ? '#4630EB' : 'black'}
          />
          <TouchableOpacity
            onPress={() => navigation.navigate('TermsAndConditions')}
          >
            <CustomText style={styles.termsText}>
              {t('termsAndConditionAccept')}
            </CustomText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={() => handleRegisterUser(userData)}>
          <CustomText style={styles.btns}>
            {t('termsAndConditionAccept')}
          </CustomText>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  )
}

export default Register

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  wrapper: {
    width: '100%',
    alignItems: 'center',
    zIndex: 1,
  },
  inputField: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 15,
    width: '75%',
    marginVertical: 10,
    backgroundColor: 'white',
    fontSize: 16,
    fontFamily: FONT_MAPPER.FontNormal,
  },
  termsText: {
    color: 'black',
    fontSize: 18,
  },
  checkBoxWrapper: {
    display: 'flex',
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
    opacity: 0.9,
    margin: 15,
    paddingHorizontal: 5,
  },
  checkbox: {
    margin: 8,
    color: 'white',
  },
  btns: {
    fontSize: 18,
    backgroundColor: 'blue',
    color: 'white',
    padding: 10,
    marginVertical: 10,
  },
  errorMsg: {
    color: 'red',
    width: '75%',
    textAlign: 'left',
    backgroundColor: 'white',
    opacity: 0.9,
    paddingVertical: 7,
    paddingHorizontal: 5,
  },
})
