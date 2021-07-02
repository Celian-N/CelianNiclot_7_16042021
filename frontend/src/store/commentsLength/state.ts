import { readonly, ref, provide, inject } from 'vue';

type CommentsLengthStateInterface = Record<number, number>;

const commentsLengthState = ref<CommentsLengthStateInterface>({});

const setters = {
  setComment: (publicationId: number, length: number) => {
    commentsLengthState.value = { ...commentsLengthState.value, [publicationId]: length };
  },
  addComment: (publicationId: number) => {
    commentsLengthState.value = {
      ...commentsLengthState.value,
      [publicationId]: commentsLengthState.value[publicationId] + 1,
    };
  },
  removeComment: (publicationId: number) => {
    commentsLengthState.value = {
      ...commentsLengthState.value,
      [publicationId]: commentsLengthState.value[publicationId] - 1,
    };
  },
  clearComment: () => {
    commentsLengthState.value = {};
  },
};

const getters = {
  getCommentLengthById: (publicationId: number) => {
    return commentsLengthState.value[publicationId];
  },
};

export const commentsLengthStore = {
  commentsLengthState: readonly(commentsLengthState),
  ...setters,
  ...getters,
};

export const commentsLengthStoreProvider = () => {
  provide('commentsLengthStore', commentsLengthStore);
};

export function useCommentsLength() {
  const { getCommentLengthById, ...rest } = inject('commentsLengthStore') as typeof commentsLengthStore;

  return { getCommentLengthById, ...rest };
}
