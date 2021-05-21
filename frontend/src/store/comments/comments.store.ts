import { inject, provide } from 'vue';
import { commentsStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import { IComment } from '@/interface/comments/comments';

export const commentsStoreProvider = () => {
  provide('commentsStore', commentsStore);
};

export function useComments() {
  const {
    setComments,
    getAllComments,
    updateComment,
    clearComments,
    removeComment,
    updateLikeComment,
    ...rest
  } = inject('commentsStore') as typeof commentsStore;

  const { getCommentsCall, createCommentCall, deleteCommentCall, editCommentCall, likeCommentCall, getCommentsLengthCall } = useApi();

  const fetchFirstComment = async (publicationId: number) => {
    const comment = await getCommentsCall(publicationId);
    if (!comment) return;

    setComments(comment);
    return comment;
  };
  const fetchMorePublicationComments = async (publicationId: number, page: number) => {
    const comments = await getCommentsCall(publicationId, page);
    if (!comments) return;

    setComments(comments);
    return comments;
  };

  const fetchCommentsLength = async (publicationId : number) =>{
    const commentLength = await getCommentsLengthCall(publicationId);
    if (!commentLength) return 0;

    return commentLength;
  }

  const createComment = async (publicationId: number, newComment: string) => {
    const createdComment = (await createCommentCall(publicationId, newComment)) as IComment;
    if (!createdComment) return;

    setComments([createdComment]);
    return createdComment;
  };
  const deleteComment = async (commentId: number) => {
    const deletedComment = await deleteCommentCall(commentId);

    if (!deletedComment.id) return;

    removeComment(deletedComment.id);
    return deletedComment.id;
  };

  const editComment = async (commentId: number, newComment: string) => {
    const editedComment = (await editCommentCall(commentId, newComment)) as IComment;

    if (!editedComment) return;

    updateComment(commentId, newComment);
    return editedComment;
  };

  const likeComment = async (commentId: number, userId: number) => {
    const likedComment = await likeCommentCall(commentId, userId);

    if (!likedComment) return;

    updateLikeComment(commentId, userId);
    return likedComment;
  };

  return {
    fetchFirstComment,
    fetchMorePublicationComments,
    createComment,
    deleteComment,
    editComment,
    likeComment,
    fetchCommentsLength,
    ...rest,
  };
}