import { inject, provide } from 'vue';
import { commentsStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import { IComment } from '@/interface/comments/comments';

export const commentsStoreProvider = () => {
  provide('commentsStore', commentsStore);
};

export function useComments() {
  const { setComments, getAllComments, updateComment, clearComments, removeComment, ...rest } = inject(
    'commentsStore'
  ) as typeof commentsStore;

  const { getCommentsCall, createCommentCall, deleteCommentCall, editCommentCall } = useApi();

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
    console.log('editedComment :', editedComment)
    if (!editedComment) return;
  
    updateComment(commentId,  newComment);
    return editedComment;
  };

  return {
    fetchFirstComment,
    fetchMorePublicationComments,
    createComment,
    deleteComment,
    editComment,
    ...rest,
  };
}


// const deleteComment = async (commentId: number) => {
//   const deletedComment = await deleteCommentCall(commentId);

//   if (!deletedComment.id) return;

//   removeComment(commentId);
//   return deletedComment.id;
// };

// const editComment = async (commentId: number, editedComment: ICreateComment) => {
//   if (editedComment.imageUrl) {
//     const resultEdition = await editCommentCall(
//       commentId,
//       { ...editedComment },
//       editedComment.imageUrl
//     );
//     if (!resultEdition) return;

//     updateComment(commentId, resultEdition);
//     return resultEdition;
//   } else {
//     const resultEdition = await editCommentCall(commentId, { ...editedComment });
//     if (!resultEdition) return;

//     updateComment(commentId, resultEdition);
//     return resultEdition;
//   }
// };
