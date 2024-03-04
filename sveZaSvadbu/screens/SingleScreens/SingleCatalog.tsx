import { StyleSheet, Text, View, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Catalog, Product } from '../../../common/services/products/types'
import { FlatList } from 'react-native-gesture-handler'
import ProductListItem from '../../components/ProductListItem/ProductListItem'
import { useGetCatalogProducts } from '../../../common/services/products/useGetCatalogProducts'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const SingleCatalog = ({ route }: { route: any }) => {
  const { catalog }: { catalog: Catalog } = route.params
  const [page, setPage] = useState(1)

  const { data: products, refetch } = useGetCatalogProducts({
    catalogId: catalog.id,
    page: page,
  })

  useEffect(() => {
    refetch()
  }, [catalog])

  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <View style={{ width: '40%', padding: 15 }}>
          <Image
            style={{ width: '100%', aspectRatio: '6/4' }}
            source={{ uri: catalog.image }}
          />
        </View>
        <View style={styles.details}>
          <CustomText weight={FONT_MAPPER.FontBold} style={{ fontSize: 20 }}>
            {catalog.name}
          </CustomText>
          <CustomText style={{ fontSize: 18 }}>
            {catalog.author_name}
          </CustomText>
        </View>
      </View>
      <FlatList
        showsVerticalScrollIndicator={false}
        data={products}
        renderItem={({ item }) => <ProductListItem product={item as Product} />}
      />
    </View>
  )
}

export default SingleCatalog

const styles = StyleSheet.create({
  mainContainer: {
    paddingBottom: 110,
    paddingHorizontal: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  details: {
    width: '60%',
    paddingHorizontal: 10,
    gap: 5,
  },
})
