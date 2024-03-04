import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {
  useGetCategorieProducts,
  isCatalog,
} from '../../common/services/products/useGetCategorieProducts'
import { FlatList } from 'react-native-gesture-handler'
import CatalogListItem from '../components/CatalogListItem/CatalogListItem'
import ProductListItem from '../components/ProductListItem/ProductListItem'
import Loader from '../components/Loader'
import { Catalog, Product } from '../../common/services/products/types'
import { CustomText } from '../custom'

const Products = ({ route }: { route: any }) => {
  const { categorie } = route.params
  const [page, setPage] = useState(1)

  const {
    data: allProducts,
    isLoading,
    refetch,
    isRefetching,
  } = useGetCategorieProducts({
    category_id: categorie.id,
    page: page,
  })

  const [endlessProducts, setEndlessProducts] = useState<(Catalog | Product)[]>(
    [],
  )

  const loadMoreProducts = () => {
    if (allProducts?.length === 10) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  useEffect(() => {
    if (allProducts) {
      setEndlessProducts((prev) => [...prev, ...allProducts])
    }
  }, [allProducts])

  useEffect(() => {
    refetch()
  }, [page])

  useEffect(() => {
    setEndlessProducts([])
    setPage(1)
    refetch()
  }, [categorie])

  return (
    <View style={styles.container}>
      <CustomText>{categorie?.name}</CustomText>

      {isLoading ? (
        <Loader />
      ) : (
        <View style={[styles.listContainer, { position: 'relative' }]}>
          <FlatList
            style={{ marginBottom: 20 }}
            showsVerticalScrollIndicator={false}
            data={endlessProducts}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.3}
            renderItem={({ item }) =>
              isCatalog(item) ? (
                <CatalogListItem catalog={item} />
              ) : (
                <ProductListItem product={item} />
              )
            }
          />
          {isLoading || (isRefetching && <Loader />)}
        </View>
      )}
    </View>
  )
}

export default Products

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: '5%',
    paddingTop: 10,
    paddingBottom: 50,
  },
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
})
