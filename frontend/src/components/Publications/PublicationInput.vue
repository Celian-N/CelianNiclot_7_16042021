<template>
  <div class="column bg-white main-shadow pa-sm br-md">
    <div class="row items-start">
      <Avatar size="50px" />
      <InputField
        autogrow
        @onInput="(val) => (text = val)"
        :value="text"
        :maxLength="500"
        :placeholder="`Quoi de neuf, ${username} ?`"
        class="full-width mb-md"
        :customTextareaClass="'pt-xs'"
        :withBackground="false"
      />
    </div>
    <hr class="full-width vertical-separator mb-sm" />
    <div class="row items-center justify-around buttons-container">
      <button class="row items-center justify-center">
        <label for="image" class="row items-center justify-center"
          ><span class="material-icons-round text-secondary">photo_camera</span> <span>Image</span></label
        >
      </button>
      <button class="row items-center justify-center" @click="showVideo">
        <span class="fab fa-youtube text-secondary"></span>
        <span>Vidéo</span>
      </button>
      <button class="row items-center justify-center" @click="showModal = true">
        <div class="bg-secondary br-xs row items-center justify-center mr-xs" style="padding: 0 2px">
          <span class="material-icons-round text-white gif-span">gif</span>
        </div>
        <span>Gif</span>
      </button>
      <button class="row items-center justify-center" @click="showArticle">
        <span class="material-icons-round text-secondary">link</span>
        <span>Lien</span>
      </button>
    </div>

    <input
      id="image"
      ref="fileInput"
      name="image"
      type="file"
      class="input-file"
      accept="image/*"
      @input="onPickFile"
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
      @onClick="onSetVideo"
      :button="{
        icon: 'search',
        color: 'secondary',
        size: '30px',
      }"
    />

    <InputField
      v-if="showAddLink"
      type="url"
      @onInput="(val) => writeArticleLink = val"
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
    <div v-if="videoUrl || gifUrl || imageUrl || link" class="row justify-center my-md overflow-hidden">
      <div class="position-relative">
        <button
          @click="onRemoveFiles"
          class="position-absolute close-button row items-center justify-center"
          style="top: 0; right: 0"
        >
          <span class="material-icons-round text-primary">close</span>
        </button>

        <div v-if="previewImage">
          <div
            class="imagePreviewWrapper br-sm"
            :style="{ 'background-image': `url(${previewImage})` }"
            @click="selectImage"
          ></div>
        </div>
        <div v-if="link">
          <Article :article="articleData" :editingMode="true"/>
        </div>
        <div v-if="videoUrl" class="br-sm">
          <iframe
            width="560"
            height="315"
            :src="videoUrl"
            title="YouTube video player"
            frameborder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen
          ></iframe>
        </div>

        <div v-if="gifUrl">
          <img :src="gifUrl" class="br-sm" />
        </div>
      </div>
    </div>

    <button class="post-button bg-primary text-white br-sm py-xs mt-sm" @click="onCreatePublication">Publier</button>

    <Dialog :showModal="showModal" @close="showModal = false">
      <template v-slot:header>
        <div class="column justify-center">
          <button @click="showModal = false" class="close-button self-end row items-center justify-center">
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
import { defineComponent, reactive, toRefs, SetupContext, ref } from 'vue';
import { ICreatePublication } from '../../interface/publications/publication';
import { usePublications } from '../../store/publications/publications.store';
import { useEditPublications } from '../../mixins/publications/edit-publications.mixins';
import Avatar from '../Avatar/Avatar.vue';
import InputField from '../InputField/InputField.vue';
import Dialog from '../Dialog/Dialog.vue';
import Article from '../Article/Article.vue'
import { showErrorBanner, showSuccessBanner } from '../../mixins/banners/banners.mixins';

//https://www.youtube.com/embed/Zwlaey0gu4c
//https://www.youtube.com/watch?v=Zwlaey0gu4c&ab_channel=GOTAGA
export default defineComponent({
  name: 'PublicationInput',
  components: {
    Avatar,
    InputField,
    Dialog,
    Article
  },
  props: {
    username: { type: String, required: true },
  },
  setup(props, context: SetupContext) {
    const useEditPost = useEditPublications(context);
    const { createPublication } = usePublications();
    const showModal = ref(false);

    const createdPost = reactive<ICreatePublication>({
      text: null,
      imageUrl: null,
      gifUrl: null,
      videoUrl: null,
      link: null,
    });

    const onCreatePublication = async () => {
      if (
        !createdPost.text &&
        !createdPost.imageUrl &&
        !createdPost.gifUrl &&
        !createdPost.videoUrl &&
        !createdPost.link
      )
        return;
      const result = await createPublication({ ...createdPost });
      if (!result) return showErrorBanner('Impossible de poster la publication');
      showSuccessBanner('Publication postée avec succès !');
      return useEditPost.setInitPost(createdPost);
    };

    const onSelectGif = (gifIndex: number) => {
      useEditPost.selectGif(createdPost, gifIndex);
      showModal.value = false;
    };
    const onRemoveFiles = () => {
      useEditPost.removeFiles(createdPost);
    };

    const onPickFile = () => {
      useEditPost.pickFile(createdPost);
    };

    const onSetVideo = () => {
      useEditPost.setVideo(createdPost);
    };
    const onSetArticle = async ()=>{
     const articleUrl =  await useEditPost.setArticle();
     if(!articleUrl) return;
     createdPost.link = articleUrl
    }

    return {
      ...toRefs(createdPost),
      ...useEditPost,
      onCreatePublication,
      onSelectGif,
      onRemoveFiles,
      onPickFile,
      onSetVideo,
      showModal,
      onSetArticle
    };
  },
});
</script>

<style lang="scss" scoped>
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
.imagePreviewWrapper {
  width: 250px;
  height: 250px;
  display: block;
  cursor: pointer;
  margin: 0 auto 30px;
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
.close-button {
  background: transparent;
  border-radius: 30px;
  transition: background 300ms;
  border: none;
  width: 30px;
  height: 30px;
  cursor: pointer;
  &:hover {
    background: rgba(#50505096, 0.05);
  }
}
</style>
