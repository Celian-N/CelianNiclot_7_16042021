<template>
  <div class="home">
    <button @click="logout">Se deconnecter</button>
    <Publications
      :publications="publications"
      :user="user"
      @deletePublication="(val) => deleteSelectedPublication(val)"
      @likePublication="(val) => onLikePublication(val)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed } from 'vue';
import { useUser } from '../store/user/user.store';
import { usePublications } from '../store/publications/publications.store';
import Publications from '../components/Publications/Publications.vue';
import { IPublication } from '../interface/publications/publication';

export default defineComponent({
  name: 'Home',
  components: {
    Publications,
  },
  setup(props, context: SetupContext) {
    const { logout, getUser } = useUser();
    const { deletePublication, getAllPublications, fetchPublications, likePublication } = usePublications();

    const publications = computed(() => getAllPublications.value);

    const user = computed(() => getUser.value);

    const deleteSelectedPublication = async (id: number) => {
      const result = await deletePublication(id);
      if (!result) return console.warn('Une erreur esr survenue, impossible de supprimer la publication');
    };

    const onLikePublication = async (options: { publicationId: number; userId: number }) => {
      const likedPublication = await likePublication(options.publicationId, options.userId);
      if (!likedPublication) return;
      console.log('Liké !');
    };

    return { logout, deleteSelectedPublication, publications, user, onLikePublication };
  },
});
</script>
