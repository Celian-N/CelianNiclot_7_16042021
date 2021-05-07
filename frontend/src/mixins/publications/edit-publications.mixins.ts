import { ICreatePublication } from '@/interface/publications/publication';
import { ref, SetupContext } from 'vue';
import { fetchGifs } from '../../helpers/gifs/gifs';

export const embedRegex = /^(https|http):\/\/(?:www\.)?youtube-nocookie.com\/embed\/[A-z0-9]+/;

export const useEditPublications = (context: SetupContext) => {
  const fileInput = ref<HTMLInputElement | null>(null);
  const previewImage = ref<string | undefined | null>(null);
  const writeVideoLink = ref<string | undefined | null>(null);
  const gifs = ref([]);
  const searchGif = ref('');
  const showAddLink = ref(false);

  const setVideo = (post: ICreatePublication) => {
    removeFiles(post);
    if (!writeVideoLink.value) return (post.videoUrl = null);
    const createdLink = createVideoLink(writeVideoLink.value);
    if (!createdLink) return (post.videoUrl = null);
    post.videoUrl = createdLink.match(embedRegex) ? createdLink : null;
  };
  const createVideoLink = (writeVideoLink: string) => {
    const splitLink = writeVideoLink.split('=');

    if (splitLink.length <= 1) return writeVideoLink;
    const videoId = splitLink[1].split('&')[0];
    if (videoId.length !== 11) return;
    return `https://www.youtube-nocookie.com/embed/${videoId}`;
  };

  const pickFile = (post: ICreatePublication) => {
    removeFiles(post);
    if (!fileInput.value) return;

    const file = fileInput.value.files;

    if (file && file[0]) {
      if (file[0].size >= 4 * 1024 * 1024) {
        alert('Your file is too big to be upload on post');
      }
      post.imageUrl = file[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) return;
        previewImage.value = e.target.result as string;
      };
      reader.readAsDataURL(file[0]);
      context.emit('input', file[0]);
    }
  };
  const selectImage = () => {
    if (!fileInput.value) return;
    fileInput.value.click();
  };
  const onDeleteImage = (post: ICreatePublication) => {
    post.imageUrl = null;
    previewImage.value = null;
    if (!fileInput.value) return;
    fileInput.value.value = '';
  };
  const getGifs = async (searchGif: string) => {
    gifs.value = await fetchGifs(searchGif);
  };
  const selectGif = (post: ICreatePublication, gifIndex: number) => {
    removeFiles(post);
    post.gifUrl = gifs.value[gifIndex];
    searchGif.value = '';
    gifs.value = [];
  };
  const setInitPost = (post: ICreatePublication) => {
    previewImage.value = null;
    writeVideoLink.value = null;
    post.text = null;
    post.imageUrl = null;
    post.gifUrl = null;
    post.videoUrl = null;
    post.link = null;
  };
  const removeFiles = (post: ICreatePublication) => {
    if (post.imageUrl || previewImage.value) {
      return onDeleteImage(post);
    }
    if (post.gifUrl) {
      return (post.gifUrl = null);
    }
    if (post.videoUrl) {
      writeVideoLink.value = '';
      return (post.videoUrl = null);
    }
  };

  return {
    setVideo,
    getGifs,
    setInitPost,
    selectGif,
    selectImage,
    pickFile,
    removeFiles,
    fileInput,
    previewImage,
    writeVideoLink,
    showAddLink,
    searchGif,
    gifs,
  };
};
