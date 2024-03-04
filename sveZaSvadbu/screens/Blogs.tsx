import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { useGetCategorieBlogs } from '../../common/services/blogs/useGetCategoryBlogs'
import { FlatList } from 'react-native-gesture-handler'
import { Blog } from '../../common/services/blogs/types'
import BlogItemList from '../components/BlogItemList/BlogItemList'
import Loader from '../components/Loader'
import { CustomText } from '../custom'
import { COLOR_MAPPER } from '../theme'
import { FONT_MAPPER } from '../custom/enums'

export default function Blogs({ route }: { route: any }) {
  const { categorie } = route.params
  const [page, setPage] = useState<number>(1)

  const {
    data: allBlogs,
    isLoading,
    refetch,
    isRefetching,
  } = useGetCategorieBlogs({
    category_id: categorie.id,
    page,
  })

  const [endlessBlogs, setEndlessBlogs] = useState<Blog[]>([])

  const loadMoreProducts = () => {
    if (allBlogs?.length === 12) {
      setPage((prevPage) => prevPage + 1)
    }
  }

  useEffect(() => {
    if (allBlogs) {
      setEndlessBlogs((prev) => [...prev, ...allBlogs])
    }
  }, [allBlogs])

  useEffect(() => {
    refetch()
  }, [page])

  useEffect(() => {
    setEndlessBlogs([])
    setPage(1)
    refetch()
  }, [categorie])

  return (
    <View style={{ paddingBottom: 45 }}>
      <CustomText
        weight={FONT_MAPPER.FontBold}
        style={{ fontSize: 18, padding: 10 }}
      >
        {categorie.name}
      </CustomText>

      {isLoading ? (
        <Loader />
      ) : (
        <View style={[styles.listContainer, { position: 'relative' }]}>
          <FlatList
            style={{ marginBottom: 30 }}
            showsVerticalScrollIndicator={false}
            data={endlessBlogs}
            keyExtractor={(item, index) => index.toString()}
            onEndReached={loadMoreProducts}
            onEndReachedThreshold={0.3}
            renderItem={({ item, index }) => (
              <BlogItemList blog={item} idx={index} />
            )}
          />
          {isLoading || (isRefetching && <Loader />)}
        </View>
      )}
    </View>
  )
}

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
    paddingVertical: 10,
  },
})
