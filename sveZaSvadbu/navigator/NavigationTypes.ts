// U folderu sa navigacionim definicijama, na primer navigation.tsx

import { DrawerNavigationProp } from '@react-navigation/drawer'
import { StackNavigationProp } from '@react-navigation/stack'
import { ContentCategorie } from '../../common/services/models'
import { Catalog, Product } from '../../common/services/products/types'
import { Blog } from '../../common/services/blogs/types'
import { Article } from '../../common/services/articles/types'

export type RootStackParamList = {
  Login: undefined
  Register: undefined
  Loader: undefined
  Home: DrawerStackParamList
  TermsAndConditions: undefined
  // Primer sa parametrima, prilagodite vašim rutama
  // Dodajte druge rute ovde
}

export type DrawerStackParamList = {
  HomePage: undefined
  [key: string]:
    | { categorie: ContentCategorie }
    | { catalog: Catalog }
    | { product: Product }
    | { blog: Blog }
    | { article: Article }
    | { id: number }
    | { username: string; id: number }
    | undefined
}

export type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>

export type HomePageScreenNavigationProp = DrawerNavigationProp<
  DrawerStackParamList,
  'HomePage'
>
export type HeaderPageScreenNavigationProp = DrawerNavigationProp<
  RootStackParamList,
  'Login'
>

export type DrawerScreenNavigationProp =
  DrawerNavigationProp<DrawerStackParamList>

export type ProductPageScreenNavigationProp = DrawerNavigationProp<
  DrawerStackParamList,
  'Products'
>

export type BlogPageScreenNavigationProp = DrawerNavigationProp<
  DrawerStackParamList,
  'Blogs'
>
