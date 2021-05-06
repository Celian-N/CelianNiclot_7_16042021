<template>
  <div class="column">
    <textarea v-model="editedPost.text" name="text" cols="30" rows="10" maxlength="500"></textarea>
    <input v-if="showAddLink" id="link" name="link" type="url" v-model="editedPost.link" placeholder="Lien" />
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
        @input="pickFile(editedPost)"
      />

      <button @click="showAddLink = !showAddLink">Ajouter un lien</button>
    </div>
    <div v-if="editedPost.videoUrl">
      <iframe
        width="560"
        height="315"
        :src="editedPost.videoUrl"
        title="YouTube video player"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      ></iframe>
    </div>
    <input id="video" name="video" type="url" v-model="writeVideoLink" />

    <button @click="setVideo(editedPost)">Ajouter une video</button>
    <div v-if="editedPost.gifUrl">
      <img :src="editedPost.gifUrl" />
    </div>
    <button v-if="editedPost.videoUrl || editedPost.gifUrl || editedPost.imageUrl || previewImage" @click="removeFiles(editedPost)">Supprimer</button>
    <input type="text" v-model="searchGif" />
    <button class="button" @click="getGifs(searchGif)">Search</button>
    <div v-if="gifs.length" class="gif-container">
      <img v-for="(gif, index) in gifs" :src="gif" :key="gif.id" class="gif" @click="selectGif(editedPost,index)" />
    </div>
    <div>
      <button @click="onSaveEditedPost">Enregistrer</button>
      <button @click="closeEditingMode">Annuler</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, SetupContext, onMounted, watch, reactive, computed } from 'vue';
import { fetchGifs } from '../helpers/gifs/gifs';
import { ICreatePublication, IPublication } from '../interface/publications/publication';
import { usePublications } from '../store/publications/publications.store';
import { useUser } from '../store/user/user.store';
import { useRouter } from 'vue-router';
import { useEditPublications } from '../mixins/publications/edit-publications.mixins';
import { useApi } from '../mixins/api/api.mixins';


export default defineComponent({
  name: 'EditPublicationPage',
  setup(props, context: SetupContext) {
    const { getCurrentUser } = useApi();

    const useEditPost = useEditPublications(context)

    const { editPublication, getPublicationById, fetchPublicationById } = usePublications();
    const { getUser } = useUser();

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
      const result = await editPublication(parseInt(editedPostId.value), editedPost.value);
      if (!result) return;

      router.push({ name: 'Home' });
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
        const currentUserId = ref(getUser.value.id)
        if(currentUserId.value == 0){
          const currentUser = await getCurrentUser();
          currentUserId.value = currentUser.id
        }
        const publication = await fetchPublicationById(parseInt(editedPostId.value));
        if (publication.authorId !== currentUserId.value) {
          console.warn('Vous ne pouvez pas modifier cette publication');
          return router.push({ name: 'Home' });
        }
        useEditPost.previewImage.value = publication.imageUrl || undefined;
        editedPost.value.gifUrl = publication.gifUrl || undefined;
        editedPost.value.videoUrl = publication.videoUrl || undefined;
        editedPost.value.text = publication.text || undefined;
        editedPost.value.link = publication.link || undefined;
        return;
      }
      if (allEditedPost.value.authorId !== getUser.value.id) {
        console.warn('Vous ne pouvez pas modifier cette publication');
        return router.push({ name: 'Home' });
      }
      useEditPost.previewImage.value = allEditedPost.value.imageUrl || undefined;
      editedPost.value.gifUrl = allEditedPost.value.gifUrl || undefined;
      editedPost.value.videoUrl = allEditedPost.value.videoUrl || undefined;
      editedPost.value.text = allEditedPost.value.text || undefined;
      editedPost.value.link = allEditedPost.value.link || undefined;
      return;
    });

    return {
      editedPost,
      onSaveEditedPost,
      closeEditingMode,
      ...useEditPost
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
