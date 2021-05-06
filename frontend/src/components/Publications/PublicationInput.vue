<template>
  <div class="column">
    <textarea v-model="text" name="text" cols="30" rows="10" maxlength="500"></textarea>
    <input v-if="showAddLink" id="link" name="link" type="url" v-model="link" placeholder="Lien" />
    <div v-if="previewImage">
      <div
        class="imagePreviewWrapper"
        :style="{ 'background-image': `url(${previewImage})` }"
        @click="selectImage"
      ></div>
    </div>

    <div class="row items-center justify-around">
      <label for="image" class="label-file">Choisir une image</label>
      <input
        id="image"
        ref="fileInput"
        name="image"
        type="file"
        class="input-file"
        accept="image/*"
        @input="onPickFile"
      />

      <button @click="showAddLink = !showAddLink">Ajouter un lien</button>
    </div>
    <div v-if="videoUrl">
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
    <input id="video" name="video" type="url" v-model="writeVideoLink" />

    <button @click="onSetVideo">Ajouter une video</button>
    <div v-if="gifUrl">
      <img :src="gifUrl" />
    </div>
    <button v-if="videoUrl || gifUrl || imageUrl" @click="onRemoveFiles">Supprimer</button>
    <input type="text" v-model="searchGif" />
    <button class="button" @click="getGifs(searchGif)">Search</button>
    <div v-if="gifs.length" class="gif-container">
      <img v-for="(gif, index) in gifs" :src="gif" :key="gif.id" class="gif" @click="onSelectGif(index)" />
    </div>
    <button @click="onCreatePublication">ENVOYER</button>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, SetupContext, watch } from 'vue';
import { ICreatePublication } from '../../interface/publications/publication';
import { usePublications } from '../../store/publications/publications.store';
import { useEditPublications } from '../../mixins/publications/edit-publications.mixins';
//https://www.youtube.com/embed/Zwlaey0gu4c
//https://www.youtube.com/watch?v=Zwlaey0gu4c&ab_channel=GOTAGA
export default defineComponent({
  name: 'PublicationInput',
  setup(props, context: SetupContext) {
    const useEditPost = useEditPublications(context);
    const { createPublication } = usePublications();

    const createdPost = reactive<ICreatePublication>({
      text: null,
      imageUrl: null,
      gifUrl: null,
      videoUrl: null,
      link: null,
    });

    const onCreatePublication = async () => {
      const result = await createPublication({ ...createdPost });
      if (!result) return;
      return useEditPost.setInitPost(createdPost);
    };

    const onSelectGif = (gifIndex: number) => {
      useEditPost.selectGif(createdPost, gifIndex);
    };
    const onRemoveFiles = () => {
      useEditPost.removeFiles(createdPost);
    };

    const onPickFile = ()=>{
      useEditPost.pickFile(createdPost)
    }

    const onSetVideo = ()=>{
      useEditPost.setVideo(createdPost)
    }

    return {
      ...toRefs(createdPost),
      ...useEditPost,
      onCreatePublication,
      onSelectGif,
      onRemoveFiles,
      onPickFile,
      onSetVideo
    };
  },
});
</script>

<style scoped lang="scss">
textarea {
  resize: none;
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
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  align-items: center;
}
.gif {
  cursor: pointer;
  width: 100px;
  height: 100px;
}
</style>
