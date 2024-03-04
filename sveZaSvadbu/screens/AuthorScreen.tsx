import React, { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native'
import { useGetAuthorData } from '../../common/services/author/useGetAuthorData'
import { useGetAuthorProducts } from '../../common/services/author/useGetAuthorProducts'
import { useGetAuthorBlogs } from '../../common/services/author/useGetAuthorBlogs'
import { ScrollView } from 'react-native-gesture-handler'
import { isCatalog } from '../../common/services/products/useGetCategorieProducts'
import CatalogListItem from '../components/CatalogListItem/CatalogListItem'
import ProductListItem from '../components/ProductListItem/ProductListItem'
import BlogItemList from '../components/BlogItemList/BlogItemList'
import { t } from 'i18next'
import { CustomText } from '../custom'
import { FONT_MAPPER } from '../custom/enums'

const AuthorScreen = ({ route }: { route: any }) => {
  const { username, id } = route.params
  const [isProducts, setIsProducts] = useState(true)

  const { data: author, refetch } = useGetAuthorData(username)
  const { data: products, refetch: refetchProducts } = useGetAuthorProducts({
    page: 1,
    userId: id,
  })
  const { data: blogs, refetch: refetchBlogs } = useGetAuthorBlogs({
    page: 1,
    userId: id,
  })

  console.log('AUTOR', author)

  useEffect(() => {
    refetch()
    refetchProducts()
    refetchBlogs()
  }, [route])

  return (
    <ScrollView>
      <View>
        <View style={{ paddingHorizontal: 10 }}>
          <CustomText style={styles.title}>{author?.name}</CustomText>
          <View style={{ flexDirection: 'row', marginTop: 30 }}>
            <View style={{ width: '40%' }}>
              <Image
                source={{ uri: author?.avatar }}
                style={{ width: '100%', height: 200 }}
                resizeMode="contain"
              />
            </View>
            <View style={styles.labels}>
              <CustomText style={styles.label}>{t('phone')}: </CustomText>
              <CustomText style={styles.labelValue}>{author?.phone}</CustomText>
              <CustomText style={styles.label}>{t('email')}: </CustomText>
              <CustomText style={styles.labelValue}>
                {author?.public_email}
              </CustomText>
              <CustomText style={styles.label}>{t('location')}: </CustomText>
              {author?.locations?.map((location, i) => (
                <CustomText style={styles.labelValue} key={i}>
                  • {location.address}, {location.city}, {location.country}
                </CustomText>
              ))}
            </View>
          </View>
        </View>
        <View style={styles.tabContainers}>
          {author && author.role !== 'front-user' && (
            <TouchableOpacity
              style={[
                styles.tab,
                { backgroundColor: 'lightblue' },
                isProducts && {
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                },
              ]}
              onPress={() => setIsProducts(true)}
            >
              <CustomText style={styles.text}>{t('products')}</CustomText>
            </TouchableOpacity>
          )}

          {author && author.role !== 'front-user' && (
            <TouchableOpacity
              style={[
                styles.tab,
                { backgroundColor: 'pink' },
                !isProducts && {
                  borderBottomWidth: 1,
                  borderBottomColor: 'gray',
                },
              ]}
              onPress={() => setIsProducts(false)}
            >
              <CustomText style={styles.text}>{t('blogs')}</CustomText>
            </TouchableOpacity>
          )}
        </View>

        {isProducts && author && author.role !== 'front-user' ? (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={products}
            scrollEnabled={false}
            renderItem={({ item }) =>
              isCatalog(item) ? (
                <CatalogListItem catalog={item} key={item.id} />
              ) : (
                <ProductListItem product={item} key={item.id} />
              )
            }
          />
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            data={blogs}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <BlogItemList blog={item} key={item.id} idx={index} />
            )}
          />
        )}
      </View>
    </ScrollView>
  )
}

export default AuthorScreen

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontFamily: FONT_MAPPER.FontBold,
  },
  labels: {
    width: '60%',
    height: 'auto',
    paddingLeft: 10,
    paddingTop: '4%',
  },
  label: {
    fontFamily: FONT_MAPPER.FontBold,
    fontSize: 18,
  },
  labelValue: {
    fontSize: 16,
  },
  tabContainers: {
    width: '100%',
    paddingHorizontal: 15,
    // justifyContent: 'space-evenly',
    flexDirection: 'row',
    marginVertical: 15,
  },
  tab: {
    borderColor: 'black',
    width: '50%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'yellow',
  },
  text: {
    fontSize: 18,
    width: '100%',
    textAlign: 'center',
  },
})
