import React from 'react'
import { StyleSheet, View, Image } from 'react-native'
import { Article } from '../../../common/services/articles/types'
import { TouchableOpacity } from 'react-native-gesture-handler'
import { useNavigation } from '@react-navigation/native'
import { DrawerScreenNavigationProp } from '../../navigator/NavigationTypes'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const ArticleItemList = ({ article }: { article: Article }) => {
  const navigation = useNavigation<DrawerScreenNavigationProp>()

  return (
    <View style={styles.container}>
      <CustomText weight={FONT_MAPPER.FontBold} style={{ margin: 10 }}>
        {article.name}
      </CustomText>
      <View style={{ flexDirection: 'row', gap: 5 }}>
        <View style={{ width: '50%' }}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('SingleArticle', { article: article })
            }
          >
            <Image
              style={styles.image}
              source={{ uri: article.image }}
              alt={article.name}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.dateAndDescription}>
          <CustomText>{article.date}</CustomText>
          <CustomText style={{ paddingBottom: 5 }}>
            {article.description.substring(0, 100)}
          </CustomText>
        </View>
      </View>
    </View>
  )
}

export default ArticleItemList

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 10,
  },
  image: {
    width: '100%',
    // height: 100,
    aspectRatio: '3/2',
  },
  dateAndDescription: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderColor: 'black',
  },
})
