import { StyleSheet, Text, View, Image, ScrollView } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Article } from '../../../common/services/articles/types'
import ImageGallery from '../../components/ImageGallery/ImageGallery'
import LeaveCommentModal from '../../components/LeaveCommentModal/LeaveCommentModal'
import CommentSection from '../../components/LeaveCommentModal/CommentSection'
import { CommentDataTypes } from './SingleProduct'
import { useGetComments } from '../../../common/services/comments/useGetComments'
import { usePostComment } from '../../../common/services/comments/usePostComments'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Toast from 'react-native-toast-message'
import { useNavigation } from '@react-navigation/native'
import { DrawerScreenNavigationProp } from '../../navigator/NavigationTypes'
import { t } from 'i18next'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const SingleArticle = ({ route }: { route: any }) => {
  const { article }: { article: Article } = route.params

  const navigation = useNavigation<DrawerScreenNavigationProp>()

  const [showModal, setShowModal] = useState(false)
  const [galleryVisible, setGalleryVisible] = useState(false)
  const [commentData, setCommentData] = useState<CommentDataTypes>({
    author_name: '',
    comment_content: '',
    comment_parent_id: null,
  })

  const { data: comments } = useGetComments(article.id)
  const { mutateAsync: postComment, isSuccess } = usePostComment()

  const setCommentParentId = (id: number) => {
    setCommentData({ ...commentData, comment_parent_id: id })
  }

  const closeGallery = () => setGalleryVisible(false)
  const openGallery = () => setGalleryVisible(true)

  useEffect(() => {
    if (isSuccess) {
      Toast.show({
        type: 'success',
        text1: t('commentSuccessSent'),
        text2: t('commentOnModeration'),
      })
    }
  }, [isSuccess])

  return (
    <ScrollView>
      <View style={styles.container}>
        <CustomText style={styles.articleTitle}>{article.name}</CustomText>
        <Image source={{ uri: article.image }} style={styles.articleImage} />
        <View style={{ width: '100%', alignItems: 'center' }}>
          <View style={styles.articleDateAndCategorie}>
            <CustomText style={styles.fontText}>{article.date}</CustomText>
            <CustomText style={styles.fontText}>
              {article.category_name}
            </CustomText>
          </View>
          <View
            style={{
              width: '95%',
            }}
          >
            <CustomText style={styles.fontText}>
              {article.description}
            </CustomText>
          </View>
        </View>

        {article.image_gallery && article.image_gallery.length > 0 && (
          <ImageGallery
            galleryVisible={galleryVisible}
            closeGallery={closeGallery}
            openGallery={openGallery}
            imageGallery={article.image_gallery}
          />
        )}
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('AuthorScreen', {
              username: article.author_username,
              id: article.author_id,
            })
          }
          style={{ alignSelf: 'flex-start' }}
        >
          <CustomText
            style={{ alignSelf: 'flex-start', fontSize: 18, marginTop: 10 }}
          >
            {t('articleAuthor')}: {article.author_name}
          </CustomText>
        </TouchableOpacity>

        <View style={styles.commentWrapper}>
          <CustomText style={{ fontSize: 16 }}>{t('comments')}</CustomText>
          <TouchableOpacity onPress={() => setShowModal(true)}>
            <CustomText style={styles.leaveCommentBtn}>
              {t('leaveComment')}
            </CustomText>
          </TouchableOpacity>
        </View>

        {showModal && (
          <LeaveCommentModal
            setShowModal={setShowModal}
            productId={article.id}
            commentData={commentData}
            setCommentData={setCommentData}
            postComment={postComment}
          />
        )}
        <CommentSection
          comments={comments}
          setShowModal={setShowModal}
          setCommentParentId={setCommentParentId}
        />
      </View>
    </ScrollView>
  )
}

export default SingleArticle

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 5,
    alignItems: 'center',
    paddingBottom: 40,
  },
  articleTitle: {
    fontSize: 18,
    fontFamily: FONT_MAPPER.FontBold,
  },
  articleImage: {
    width: '95%',
    height: 250,
    marginVertical: 30,
  },
  articleDateAndCategorie: {
    width: '100%',
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderColor: 'black',
    borderBottomWidth: 1,
    paddingBottom: 10,
    marginBottom: 20,
  },
  fontText: {
    fontSize: 16,
  },
  commentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderColor: 'black',
    width: '100%',
    marginTop: 10,
  },
  leaveCommentBtn: {
    backgroundColor: 'green',
    color: 'white',
    padding: 15,
  },
})
