import { IComment } from '@/interface/comments/comments';
import { readonly, ref, computed } from 'vue';

type CommentStateInterface = Record<string, IComment>;

const commentsState = ref<CommentStateInterface>({});

const setters = {
  setComments: (comments: IComment[]) => {
    comments.forEach((comment) => {
        commentsState.value = { ...commentsState.value, [comment.id]: comment };
    });
  },
  removeComment: (commentId: number) => {
    const copy = { ...commentsState.value };
    delete copy[commentId];
    commentsState.value = { ...copy };
  },
  updateComment: (commentId: number, updatedComment : string) => {
    commentsState.value = {
      ...commentsState.value,
      [commentId]: { ...commentsState.value[commentId], text : updatedComment },
    };
  },
  updateLikeComment: (commentId: number, userId: number) => {
    const copy = commentsState.value[commentId].userLiked;
    const userIndex = copy.indexOf(userId);
    if (userIndex >= 0) {
      copy.splice(userIndex, 1);
    } else {
      copy.push(userId);
    }
    commentsState.value = {
      ...commentsState.value,
      [commentId]: { ...commentsState.value[commentId], userLiked: copy },
    };
  },
  clearComments: () => {
    commentsState.value = {};
  },
};

const getters = {
  getAllComments: computed(() => Object.values(commentsState.value)),
  getCommentById: (id: string, omittedValues?: Array<keyof IComment>) => {
    if (!omittedValues) return commentsState.value[id];
    const copy = { ...commentsState.value[id] };
    omittedValues.forEach((key) => {
      delete copy[key];
    });
    return copy;
  },
  getMyComments:(userId:number)=>{
    return Object.values(commentsState.value).filter(comment => comment.authorId == userId)
  },
  getCommentsByPublication:(publicationId:number)=>{
   return  Object.values(commentsState.value).filter(comment => comment.publicationId == publicationId)
  }
};

export const commentsStore = {
  commentsState: readonly(commentsState),
  ...setters,
  ...getters,
};
