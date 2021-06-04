import { IPublicationAuthor } from '@/interface/publications/publication';
import { readonly, ref, computed } from 'vue';

type AuthorsStateInterface = Record<number, IPublicationAuthor>;

const authorsState = ref<AuthorsStateInterface>({});

const setters = {
  setAuthor: (authorInfos: IPublicationAuthor, userId: number) => {
    authorsState.value = { ...authorsState.value, [userId]: authorInfos };
  },
  updateAuthors: (userId: number, updatedProperties: Partial<IPublicationAuthor>) => {
    authorsState.value = { ...authorsState.value, [userId]: { ...authorsState.value[userId], ...updatedProperties } };
  },
  clearAuthors: () => {
    authorsState.value = {};
  },
};

const getters = {
  getAllAuthorsInfos: computed(() => {
    return authorsState.value;
  }),
  getAuthorInfosById: (authorId: number) => {
    return authorsState.value[authorId];
  },
};

export const authorsStore = {
  authorsState: readonly(authorsState),
  ...setters,
  ...getters,
};
