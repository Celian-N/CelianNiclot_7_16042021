<template>
  <div class="home row">
    <Publications
      ref="publicationsComponent"
      style="flex: 1"
      :publications="sortedPublications"
      :user="user"
      @deletePublication="(val) => deleteSelectedPublication(val)"
      @likePublication="(val) => onLikePublication(val)"
      @loadMoreResources="getPublications"
      @banUserAdmin="banUserAdmin"
      @deleteAdminPublication="deleteAdminPublication"
      @signalPublication="signalPublication"
    />
    <div style="width: 33%" class="ml-md"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed, onMounted, ref, watch} from 'vue';
import { useUser } from '../store/user/user.store';
import { usePublications } from '../store/publications/publications.store';
import Publications from '../components/Publications/Publications.vue';
import { showSuccessBanner, showErrorBanner } from '../mixins/banners/banners.mixins';
import { useAdmin } from '../store/admin/admin.store';
import { IPublication } from '../interface/publications/publication';

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
    const { fetchPublications, deletePublication, getAllPublications, likePublication, signalUserPublication } = usePublications();
    const { deletePost, banUser } = useAdmin();

    const currentPage = ref(0);
    const publicationsComponent = ref<IPublicationComponent | null>(null);

    const publications = computed(() => getAllPublications.value);

   const sortedPublications = ref<IPublication[]>([]);

    watch(
      () => publications.value,
      (value) => {
        if (!value) return;
        sortedPublications.value = value.sort((a, b) => {
          return +new Date(b.creationDate) - +new Date(a.creationDate);
        });
      }
    );

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

    const deleteAdminPublication = async (publicationId: number) => {
      const deletedPost = await deletePost('publication', publicationId);
      if (!deletedPost) return showErrorBanner('Impossible de supprimer la publication');
      showSuccessBanner('Publication supprimée avec succès !');
    };
    const banUserAdmin = async (userId: number) => {
      const bannedUser = await banUser(userId);
      if (!bannedUser) return showErrorBanner("Impossible de bannir l'utilisateur");
      showSuccessBanner('Utilisateur banni succès !');
    };
    const signalPublication = async(publicationId : number)=>{
      const signaledPublication = await signalUserPublication(publicationId)
      if (!signaledPublication) return showErrorBanner("Impossible de signaler la publication");
      showSuccessBanner('Publications signalée avec succès');
    }

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
      await getPublications();
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
      deleteAdminPublication,
      banUserAdmin,
      signalPublication,
      sortedPublications
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
