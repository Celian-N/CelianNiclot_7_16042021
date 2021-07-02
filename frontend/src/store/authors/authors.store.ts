import { inject, provide } from 'vue';
import { authorsStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import { asyncCall } from '../api/api.store';

export const authorsStoreProvider = () => {
  provide('authorsStore', authorsStore);
};

export function useAuthors() {
  const { setAuthor, ...rest } = inject('authorsStore') as typeof authorsStore;

  const { fetchAuthorInfosCall } = useApi();

  const fetchAuthorInfos = async (userId: number) => {
    const authorInfos = await asyncCall('GET_AUTHOR_INFOS', () => fetchAuthorInfosCall(userId));
    if (!authorInfos) return;
    setAuthor(authorInfos, userId);
    return authorInfos;
  };

  return { fetchAuthorInfos, ...rest };
}
