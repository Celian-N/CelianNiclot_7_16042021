import { IMetaLink } from '@/interface/publications/publication';
import { readonly, ref, provide, inject } from 'vue';

type MetaLinkStateInterface = Record<string, IMetaLink>;

const metaLinksState = ref<MetaLinkStateInterface>({});

const setters = {
  setData: (publicationId: number, metaData: IMetaLink[]) => {
    metaData.forEach((data) => {
      metaLinksState.value = { ...metaLinksState.value, [publicationId]: data };
    });
  },
  removeData: (publicationId: number) => {
    const copy = { ...metaLinksState.value };
    delete copy[publicationId];
    metaLinksState.value = { ...copy };
  },
  updateData: (publicationId: number, updatedProperties: Partial<IMetaLink>) => {
    metaLinksState.value = {
      ...metaLinksState.value,
      [publicationId]: { ...metaLinksState.value[publicationId], ...updatedProperties },
    };
  },
};

const getters = {
  getDataById: (publicationId: number) => metaLinksState.value[publicationId],
};

export const metaLinksStore = {
  metaLinksState: readonly(metaLinksState),
  ...setters,
  ...getters,
};

export const metaLinksStoreProvider = () => {
  provide('metaLinksStore', metaLinksStore);
};

export const useMetaLinks = () => {
  const { ...rest } = inject('metaLinksStore') as typeof metaLinksStore;

  return { ...rest };
};
