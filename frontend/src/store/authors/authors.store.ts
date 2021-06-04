import { inject, provide } from 'vue';
import { authorsStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';

export const authorsStoreProvider = () => {
  provide('authorsStore', authorsStore);
};

export function useAuthors() {
  const { setAuthor, ...rest } = inject('authorsStore') as typeof authorsStore;

  const { fetchAuthorInfosCall } = useApi();

  const fetchAuthorInfos = async (userId: number) => {
    const authorInfos = await fetchAuthorInfosCall(userId);
    if (!authorInfos) return;
    setAuthor(authorInfos, userId);
    return authorInfos;
  };

  return { fetchAuthorInfos, ...rest };
}
