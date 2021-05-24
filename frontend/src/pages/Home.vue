<template>
  <div class="home row">
    <Publications
      ref="publicationsComponent"
      style="flex: 1"
      :publications="publications"
      :user="user"
      @deletePublication="(val) => deleteSelectedPublication(val)"
      @likePublication="(val) => onLikePublication(val)"
      @loadMoreResources="getPublications"
    />
    <div style="width: 33%" class="ml-md"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed, onMounted, ref } from 'vue';
import { useUser } from '../store/user/user.store';
import { usePublications } from '../store/publications/publications.store';
import Publications from '../components/Publications/Publications.vue';
import { showSuccessBanner, showErrorBanner } from '../mixins/banners/banners.mixins';

interface IPublicationComponent {
  removeEventListener: () => void;
}
export default defineComponent({
  name: 'Home',
  components: {
    Publications,
  },
  setup(props, context: SetupContext) {
    const { logout, getUser } = useUser();
    const { fetchPublications, deletePublication, getAllPublications, likePublication } = usePublications();

    const currentPage = ref(0);
    const publicationsComponent = ref<IPublicationComponent | null>(null);

    const publications = computed(() => getAllPublications.value);

    const user = computed(() => getUser.value);

    const deleteSelectedPublication = async (id: number) => {
      const result = await deletePublication(id);
      if (!result) return showErrorBanner('Impossible de supprimer la publication');

      showSuccessBanner('Publication supprimée avec succès !');
    };

    const onLikePublication = async (options: { publicationId: number; userId: number }) => {
      const likedPublication = await likePublication(options.publicationId, options.userId);
      if (!likedPublication) return;
    };

    const test = () => console.log('EVENT detected');

    const getPublications = async () => {
      currentPage.value++;
      const result = await fetchPublications(currentPage.value);
      if (!result || !result.length) {
        showErrorBanner('Impossible de récupérer les publications');
        if (!publicationsComponent.value) return;
        publicationsComponent.value.removeEventListener();
      }
    };

    onMounted(async () => {
      if (!publications.value.length) await getPublications();
    });

    return {
      logout,
      deleteSelectedPublication,
      publications,
      user,
      onLikePublication,
      showSuccessBanner,
      showErrorBanner,
      getPublications,
      publicationsComponent,
      test,
    };
  },
});
</script>

<style lang="scss">
.home {
  overflow: hidden;
  height: 100%;
  margin-right: -150px;
  padding-right: 150px;
  margin-left: -150px;
  padding-left: 150px;
}
</style>
