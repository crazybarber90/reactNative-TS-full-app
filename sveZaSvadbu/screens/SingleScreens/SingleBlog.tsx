import React, { useEffect, useState } from 'react'
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native'
import { Blog } from '../../../common/services/blogs/types'
import ImageGallery from '../../components/ImageGallery/ImageGallery'
import { useGetComments } from '../../../common/services/comments/useGetComments'
import { usePostComment } from '../../../common/services/comments/usePostComments'
import { CommentDataTypes } from './SingleProduct'
import Toast from 'react-native-toast-message'
import LeaveCommentModal from '../../components/LeaveCommentModal/LeaveCommentModal'
import CommentSection from '../../components/LeaveCommentModal/CommentSection'
import { t } from 'i18next'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

const SingleBlog = ({ route }: { route: any }) => {
  const { blog }: { blog: Blog } = route.params

  const { data: comments } = useGetComments(blog.id)
  const { mutateAsync: postComment, isSuccess } = usePostComment()

  const [showModal, setShowModal] = useState(false)
  const [galleryVisible, setGalleryVisible] = useState(false)
  const [commentData, setCommentData] = useState<CommentDataTypes>({
    author_name: '',
    comment_content: '',
    comment_parent_id: null,
  })
  const closeGallery = () => setGalleryVisible(false)
  const openGallery = () => setGalleryVisible(true)

  const setCommentParentId = (id: number) => {
    setCommentData({ ...commentData, comment_parent_id: id })
  }

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
      <View style={{ flex: 1 }}>
        <CustomText style={styles.blogTitle}>{blog.name}</CustomText>
        <Image source={{ uri: blog.image }} style={styles.imageContainer} />
        <View style={styles.blogAndCategorie}>
          <CustomText
            style={{ fontSize: 16, fontFamily: FONT_MAPPER.FontBold }}
          >
            {t('blog')}
          </CustomText>
          <CustomText
            style={{ fontSize: 16, fontFamily: FONT_MAPPER.FontBold }}
          >
            {blog.category_name}
          </CustomText>
        </View>
        <View style={styles.description}>
          <CustomText>{blog.description}</CustomText>
        </View>
      </View>
      {blog.image_gallery && blog.image_gallery.length > 0 && (
        <ImageGallery
          galleryVisible={galleryVisible}
          closeGallery={closeGallery}
          openGallery={openGallery}
          imageGallery={blog.image_gallery}
        />
      )}

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
          productId={blog.id}
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
    </ScrollView>
  )
}

export default SingleBlog

const styles = StyleSheet.create({
  blogTitle: {
    fontSize: 18,
    fontFamily: FONT_MAPPER.FontBold,
    marginLeft: '5%',
    marginBottom: 10,
  },
  imageContainer: {
    width: 'auto',
    height: 400,
    resizeMode: 'contain',
  },
  blogAndCategorie: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    padding: '5%',
  },
  description: {
    width: '90%',
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderStyle: 'dotted',
    borderColor: 'black',
    alignSelf: 'center',
    paddingVertical: 5,
  },
  commentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
    borderBottomWidth: 1,
    borderColor: 'black',
    width: '90%',
    alignSelf: 'center',
    marginTop: 10,
  },
  leaveCommentBtn: {
    backgroundColor: 'green',
    color: 'white',
    padding: 15,
  },
})
