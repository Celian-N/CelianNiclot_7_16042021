import { IPublication } from '@/interface/publications/publication';
import { readonly, ref, computed } from 'vue';

type PublicationStateInterface = Record<string, IPublication>;

const publicationsState = ref<PublicationStateInterface>({});

const setters = {
  setPublications: (publications: IPublication[]) => {
    publications.forEach((publication) => {
      publicationsState.value = { ...publicationsState.value, [publication.id]: publication };
    });
  },
  removePublication: (publicationId: number) => {
    const copy = { ...publicationsState.value };
    delete copy[publicationId];
    publicationsState.value = { ...copy };
  },
  updatePublication: (publicationId: number, updatedProperties: Partial<IPublication>) => {
    publicationsState.value = {
      ...publicationsState.value,
      [publicationId]: { ...publicationsState.value[publicationId], ...updatedProperties },
    };
  },
  updateLikePublication: (publicationId: number, userId: number) => {
    const copy = publicationsState.value[publicationId].userLiked;
    const userIndex = copy.indexOf(userId);
    if (userIndex >= 0) {
      copy.splice(userIndex, 1);
    } else {
      copy.push(userId);
    }
    publicationsState.value = {
      ...publicationsState.value,
      [publicationId]: { ...publicationsState.value[publicationId], userLiked: copy },
    };
  },
  clearPublications: () => {
    publicationsState.value = {};
  },
};

const getters = {
  getAllPublications: computed(() => Object.values(publicationsState.value)),
  getPublicationById: (id: string, omittedValues?: Array<keyof IPublication>) => {
    if (!omittedValues) return publicationsState.value[id];
    const copy = { ...publicationsState.value[id] };
    omittedValues.forEach((key) => {
      delete copy[key];
    });
    return copy;
  },
  getEditedPublicationById: (id: string) => {
    return {
      imageUrl: null,
      gifUrl: publicationsState.value[id] ? publicationsState.value[id].gifUrl : null,
      videoUrl: publicationsState.value[id] ? publicationsState.value[id].videoUrl : null,
      text: publicationsState.value[id] ? publicationsState.value[id].text : null,
      link: publicationsState.value[id] ? publicationsState.value[id].link : null,
    };
  },
  getEditedImageById: (id: string) => {
    return publicationsState.value[id] ? publicationsState.value[id].imageUrl : null;
  },
  getPublicationsByUserId : (userId : number)=>{
    return Object.values(publicationsState.value).filter(publication => publication.authorId == userId)
  }
};

export const publicationsStore = {
  publicationsState: readonly(publicationsState),
  ...setters,
  ...getters,
};
