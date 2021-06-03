import { inject, provide } from 'vue';
import { publicationsStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import { ICreatePublication, IApiPublication } from '@/interface/publications/publication';
import { metaLinksStore } from '../metadata/state';

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
    signalPublication
  } = useApi();

  const fetchPublications = async (page?: number) => {
    const publications = (await getAllPostsCall(page)) as IApiPublication[];
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
    const publication = (await getPostByIdCall(publicationId)) as IApiPublication;
    if (!publication) return;

    setPublications([{ ...publication, link: publication.link?.og.url }]);
    if (publication.link) {
      metaLinksStore.setData(publication.id, [publication.link]);
    }
    return { ...publication, link: publication.link?.og.url };
  };

  const createPublication = async (createdPost: ICreatePublication) => {
    if (createdPost.imageUrl) {
      const createdPublication = (await createPublicationCall(
        { ...createdPost },
        createdPost.imageUrl
      )) as IApiPublication;
      if (!createdPublication) return;

      setPublications([{ ...createdPublication, link: createdPublication.link?.og.url }]);
      return createdPublication;
    } else {
      const createdPublication = (await createPublicationCall({ ...createdPost })) as IApiPublication;

      if (!createdPublication) return;

      setPublications([{ ...createdPublication, link: createdPublication.link?.og.url }]);

      if (createdPublication.link) {
        metaLinksStore.setData(createdPublication.id, [createdPublication.link]);
      }
      return { ...createdPublication, link: createdPublication.link?.og.url };
    }
  };

  const deletePublication = async (publicationId: number) => {
    const deletedPublication = await deletePublicationCall(publicationId);

    if (!deletedPublication.id) return;

    removePublication(publicationId);
    metaLinksStore.removeData(publicationId);
    return deletedPublication.id;
  };

  const editPublication = async (publicationId: number, editedPublication: ICreatePublication) => {
    if (editedPublication.imageUrl) {
      const resultEdition = (await editPublicationCall(
        publicationId,
        { ...editedPublication },
        editedPublication.imageUrl
      )) as IApiPublication;
      if (!resultEdition) return;

      updatePublication(publicationId, { ...resultEdition, link: resultEdition.link?.og.url });
      return resultEdition;
    } else {
      const resultEdition = await editPublicationCall(publicationId, { ...editedPublication });
      if (!resultEdition) return;

      updatePublication(publicationId, resultEdition);
      if (resultEdition.link) {
        metaLinksStore.updateData(publicationId, resultEdition.link);
      }

      return { ...resultEdition, link: resultEdition.link?.og.url };
    }
  };
  const likePublication = async (publicationId: number, userId: number) => {
    const likedPublication = await likePublicationCall(publicationId, userId);

    if (!likedPublication) return;

    updateLikePublication(publicationId, userId);
    return likedPublication;
  };

  const signalUserPublication = async(publicationId : number)=>{
    const signaledPublication = await signalPublication(publicationId)
    if(!signaledPublication) return;
    return signaledPublication
  }

  return {
    fetchPublications,
    fetchPublicationById,
    createPublication,
    deletePublication,
    editPublication,
    getAllPublications,
    likePublication,
    signalUserPublication,
    ...rest,
  };
}
