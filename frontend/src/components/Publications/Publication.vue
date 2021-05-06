<template>
  <div class="ma-md column">
    <img :src="publication.imageUrl" class="max-width" />

    <img :src="publication.gifUrl" class="max-width" />
    <div v-if="publication.videoUrl && publication.videoUrl.match(embedRegex)">
      <iframe
        width="560"
        height="315"
        :src="`${publication.videoUrl}?fs=0&modestbranding=1&iv_load_policy=3`"
        title="YouTube video player"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div>TEXT : {{ publication.text }}</div>
    <div v-if="publication.link" class="row">
      <span> LIEN : </span>
      <a :href="publication.link">{{ publication.link }}</a>
    </div>
    <div class="row items-center">
      <button v-if="publication.authorId == user.id" @click="$emit('onDeletePublication', publication.id)">
        Supprimer
      </button>
      <button v-if="publication.authorId == user.id" @click="editPublication">Modifier</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IPublication } from '../../interface/publications/publication';
import { IUser } from '../../interface/user/user';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Publication',
  props: {
    publication: { type: Object as PropType<IPublication>, required: true },
    user: { type: Object as PropType<IUser>, required: true },
  },
  setup(props) {
    const router = useRouter();
    //TODO : DELETE ALL ROWS WITH OLD VIDEO LINK
    const embedRegex = /^(https|http):\/\/(?:www\.)?youtube-nocookie.com\/embed\/[A-z0-9]+/;

    const editPublication = () => {
      router.push({ name: 'EditPost', params: { publicationId: props.publication.id } });
    };

    return { editPublication, embedRegex };
  },
});
</script>
<style lang="scss" scoped>
.max-width {
  max-width: 200px;
}
</style>
