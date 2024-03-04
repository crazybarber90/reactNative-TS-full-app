import React, { useEffect, useState } from 'react'
import { FlatList, StyleSheet, Text, View } from 'react-native'
import { useGetCategorieArticles } from '../../common/services/articles/useGetCategorieArticles'
import ArticleItemList from '../components/ArticleItemList/ArticleItemList'
import { Article } from '../../common/services/articles/types'
import Loader from '../components/Loader'
import { CustomText } from '../custom'
import { FONT_MAPPER } from '../custom/enums'

const ArticlesScreen = ({ route }: { route: any }) => {
  const { categorie } = route.params
  const [page, setPage] = useState(1)

  const {
    data: articles,
    isLoading,
    refetch,
    isRefetching,
  } = useGetCategorieArticles({
    category_id: categorie.id,
    page,
  })
  const [endlessProducts, setEndlessProducts] = useState<Article[]>([])

  const loadMoreProducts = () => {
    if (articles?.length === 12) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  useEffect(() => {
    if (articles) {
      setEndlessProducts((prev) => [...prev, ...articles])
    }
  }, [articles])

  useEffect(() => {
    refetch()
  }, [page])

  useEffect(() => {
    setEndlessProducts([])
    setPage(1)
    refetch()
  }, [categorie])

  return (
    <View style={{ padding: 5, paddingBottom: 50 }}>
      <CustomText
        weight={FONT_MAPPER.FontBold}
        style={{ fontSize: 18, padding: 5 }}
      >
        {categorie.name}
      </CustomText>

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
            renderItem={({ item }) => <ArticleItemList article={item} />}
          />
          {isLoading || (isRefetching && <Loader />)}
        </View>
      )}
    </View>
  )
}

export default ArticlesScreen

const styles = StyleSheet.create({
  listContainer: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 10,
  },
})
