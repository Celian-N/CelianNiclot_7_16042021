<template>
  <div class="publications-container row">
    <div class="publications-container column items-center full-width">
      <div class="row items-center bg-white main-shadow pa-sm br-md full-width" style="box-sizing: border-box;">
        <Avatar size="70px" class="mr-md"/>
        <div class="column items-start">
          <span class="text-main text-bold">Prénom Nom</span>
          <span class="text-caption">Job</span>
        </div>
      </div>
      <div v-for="publication in sortedPublications" :key="`publication-${publication.id}`" class="full-width">
        <Publication
          :publication="publication"
          :user="user"
          @onDeletePublication="deleteSelectedPublication"
          @onLikePublication="onLikePublication"
          @onDeleteAdminPublication="deleteAdminPublication"
          @onBanUserAdmin="banUserAdmin"
          @onSignalPublication="signalPublication"
        />
      </div>
    </div>
    <div style="width: 33%" class="ml-md"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed, onMounted, ref, watch } from 'vue';
import { useUser } from '../store/user/user.store';
import { usePublications } from '../store/publications/publications.store';
import Publication from '../components/Publications/Publication.vue';
import { showSuccessBanner, showErrorBanner } from '../mixins/banners/banners.mixins';
import { useAdmin } from '../store/admin/admin.store';
import { useRouter } from 'vue-router';
import { IPublication } from '../interface/publications/publication';
import Avatar from '../components/Avatar/Avatar.vue'

export default defineComponent({
  name: 'Home',
  components: {
    Publication,
    Avatar
  },
  setup(props, context: SetupContext) {
    const { logout, getUser } = useUser();
    const {
      deletePublication,

      likePublication,
      signalUserPublication,
      fetchPublicationsByUserId,
      getPublicationsByUserId,
    } = usePublications();
    const { deletePost, banUser } = useAdmin();

    const route = useRouter();

    const { userPublicationId } = route.currentRoute.value.params;

    watch(
      () => route.currentRoute.value.params.userPublicationId,
      (newValue) => {
        if (!newValue) return;
        getPublications(parseInt(newValue as string));
      }
    );

    const publications = computed(() => getPublicationsByUserId(parseInt(userPublicationId as string)));

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
    const signalPublication = async (publicationId: number) => {
      const signaledPublication = await signalUserPublication(publicationId);
      if (!signaledPublication) return showErrorBanner('Impossible de signaler la publication');
      showSuccessBanner('Publications signalée avec succès');
    };

    const getPublications = async (userId: number) => {
      const result = await fetchPublicationsByUserId(userId);
      if (!result || !result.length) {
        showErrorBanner('Impossible de récupérer les publications');
      }
    };

    onMounted(async () => {
      if (!userPublicationId) return;
      await getPublications(parseInt(userPublicationId as string));
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
      deleteAdminPublication,
      banUserAdmin,
      signalPublication,
      sortedPublications
    };
  },
});
</script>

<style lang="scss">
.publications-container {
  height: 100%;
  overflow-x: visible;
  overflow-y: scroll;
  margin-right: -150px;
  padding-right: 150px;
  margin-left: -150px;
  padding-left: 150px;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
