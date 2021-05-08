import { inject, provide } from 'vue';
import { publicationsStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import { ICreatePublication, IPublication } from '@/interface/publications/publication';

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
  } = useApi();

  const fetchPublications = async (page?:number) => {
    const publications = await getAllPostsCall(page);
    if (!publications) return;

    setPublications(publications);
    return publications;
  };
  const fetchPublicationById = async (publicationId: number) => {
    const publication = await getPostByIdCall(publicationId);
    if (!publication) return;

    setPublications([publication]);
    return publication;
  };

  const createPublication = async (createdPost: ICreatePublication) => {
    if (createdPost.imageUrl) {
      const createdPublication = (await createPublicationCall(
        { ...createdPost },
        createdPost.imageUrl
      )) as IPublication;
      if (!createdPublication) return;

      setPublications([createdPublication]);
      return createdPublication;
    } else {
      const createdPublication = (await createPublicationCall({ ...createdPost })) as IPublication;
      if (!createdPublication) return;

      setPublications([createdPublication]);
      return createdPublication;
    }
  };

  const deletePublication = async (publicationId: number) => {
    const deletedPublication = await deletePublicationCall(publicationId);

    if (!deletedPublication.id) return;

    removePublication(publicationId);
    return deletedPublication.id;
  };

  const editPublication = async (publicationId: number, editedPublication: ICreatePublication) => {
    if (editedPublication.imageUrl) {
      const resultEdition = await editPublicationCall(
        publicationId,
        { ...editedPublication },
        editedPublication.imageUrl
      );
      if (!resultEdition) return;

      updatePublication(publicationId, resultEdition);
      return resultEdition;
    } else {
      const resultEdition = await editPublicationCall(publicationId, { ...editedPublication });
      if (!resultEdition) return;

      updatePublication(publicationId, resultEdition);
      return resultEdition;
    }
  };
  const likePublication = async(publicationId : number, userId : number)=>{
    const likedPublication = await likePublicationCall(publicationId, userId);

    if (!likedPublication) return;

    updateLikePublication(publicationId, userId);
    return likedPublication
  }

  return {
    fetchPublications,
    fetchPublicationById,
    createPublication,
    deletePublication,
    editPublication,
    getAllPublications,
    likePublication,
    ...rest,
  };
}
