import { provide, ref, readonly, inject, computed } from 'vue';

export type RequestKeys =
  | 'LOGIN'
  | 'SIGNUP'
  | 'CREATE_PUBLICATION'
  | 'GET_PUBLICATIONS'
  | 'GET_PUBLICATION_BY_ID'
  | 'UPDATE_PUBLICATION'
  | 'DELETE_PUBLICATIONS'
  | 'LIKE_PUBLICATION'
  | 'GET_CURRENT_USER'
  | 'GET_COMMENTS'
  | 'CREATE_COMMENT'
  | 'DELETE_COMMENT'
  | 'UPDATE_COMMENT'
  | 'LIKE_COMMENT';

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
  const { isLoading } = inject('apiStore') as typeof apiStore;

  return { isLoading };
};
