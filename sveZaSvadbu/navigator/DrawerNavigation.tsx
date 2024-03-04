import React, { useState } from 'react'
import {
  DrawerNavigationProp,
  createDrawerNavigator,
} from '@react-navigation/drawer'
import { Image, View, TouchableOpacity } from 'react-native'
import { DrawerActions } from '@react-navigation/native'
import { DrawerStackParamList } from './NavigationTypes'
import HomePage from '../screens/HomePage'
import Blogs from '../screens/Blogs'
import Products from '../screens/Products'
import Articles from '../screens/ArticlesScreen'
import SingleProduct from '../screens/SingleScreens/SingleProduct'
import SingleCatalog from '../screens/SingleScreens/SingleCatalog'
import CustomDrawer from './components/CustomDrawer'
import { useGetLicenceDetails } from '../../common/services/licence/useGetLicence'
import { useGetContent } from '../../common/services/content/useGetContent'
import { ContentCategorie } from '../../common/services/models'
import Hamburger from '../assets/hamrburger.svg'
import Planner from '../assets/react-native-planner.svg'
import SingleBlog from '../screens/SingleScreens/SingleBlog'
import SingleArticle from '../screens/SingleScreens/SingleArticle'
import AuthorScreen from '../screens/AuthorScreen'
import SinglePlanner from '../screens/SingleScreens/SinglePlanner'
import PlannerButton from '../components/PlannerButton/PlannerButton'
import RightPlannerSidebar from './components/RightPlannerSidebar'

const Drawer = createDrawerNavigator<DrawerStackParamList>()

const DrawerNavigation = ({
  navigation,
}: {
  navigation: DrawerNavigationProp<DrawerStackParamList>
}) => {
  const { data: content } = useGetContent()
  const { data: licence } = useGetLicenceDetails()

  const [isVisible, setIsVisible] = useState<boolean>(false)

  return (
    <>
      <Drawer.Navigator
        screenOptions={{
          swipeEnabled: false,
          drawerPosition: 'left',
          headerStyle: {
            backgroundColor: 'transparent',
            height: 80,
          },

          // hamburger icon for left icon
          headerLeft: () => {
            return (
              <TouchableOpacity
                style={{ paddingLeft: 20 }}
                onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
              >
                <Hamburger height={45} width={45} />
              </TouchableOpacity>
            )
          },
          headerTitleAlign: 'center',

          //title - middle icon
          headerTitle: () => {
            return (
              <>
                <View
                  style={{
                    alignSelf: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.navigate('HomePage')}
                  >
                    <Image
                      source={{ uri: licence?.icon }}
                      resizeMode="contain"
                      width={50}
                      height={50}
                    />
                  </TouchableOpacity>
                </View>
              </>
            )
          },

          // right icon for planners
          headerRight: () => {
            return (
              <TouchableOpacity
                style={{ paddingRight: 20 }}
                onPress={() => setIsVisible(true)}
              >
                <Planner height={45} width={45} />
              </TouchableOpacity>
            )
          },
        }}
        drawerContent={(props) => <CustomDrawer {...props} />}
      >
        <Drawer.Screen name="HomePage" component={HomePage} />
        <Drawer.Screen name="SingleProduct" component={SingleProduct} />
        <Drawer.Screen name="SingleCatalog" component={SingleCatalog} />
        <Drawer.Screen name="SingleArticle" component={SingleArticle} />
        <Drawer.Screen name="SingleBlog" component={SingleBlog} />
        <Drawer.Screen name="AuthorScreen" component={AuthorScreen} />
        <Drawer.Screen name="SinglePlanner" component={SinglePlanner} />

        {/* mapping through products(content[0]) categories and returning screen for every categorie */}
        {content &&
          content[0].content_type_categories.map(
            (categorie: ContentCategorie) => (
              <Drawer.Screen
                key={categorie.id}
                name={categorie.name}
                component={Products}
                initialParams={{ categorie: categorie }}
                options={{ drawerItemStyle: { backgroundColor: 'orange' } }}
              />
            ),
          )}

        <Drawer.Group
          screenOptions={{
            drawerStyle: { borderTopWidth: 1, borderTopColor: 'black' },
          }}
        >
          {/* mapping through articles(content[1]) categories and returning screen for every categorie */}
          {content &&
            content[1].content_type_categories.map(
              (categorie: ContentCategorie) => (
                <Drawer.Screen
                  key={categorie.id}
                  name={categorie.name}
                  component={Articles}
                  initialParams={{ categorie: categorie }}
                  options={{ drawerItemStyle: { backgroundColor: 'yellow' } }}
                />
              ),
            )}
        </Drawer.Group>

        <Drawer.Group
          screenOptions={{
            drawerStyle: { borderTopWidth: 1, borderTopColor: 'black' },
          }}
        >
          {/* mapping through blogs(content[2]) categories and returning screen for every categorie */}
          {content &&
            content[2].content_type_categories.map(
              (categorie: ContentCategorie) => (
                <Drawer.Screen
                  key={categorie.id}
                  name={categorie.name}
                  component={Blogs}
                  initialParams={{ categorie: categorie }}
                  options={{ drawerItemStyle: { backgroundColor: 'yellow' } }}
                />
              ),
            )}
        </Drawer.Group>
      </Drawer.Navigator>

      {/* RIGHT SIDEBAR WITH PLANNERS */}
      {isVisible && (
        <RightPlannerSidebar
          isVisible={isVisible}
          setIsVisible={setIsVisible}
          navigation={navigation}
        />
      )}
      <PlannerButton />
    </>
  )
}

export default DrawerNavigation
