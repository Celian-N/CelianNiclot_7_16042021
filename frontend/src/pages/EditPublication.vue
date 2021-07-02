<template>
  <div class="column bg-white main-shadow pa-sm br-md">
    <div class="row items-start">
      <Avatar size="50px" :userPic="user.userPic" />
      <InputField
        autogrow
        @onInput="(val) => (editedPost.text = val)"
        :value="editedPost.text"
        :maxLength="500"
        placeholder="Texte modifié..."
        class="full-width mb-md"
        :customTextareaClass="'pt-xs'"
        :withBackground="false"
      />
    </div>
    <hr class="full-width vertical-separator mb-sm" />
    <div class="row items-center justify-around buttons-container">
      <button class="row items-center justify-center">
        <label for="image" class="row items-center justify-center">
          <span class="material-icons-round text-secondary">photo_camera</span>
          <span class="title-button">Image</span>
        </label>
      </button>
      <button class="row items-center justify-center" @click="showVideo">
        <span class="fab fa-youtube text-secondary"></span>
        <span class="title-button">Vidéo</span>
      </button>
      <button class="row items-center justify-center" @click="showModal = true">
        <div class="bg-secondary br-xs row items-center justify-center mr-xs gif-span-container" style="padding: 0 2px">
          <span class="material-icons-round text-white gif-span">gif</span>
        </div>
        <span class="title-button">Gif</span>
      </button>
      <button class="row items-center justify-center" @click="showArticle">
        <span class="material-icons-round text-secondary">link</span>
        <span class="title-button">Lien</span>
      </button>
    </div>

    <input
      id="image"
      ref="fileInput"
      name="image"
      type="file"
      class="input-file"
      accept="image/*"
      @input="pickFile(editedPost)"
    />

    <InputField
      v-if="showVideoLink"
      id="video"
      name="video"
      type="url"
      placeholder="Lien de la vidéo youtube"
      @onInput="(val) => (writeVideoLink = val)"
      :value="writeVideoLink"
      borderRadius="8px"
      class="my-md"
      @onClick="setVideo(editedPost)"
      :button="{
        icon: 'search',
        color: 'secondary',
        size: '30px',
      }"
    />

    <InputField
      v-if="showAddLink"
      type="url"
      @onInput="(val) => (writeArticleLink = val)"
      :value="writeArticleLink"
      placeholder="Lien de l'article"
      borderRadius="8px"
      class="my-md"
      @onClick="onSetArticle"
      :button="{
        icon: 'search',
        color: 'secondary',
        size: '30px',
      }"
    />
    <div
      v-if="editedPost.videoUrl || editedPost.gifUrl || editedPost.imageUrl || editedPost.link"
      class="row justify-center my-md overflow-hidden full-width"
    >
      <div class="position-relative full-width">
        <button
          @click="removeFiles(editedPost)"
          class="position-absolute close-button row items-center justify-center"
          style="top: 0; right: 0"
        >
          <span class="material-icons-round text-primary">close</span>
        </button>

        <div v-if="previewImage">
          <div
            class="image-preview-wrapper br-sm"
            :style="{ 'background-image': `url(${previewImage})` }"
            @click="selectImage"
          ></div>
        </div>
        <div v-if="editedPost.link">
          <Article v-if="articleData.og" :article="articleData" :editingMode="true" />
        </div>
        <div v-if="editedPost.videoUrl" class="full-width">
          <iframe
            width="100%"
            height="315"
            :src="editedPost.videoUrl"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
            class="br-sm"
          ></iframe>
        </div>

        <div v-if="editedPost.gifUrl">
          <img :src="editedPost.gifUrl" class="br-sm" style="max-width: 100%" />
        </div>
      </div>
    </div>

    <button class="post-button bg-primary text-white br-sm py-xs mt-sm" @click="onSaveEditedPost">Enregistrer</button>
    <button class="post-button bg-white text-primary br-sm py-xs mt-sm" @click="closeEditingMode">Annuler</button>

    <Dialog :showModal="showModal" @close="showModal = false">
      <template v-slot:header>
        <div class="column justify-center">
          <button @click="showModal = false" class="close-button-modal self-end row items-center justify-center">
            <span class="material-icons-round text-primary">close</span>
          </button>
          <InputField
            id="Gif"
            name="Gif"
            placeholder="Rechercher"
            @onInput="(val) => (searchGif = val)"
            :value="searchGif"
            borderRadius="8px"
            class="my-md self-center full-width"
            @onClick="getGifs(searchGif)"
            :button="{
              icon: 'search',
              color: 'secondary',
              size: '30px',
            }"
          />
        </div>
      </template>
      <template v-slot:body>
        <div class="row items-center justify-center">
          <div v-if="gifs.length" class="gif-container">
            <img v-for="(gif, index) in gifs" :src="gif" :key="gif.id" class="gif" @click="onSelectGif(index)" />
          </div>
        </div>
      </template>
    </Dialog>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext, onMounted, watch, computed } from 'vue';
import { ICreatePublication, IPublication } from '../interface/publications/publication';
import { usePublications } from '../store/publications/publications.store';
import { useUser } from '../store/user/user.store';
import { useRouter } from 'vue-router';
import { useEditPublications } from '../mixins/publications/edit-publications.mixins';
import { useApi } from '../mixins/api/api.mixins';
import Avatar from '../components/Avatar/Avatar.vue';
import InputField from '../components/InputField/InputField.vue';
import Dialog from '../components/Dialog/Dialog.vue';
import { showSuccessBanner, showErrorBanner } from '../mixins/banners/banners.mixins';
import Article from '../components/Article/Article.vue';

export default defineComponent({
  name: 'EditPublicationPage',
  components: {
    Avatar,
    InputField,
    Dialog,
    Article,
  },
  setup(props, context: SetupContext) {
    const { getCurrentUser } = useApi();
    const showModal = ref(false);

    const useEditPost = useEditPublications(context);

    const { editPublication, getPublicationById, fetchPublicationById } = usePublications();
    const { getUser } = useUser();
    const user = computed(() => getUser.value);

    const route = useRouter();

    const router = useRouter();

    const { publicationId } = route.currentRoute.value.params;

    const editedPostId = ref(publicationId as string);

    const editedPost = ref<ICreatePublication>({
      imageUrl: undefined,
      videoUrl: undefined,
      gifUrl: undefined,
      text: undefined,
      link: undefined,
    });

    const allEditedPost = computed(() => getPublicationById(editedPostId.value) as IPublication);

    const onSaveEditedPost = async () => {
      if (
        !editedPost.value.text &&
        !editedPost.value.imageUrl &&
        !editedPost.value.gifUrl &&
        !editedPost.value.videoUrl &&
        !editedPost.value.link
      )
        return showErrorBanner('Impossible de modifier une publication vide');
      const result = await editPublication(parseInt(editedPostId.value), editedPost.value);
      if (!result) return showErrorBanner('Impossible de modifier la publication');
      showSuccessBanner('Publication modifiée avec succès !');
      router.push({ name: 'Home' });
    };

    const onSelectGif = (gifIndex: number) => {
      useEditPost.selectGif(editedPost.value, gifIndex);
      showModal.value = false;
    };

    const onSetArticle = async () => {
      const articleUrl = await useEditPost.setArticle();
      if (!articleUrl) return;
      editedPost.value.link = articleUrl;
    };

    const closeEditingMode = () => {
      router.push({ name: 'Home' });
    };

    watch(
      () => route.currentRoute.value.params.publicationId,
      (newValue) => {
        editedPostId.value = newValue as string;
      }
    );

    onMounted(async () => {
      if (!allEditedPost.value) {
        const currentUserId = ref(user.value.id);
        if (currentUserId.value == 0) {
          const currentUser = await getCurrentUser();
          currentUserId.value = currentUser.id;
        }
        const publication = await fetchPublicationById(parseInt(editedPostId.value));
        if (!publication) return router.push({ name: 'Home' });

        if (publication.authorId !== currentUserId.value) {
          console.warn('Vous ne pouvez pas modifier cette publication');
          return router.push({ name: 'Home' });
        }
        useEditPost.previewImage.value = publication.imageUrl || undefined;
        editedPost.value.gifUrl = publication.gifUrl || undefined;
        editedPost.value.videoUrl = publication.videoUrl || undefined;
        editedPost.value.text = publication.text || undefined;
        editedPost.value.link = publication.link || undefined;
        useEditPost.showAddLink.value = editedPost.value.link ? true : false;
        if (editedPost.value.link) {
          useEditPost.writeArticleLink.value = editedPost.value.link;
          await useEditPost.setArticle();
        }
        return;
      }
      if (allEditedPost.value.authorId !== user.value.id) {
        console.warn('Vous ne pouvez pas modifier cette publication');
        return router.push({ name: 'Home' });
      }

      useEditPost.previewImage.value = allEditedPost.value.imageUrl || undefined;
      editedPost.value.gifUrl = allEditedPost.value.gifUrl || undefined;
      editedPost.value.videoUrl = allEditedPost.value.videoUrl || undefined;
      editedPost.value.text = allEditedPost.value.text || undefined;
      editedPost.value.link = allEditedPost.value.link || undefined;
      useEditPost.showAddLink.value = editedPost.value.link ? true : false;
      if (editedPost.value.link) {
        useEditPost.writeArticleLink.value = editedPost.value.link;
        await useEditPost.setArticle();
      }
      return;
    });

    return {
      editedPost,
      onSaveEditedPost,
      closeEditingMode,
      ...useEditPost,
      onSelectGif,
      showModal,
      onSetArticle,
      user,
    };
  },
});
</script>

<style scoped lang="scss">
textarea {
  resize: none;
  flex: 1 1 0;
  border: none;
  padding: 15px 0 0 10px;
  font-family: 'Poppins';
  height: 120px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
  }
  &:focus {
    outline: none;
  }
}
.buttons-container > * {
  cursor: pointer;
  border: none;
  width: 100px;
  border-radius: 10px;
  padding: 8px 0;
  min-height: 35px;
  background: rgba(#50505096, 0.05);
  transition: all 300ms;
  font-family: 'Poppins';
  & label {
    cursor: pointer;
  }
  & .gif-span {
    margin-right: 0px !important;
  }
  & span:nth-child(1) {
    font-size: 25px;
    margin-right: 8px;
  }
  &:hover {
    background: rgba(#50505096, 0.15);
  }
}
.image-preview-wrapper {
  width: 250px;
  height: 250px;
  display: block;
  cursor: pointer;
  background-size: cover;
  background-position: center center;
}

.label-file {
  cursor: pointer;
  color: #00b1ca;
  font-weight: bold;
}
.label-file:hover {
  color: #25a5c4;
}

.input-file {
  display: none;
}
.gif-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
}
.gif {
  cursor: pointer;
  width: 100px;
  height: 100px;
}
.post-button {
  border: none;
  cursor: pointer;
  font-family: 'Poppins';
  font-weight: 600;
  letter-spacing: 1px;
  transition: opacity 300ms;
  &:hover {
    opacity: 0.8;
  }
}
.close-button {
  border-radius: 0 12px 0 12px;
  transition: background 300ms;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: rgba(#50505096, 0.8);
  & span {
    color: white !important;
  }
  &:hover {
    background: #e22a7f !important;
  }
}
.close-button-modal {
  border-radius: 30px;
  transition: background 300ms;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  background: transparent;
  &:hover {
    background: rgba(#50505096, 0.05) !important;
  }
}
@media screen and (max-width: 500px) {
  .title-button {
    display: none;
  }
  .buttons-container > * {
    width: 50px;
    & span:nth-child(1) {
      margin: 0;
    }
    & .gif-span-container {
      margin: 0;
    }
  }
  .material-icons-round {
    margin: 0;
  }
}
</style>
