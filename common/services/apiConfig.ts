// import { constants } from "buffer";
import moduleImports from './imports'
const { axios, AsyncStorage } = moduleImports
// import Constants from "expo-constants";
// import Constants from "../../plantsShop/node_modules/expo-constants";

// Dobijanje projectId-a iz Constants-a
// const easConfig = Constants?.expoConfig?.extra?.eas;
const URL = process.env.REACT_APP_API_URL

const api = axios.create({
  // baseURL: URL,
  baseURL: 'http://mybackend.local/v1', // Nikola simulator
  // baseURL: "http://192.168.0.13:80/v1", // Nikola mobile

  headers: {
    'Content-Type': 'application/json',
    // "x-requested-with": "EDIT_APP_ID",
    'x-requested-with': 'paid',
    // "x-requested-with": "myapp.mybackend.myapp1691664009",
  },
})

api.interceptors.request.use(
  async function (config) {
    const token = await AsyncStorage.getItem('token')
    if (token) {
      config.headers['Authorization'] = 'Bearer ' + token
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)

export default api
