import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Comments } from '../../../common/services/comments/types'
import { t } from 'i18next'
import { CustomText } from '../../custom'
import { FONT_MAPPER } from '../../custom/enums'

interface CommentSectionProps {
  comments?: Comments[]
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>
  setCommentParentId: (id: number) => void
}

const CommentSection = ({
  comments,
  setShowModal,
  setCommentParentId,
}: CommentSectionProps) => {
  const handleChildCommentDisplay = (childComment: Comments) => {
    return (
      <View key={childComment.id} style={child.childCommet}>
        <View style={child.authorAndDateCont}>
          <CustomText weight={FONT_MAPPER.FontBold} style={child.author}>
            {childComment.author_name}
          </CustomText>
          <CustomText style={child.date}>{childComment.date}</CustomText>
        </View>
        <CustomText style={child.childContent}>
          {childComment.comment_content}
        </CustomText>
      </View>
    )
  }

  const handleReplyComment = (comment: Comments) => {
    // when reply, send id of parrent of comment
    setCommentParentId(comment.id)
    setShowModal(true)
  }

  return (
    <View style={styles.container}>
      {comments &&
        comments.map((comment) => (
          <View style={styles.commentWrapper} key={comment.id}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: 15,
              }}
            >
              <CustomText
                weight={FONT_MAPPER.FontBold}
                style={styles.commentAuthor}
              >
                {comment.author_name}
              </CustomText>
              <CustomText style={styles.commentDate}>{comment.date}</CustomText>
            </View>
            <CustomText style={styles.commentContent}>
              {comment.comment_content}
            </CustomText>
            <TouchableOpacity onPress={() => handleReplyComment(comment)}>
              <CustomText style={styles.answerButton}>
                {t('replyComment')}
              </CustomText>
            </TouchableOpacity>
            {comment.child_comments &&
              comment.child_comments.map((childComment) =>
                handleChildCommentDisplay(childComment),
              )}
          </View>
        ))}
    </View>
  )
}

export default CommentSection

const styles = StyleSheet.create({
  container: {
    paddingBottom: 30,
    width: '100%',
  },
  commentWrapper: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  commentAuthor: {
    fontSize: 18,
  },
  commentDate: {
    fontSize: 16,
  },
  commentContent: {
    fontSize: 16,
    marginBottom: 10,
  },
  answerButton: {
    fontSize: 16,
    padding: 5,
    backgroundColor: 'green',
    color: 'white',
    width: '25%',
    textAlign: 'center',
    marginVertical: 15,
  },
})

const child = StyleSheet.create({
  childCommet: {
    paddingLeft: 30,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  authorAndDateCont: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  childContent: {
    fontSize: 16,
  },
  author: {
    fontSize: 18,
  },
  date: {
    fontSize: 16,
  },
})
