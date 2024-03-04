import React, { useState, useEffect, useLayoutEffect } from 'react'
import {
  BackHandler,
  StyleSheet,
  TextInput,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native'
import { useLogin } from '../../common/services/Auth/useLogin'
import { LoginScreenNavigationProp } from '../navigator/NavigationTypes'
import { Credentials } from '../../common/services/models'
import { useGetLicenceDetails } from '../../common/services/licence/useGetLicence'
import Toast from 'react-native-toast-message'
import { Ionicons } from '@expo/vector-icons'
import { useTranslation } from 'react-i18next'
import KeyboardAware from '../components/KeyboadAware/KeyboardAware'
import Loader from '../components/Loader'
import YellowInfoPopup from '../components/YellowInfoPopup/YellowInfoPopup'
import { COLOR_MAPPER } from '../theme'
import { CustomText } from '../custom'
import { FONT_MAPPER } from '../custom/enums'

const Login = ({ navigation }: { navigation: LoginScreenNavigationProp }) => {
  const { t } = useTranslation()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  const [errors, setErrors] = useState({
    emailError: '',
    passwordError: '',
  })

  const [backPressCount, setBackPressCount] = useState(0)
  const { mutateAsync: queryLogin, isLoading } = useLogin()
  // Postavljanje silent opcije kako bi se isključile Axios poruke o grešci
  // const { mutateAsync: queryLogin } = useLogin({ silent: true });
  const { data: licence } = useGetLicenceDetails()

  const { email, password } = userData

  const validateForm = () => {
    let minLength = 2
    let emailError = ''
    let passwordError = ''

    const trimEmail = email.trim()
    const trimPassword = password.trim()

    // Checking if email is empty, to have minimum length and to check if is valid format
    if (trimEmail.length === 0) {
      // emailError = "Unesite e-mail";
      // emailError = translation.emailError[1];
      emailError = t('emailErrorRequired')
    } else if (trimEmail.length < minLength) {
      // emailError = "E-mail mora imati min 2 karaktera";
      emailError = t('emailErrorLength')
    } else if (
      !trimEmail.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    ) {
      // emailError = "E-mail mora biti validnog formata";
      emailError = t('emailErrorFormat')
    }

    // Checking if password is empty & to have minimum length
    if (trimPassword.length === 0) {
      // passwordError = translation.passwordError[1];
      passwordError = t('passwordErrorRequired')
    } else if (trimPassword.length < minLength) {
      passwordError = t('passwordErrorLength')
    }

    if (emailError || passwordError) {
      setErrors({
        emailError,
        passwordError,
      })
      return false
    }
    return true
  }

  // REMOVE BACK LEFT ARROW
  useLayoutEffect(() => {
    navigation.setOptions({
      headerLeft: () => null,
      gestureEnabled: false,
    })
  }, [navigation])

  // PREVENT EXIT APP WHEN PRESS BACK x1, EXIT IF PRESS x2
  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (navigation.isFocused()) {
          if (backPressCount === 1) {
            BackHandler.exitApp()
            return true
          }
          setBackPressCount(1)
          setTimeout(() => setBackPressCount(0), 2000)
          return true
        }
        return false
      },
    )

    return () => backHandler.remove()
  }, [navigation, backPressCount])

  const handleLogin = async (userData: Credentials) => {
    try {
      const isValid = validateForm()
      if (isValid) {
        const user = await queryLogin(userData)
        if (user.auth_key) {
          navigation.navigate('Home', {
            HomePage: undefined,
          })
          Toast.show({
            type: 'success',
            text1: t('welcome'),
          })
        }
      } else {
        Toast.show({
          type: 'error',
          text1: t('fillForm'),
        })
      }
    } catch (err: any) {
      if (err.response && err.response.status === 404) {
        Toast.show({
          type: 'error',
          text1: err.response.data.message,
        })
      } else {
        Toast.show({
          type: 'error',
          text1: t('loginFail'),
        })
      }
    }
  }


  console.log("LICENCE IDES", licence)

  return (
    <ImageBackground
      source={{ uri: licence?.site_image }}
      // source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png" }}
      style={styles.backgroundImage}
    >
      {isLoading && (
        <View
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 5,
            backgroundColor: 'rgba(0,0,0,0.6)',
          }}
        >
          <Loader />
        </View>
      )}
      <KeyboardAware keyboardVerticalOffset={10} style={{ flex: 1 }}>
        <View style={styles.container}>
          <View>
            <Image
              source={{ uri: licence?.icon }}
              // source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Image_created_with_a_mobile_phone.png/1200px-Image_created_with_a_mobile_phone.png' }}
              style={{
                height: 100,
                width: 130,
                objectFit: 'contain',
              }}
            />
          </View>

          <View
            style={{
              width: '100%',
              marginTop: 50,
              alignItems: 'center',
            }}
          >
            <View
              style={{ position: 'absolute', right: 10, top: 15, zIndex: 10 }}
            >
              <YellowInfoPopup
                right={35}
                top={5}
                infoText={t('loginInfoBtn')}
              />
            </View>
            <TextInput
              placeholder={t('enterEmail')}
              placeholderTextColor="gray"
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              value={userData.email}
              style={styles.registerInput}
            />
            {errors.emailError && (
              // <CustomText style={styles.errorMsg}>{errors.emailError}</CustomText>
              <CustomText style={styles.errorMsg}>
                {errors.emailError}
              </CustomText>
            )}
            <View
              style={{
                width: '100%',
                alignItems: 'center',
              }}
            >
              <TextInput
                placeholder={t('enterPassword')}
                placeholderTextColor="gray"
                onChangeText={(text) =>
                  setUserData({ ...userData, password: text })
                }
                value={userData.password}
                secureTextEntry={!showPassword}
                style={styles.loginInput}
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
              // <CustomText style={styles.errorMsg}>{errors.passwordError}</CustomText>
              <CustomText style={styles.errorMsg}>
                {errors.passwordError}
              </CustomText>
            )}

            <TouchableOpacity
              style={{
                width: '100%',
                alignSelf: 'center',
                alignItems: 'center',
              }}
              onPress={() => handleLogin(userData)}
            >
              {/* <CustomText style={styles.loginBtn}>{t('login')}</CustomText> */}
              <CustomText style={styles.loginBtn} weight={FONT_MAPPER.FontBold}>
                {t('login')}
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              style={{ width: '50%', alignSelf: 'center' }}
              onPress={() => navigation.navigate('Register')}
            >
              <CustomText
                style={styles.registerBtn}
                weight={FONT_MAPPER.FontBold}
              >
                {t('register')}
              </CustomText>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAware>
    </ImageBackground>
  )
}

export default Login

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 50,
  },
  loginInput: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 15,
    width: '75%',
    marginVertical: 10,
    backgroundColor: 'white',
    fontSize: 16,
    color: 'black',
    fontFamily: FONT_MAPPER.FontNormal,
  },
  registerInput: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 15,
    marginVertical: 10,
    backgroundColor: 'white',
    fontSize: 16,
    color: 'black',
    width: '75%',
    fontFamily: FONT_MAPPER.FontNormal,
  },
  loginBtn: {
    fontSize: 18,
    backgroundColor: COLOR_MAPPER.ALTERNATE,
    color: 'white',
    padding: 10,
    marginVertical: 10,
    textAlign: 'center',
    width: '75%',
  },
  registerBtn: {
    fontSize: 18,
    backgroundColor: '#ccc',
    color: COLOR_MAPPER.ALTERNATE,
    padding: 10,
    marginVertical: 10,
    textAlign: 'center',
  },
  errorMsg: {
    color: 'red',
    marginBottom: 5,
    backgroundColor: 'white',
    padding: 3,
    width: '75%',
    textAlign: 'left',
  },
})
