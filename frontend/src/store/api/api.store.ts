import { provide, ref, readonly, inject, computed } from 'vue';

export type RequestKeys =
  | 'LOGIN'
  | 'SIGNUP'
  | 'EDIT_USER'
  | 'SIGNUP'
  | 'GET_ARTICLE'
  | 'CREATE_PUBLICATION'
  | 'GET_PUBLICATIONS'
  | 'GET_PUBLICATION_BY_ID'
  | 'GET_PUBLICATION_BY_USER_ID'
  | 'UPDATE_PUBLICATION'
  | 'DELETE_PUBLICATION'
  | 'LIKE_PUBLICATION'
  | 'GET_AUTHOR_INFOS'
  | 'GET_CURRENT_USER'
  | 'GET_COMMENTS'
  | 'GET_COMMENTS_LENGTH'
  | 'CREATE_COMMENT'
  | 'DELETE_COMMENT'
  | 'UPDATE_COMMENT'
  | 'LIKE_COMMENT'
  | 'GET_SIGNALED_POSTS'
  | 'DELETE_POST_ADMIN'
  | 'IGNORE_POST_ADMIN'
  | 'BAN_USER_ADMIN'
  | 'SIGNAL_COMMENT'
  | 'SIGNAL_PUBLICATION'
  | 'CHANGE_CONV';

type AsyncStatusState = Record<RequestKeys, { isLoading: boolean }>;

const asyncStatus = ref<AsyncStatusState>({} as AsyncStatusState);

const setters = {
  startLoading: (requestKey: RequestKeys) => {
    asyncStatus.value = { ...asyncStatus.value, [requestKey]: { isLoading: true } };
  },
  endLoading: (requestKey: RequestKeys) => {
    asyncStatus.value = { ...asyncStatus.value, [requestKey]: { isLoading: false } };
  },
  clearAllData: (requestKey: RequestKeys) => {
    {
      asyncStatus.value = { ...asyncStatus.value, [requestKey]: { isLoading: false } };
    }
  },
};

const getters = {
  isLoading: (requestKeys: RequestKeys[] | RequestKeys) => {
    return computed(() => {
      if (Array.isArray(requestKeys)) {
        return !!requestKeys.find((key) => asyncStatus.value[key]?.isLoading);
      }

      return !!asyncStatus.value[requestKeys]?.isLoading;
    });
  }
};

export const asyncCall = async <T>(requestKey: RequestKeys, apiCall: () => Promise<T>) => {

  setters.startLoading(requestKey);
  try {
    const result = await apiCall();
    return result;
  } finally {
    setters.endLoading(requestKey);
  }
};

const apiStore = {
  asyncStatus: readonly(asyncStatus),
  ...setters,
  ...getters,
};

export const apiStoreProvider = () => {
  provide('apiStore', apiStore);
};

export const useApiStore = () => {
  const { isLoading,...rest } = inject('apiStore') as typeof apiStore;

  return { isLoading, ...rest };
};
