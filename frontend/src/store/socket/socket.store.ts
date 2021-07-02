import { inject, provide } from 'vue';
import { socketStore } from './state';

export const socketStoreProvider = () => {
  provide('socketStore', socketStore);
};

export function useSocket() {
  const { ...rest } = inject('socketStore') as typeof socketStore;

  return { ...rest };
}
