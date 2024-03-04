import React from 'react'
import { UseMutateAsyncFunction } from '@tanstack/react-query'
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native'
import { CommentDataTypes } from '../../screens/SingleScreens/SingleProduct'
import Toast from 'react-native-toast-message'
import { t } from 'i18next'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

interface LeaveCommentModalProps {
  setShowModal: (show: boolean) => void
  productId: number
  commentData: CommentDataTypes
  setCommentData: React.Dispatch<React.SetStateAction<CommentDataTypes>>
  postComment: UseMutateAsyncFunction<any, unknown, CommentDataTypes, unknown>
}
const LeaveCommentModal = ({
  setShowModal,
  productId,
  commentData,
  setCommentData,
  postComment,
}: LeaveCommentModalProps) => {
  // CLEAR COMMENT DATA FROM STATE AND MODAL
  const defaultCommentData = {
    author_name: '',
    comment_content: '',
    comment_parent_id: null,
  }

  const resetCommentData = () => {
    setCommentData(defaultCommentData)
  }

  const handleAddComment = () => {
    commentData.singleContentId = productId
    // postComment post method for adding comments from RQ(usePostComments )

    if (commentData.author_name === '' || commentData.comment_content === '') {
      Toast.show({
        type: 'error',
        text1: 'Ispuni formu !',
      })
      return
    } else {
      postComment(commentData)
      resetCommentData()
    }
  }

  return (
    <View
      style={[
        styles.modalWrapper,
        Platform.OS === 'ios' && { marginBottom: 220 },
      ]}
    >
      <CustomText style={styles.topText}>{t('leaveComment')}</CustomText>
      <TextInput
        placeholder={t('commentAuthor')}
        value={commentData.author_name}
        onChangeText={(text) =>
          setCommentData({ ...commentData, author_name: text })
        }
        style={{
          padding: 10,
          width: '100%',
          marginVertical: 10,
          backgroundColor: 'white',
          fontFamily: FONT_MAPPER.FontNormal,
        }}
      />
      <TextInput
        placeholder={t('commentData')}
        value={commentData.comment_content}
        onChangeText={(text) =>
          setCommentData({ ...commentData, comment_content: text })
        }
        multiline={true} // Omogućava višelinijski unos
        numberOfLines={4} // Postavlja broj redova u prikazu
        style={{
          padding: 10,
          height: 100,
          width: '100%',
          backgroundColor: 'white',
          fontFamily: FONT_MAPPER.FontNormal,
        }}
      />
      <TouchableOpacity
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
          marginVertical: 20,
        }}
        onPress={handleAddComment}
      >
        <CustomText style={styles.submitBtn}>{t('commentSubmit')}</CustomText>
      </TouchableOpacity>
      <CustomText onPress={() => setShowModal(false)} style={styles.closeModal}>
        X
      </CustomText>
    </View>
  )
}

export default LeaveCommentModal

const styles = StyleSheet.create({
  modalWrapper: {
    bottom: 0,
    borderWidth: 1,
    width: '90%',
    height: 280,
    backgroundColor: '#f0eded',
    alignSelf: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    paddingTop: 15,
    position: 'relative',
  },
  topText: {
    fontSize: 20,
  },
  submitBtn: {
    backgroundColor: 'green',
    padding: 10,
    color: 'white',
    width: '100%',
    textAlign: 'center',
    fontSize: 16,
  },
  closeModal: {
    position: 'absolute',
    top: 5,
    right: 15,
    fontSize: 25,
  },
})
