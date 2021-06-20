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
    return authorsState.value[authorId] as IPublicationAuthor;
  },
  getAuthorIdByValue: (authorInfos: IPublicationAuthor) => {
    const index = Object.values(authorsState.value).findIndex(
      (author) =>
        !!(
          author.firstname == authorInfos.firstname &&
          author.lastname == authorInfos.lastname &&
          author.job == authorInfos.job
        )
    );
    return Object.keys(authorsState.value)[index];
  },
};

export const authorsStore = {
  authorsState: readonly(authorsState),
  ...setters,
  ...getters,
};

// console.log('author :', author)
// console.log('firstname :', author.firstname == authorInfos.firstname)
// console.log('lastname :', author.lastname == authorInfos.lastname)
// console.log('job :', author.job == authorInfos.job)