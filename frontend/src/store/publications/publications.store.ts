import { inject, provide } from 'vue';
import { publicationsStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import { ICreatePublication, IApiPublication, IPublication } from '@/interface/publications/publication';
import { metaLinksStore } from '../metadata/state';
import { asyncCall } from '../api/api.store';

export const publicationsStoreProvider = () => {
  provide('publicationsStore', publicationsStore);
};

export function usePublications() {
  const {
    setPublications,
    getAllPublications,
    updatePublication,
    clearPublications,
    removePublication,
    updateLikePublication,
    ...rest
  } = inject('publicationsStore') as typeof publicationsStore;

  const {
    getAllPostsCall,
    deletePublicationCall,
    createPublicationCall,
    editPublicationCall,
    getPostByIdCall,
    likePublicationCall,
    signalPublication,
    getPostsByUserIdCall,
  } = useApi();

  const fetchPublications = async (page?: number) => {
    const publications = await asyncCall('GET_PUBLICATIONS', () => getAllPostsCall(page));
    if (!publications) return;

    publications.forEach((publication) => {
      setPublications([{ ...publication, link: publication.link?.og.url }]);
      if (publication.link) {
        metaLinksStore.setData(publication.id, [publication.link]);
      }
    });
    const returnedPublications = publications.map((publication) => {
      return { ...publication, link: publication.link ? publication.link?.og.url : null };
    });
    return returnedPublications;
  };
  const fetchPublicationById = async (publicationId: number) => {
    const publication = await asyncCall('GET_PUBLICATION_BY_ID', () => getPostByIdCall(publicationId));
    if (!publication) return;

    setPublications([{ ...publication, link: publication.link?.og.url }]);
    if (publication.link) {
      metaLinksStore.setData(publication.id, [publication.link]);
    }
    return { ...publication, link: publication.link?.og.url };
  };

  const fetchPublicationsByUserId = async (userId: number) => {
    const publications = await asyncCall('GET_PUBLICATION_BY_USER_ID', () => getPostsByUserIdCall(userId));
    if (!publications) return;

    publications.forEach((publication) => {
      setPublications([{ ...publication, link: publication.link?.og.url }]);
      if (publication.link) {
        metaLinksStore.setData(publication.id, [publication.link]);
      }
    });
    const returnedPublications = publications.map((publication) => {
      return { ...publication, link: publication.link ? publication.link?.og.url : null };
    });
    return returnedPublications;
  };

  const createPublication = async (createdPost: ICreatePublication) => {
    if (createdPost.imageUrl) {
      const createdPublication = await asyncCall('CREATE_PUBLICATION', () =>
        createPublicationCall({ ...createdPost }, createdPost.imageUrl)
      );
      if (!createdPublication) return;

      setPublications([{ ...createdPublication, link: createdPublication.link?.og.url }]);
      return createdPublication;
    } else {
      const createdPublication = await asyncCall('CREATE_PUBLICATION', () => createPublicationCall({ ...createdPost }));

      if (!createdPublication) return;

      setPublications([{ ...createdPublication, link: createdPublication.link?.og.url }]);

      if (createdPublication.link) {
        metaLinksStore.setData(createdPublication.id, [createdPublication.link]);
      }
      return { ...createdPublication, link: createdPublication.link?.og.url };
    }
  };

  const deletePublication = async (publicationId: number) => {
    const deletedPublication = await asyncCall('DELETE_PUBLICATION', () => deletePublicationCall(publicationId));

    if (!deletedPublication.id) return;

    removePublication(publicationId);
    metaLinksStore.removeData(publicationId);
    return deletedPublication.id;
  };

  const editPublication = async (publicationId: number, editedPublication: ICreatePublication) => {
    if (editedPublication.imageUrl) {
      const resultEdition = await asyncCall('UPDATE_PUBLICATION', () =>
        editPublicationCall(publicationId, { ...editedPublication }, editedPublication.imageUrl)
      );
      if (!resultEdition) return;

      updatePublication(publicationId, { ...resultEdition, link: resultEdition.link?.og.url });
      return resultEdition;
    } else {
      const resultEdition = await asyncCall('UPDATE_PUBLICATION', () =>
        editPublicationCall(publicationId, { ...editedPublication })
      );
      if (!resultEdition) return;

      updatePublication(publicationId, resultEdition as Partial<IPublication>);
      if (resultEdition.link) {
        metaLinksStore.updateData(publicationId, resultEdition.link);
      }

      return { ...resultEdition, link: resultEdition.link?.og.url };
    }
  };
  const likePublication = async (publicationId: number, userId: number) => {
    const likedPublication = await asyncCall('LIKE_PUBLICATION', () => likePublicationCall(publicationId, userId));

    if (!likedPublication) return;

    updateLikePublication(publicationId, userId);
    return likedPublication;
  };

  const signalUserPublication = async (publicationId: number) => {
    const signaledPublication = await asyncCall('SIGNAL_PUBLICATION', () => signalPublication(publicationId));
    if (!signaledPublication) return;
    return signaledPublication;
  };

  return {
    fetchPublications,
    fetchPublicationById,
    createPublication,
    deletePublication,
    editPublication,
    getAllPublications,
    likePublication,
    signalUserPublication,
    fetchPublicationsByUserId,
    ...rest,
  };
}
