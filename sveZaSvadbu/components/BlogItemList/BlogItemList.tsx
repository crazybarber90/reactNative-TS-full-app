import React from 'react'
import { StyleSheet, Text, View, Image } from 'react-native'
import { Blog } from '../../../common/services/blogs/types'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { DrawerScreenNavigationProp } from '../../navigator/NavigationTypes'
import { COLOR_MAPPER } from '../../theme'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const BlogItemList = ({ blog, idx }: { blog: Blog; idx: number }) => {
  const navigation = useNavigation<DrawerScreenNavigationProp>()

  return (
    <View
      style={[
        styles.blogContainer,
        idx % 2 === 0
          ? { backgroundColor: COLOR_MAPPER.PRIMARY }
          : { backgroundColor: COLOR_MAPPER.SECONDARY },
      ]}
    >
      <CustomText weight={FONT_MAPPER.FontBold} style={styles.BlogCategoryName}>
        {blog.name}
      </CustomText>
      <View style={styles.blogImageWrapper}>
        <TouchableOpacity
          onPress={() => navigation.navigate('SingleBlog', { blog: blog })}
        >
          <Image
            width={300}
            height={200}
            source={{ uri: blog.image }}
            alt={blog.name}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.blogAuthorContainer}>
        <View style={styles.blogAuthorImageWrapper}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('AuthorScreen', {
                username: blog.author_username,
                id: blog.author_id,
              })
            }
          >
            <Image
              width={60}
              height={60}
              source={{ uri: blog.author_avatar }}
              alt={blog.name}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.blogAuthorNameWrapper}>
          <CustomText>{blog.author_name}</CustomText>
        </View>
      </View>
      <View style={styles.blogDescWrapper}>
        <CustomText>{blog.description}</CustomText>
      </View>
    </View>
  )
}

export default BlogItemList

const styles = StyleSheet.create({
  blogContainer: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: COLOR_MAPPER.SECONDARY,
    padding: 5,
  },
  BlogCategoryName: {
    fontSize: 16,
  },
  blogImageWrapper: {
    alignSelf: 'center',
    paddingVertical: 10,
  },
  blogAuthorContainer: {
    flexDirection: 'row',
    paddingVertical: 10,
    alignItems: 'center',
    // backgroundColor: "red"
  },
  blogAuthorImageWrapper: {
    borderRadius: 100,
    overflow: 'hidden',
    marginLeft: 10,
  },
  blogAuthorNameWrapper: {
    marginLeft: 10,
  },
  blogDescWrapper: {
    width: '100%',
    padding: 10,
  },
})
