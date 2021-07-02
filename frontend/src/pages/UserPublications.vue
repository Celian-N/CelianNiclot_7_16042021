<template>
  <div class="publications-container row">
    <div class="publications-container column items-center full-width">
      <div
        v-if="authorInfos"
        class="row items-center bg-primary main-shadow pa-sm br-md full-width"
        style="box-sizing: border-box"
      >
        <Avatar size="80px" class="mr-md" :userPic="authorInfos.userPic" />
        <div class="column items-start">
          <span class="text-white font-20 text-bold">{{ authorInfos.firstname + ' ' + authorInfos.lastname }}</span>
          <span class="font-16 text-secondary">{{ authorInfos.job }}</span>
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
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, onMounted, ref, watch } from 'vue';
import { useUser } from '../store/user/user.store';
import { usePublications } from '../store/publications/publications.store';
import Publication from '../components/Publications/Publication.vue';
import { showSuccessBanner, showErrorBanner } from '../mixins/banners/banners.mixins';
import { useAdmin } from '../store/admin/admin.store';
import { useRouter } from 'vue-router';
import { IPublication } from '../interface/publications/publication';
import Avatar from '../components/Avatar/Avatar.vue';
import { useAuthors } from '../store/authors/authors.store';

export default defineComponent({
  name: 'Home',
  components: {
    Publication,
    Avatar,
  },
  setup() {
    const { logout, getUser } = useUser();
    const {
      deletePublication,
      likePublication,
      signalUserPublication,
      fetchPublicationsByUserId,
      getPublicationsByUserId,
    } = usePublications();
    const { deletePost, banUser } = useAdmin();
    const { getAuthorInfosById } = useAuthors();

    const route = useRouter();

    const { userPublicationId } = route.currentRoute.value.params;

    const selectedUserId = ref(parseInt(userPublicationId as string));

    const authorInfos = computed(() => getAuthorInfosById(selectedUserId.value));

    watch(
      () => route.currentRoute.value.params.userPublicationId,
      (newValue) => {
        if (!newValue) return;
        selectedUserId.value = parseInt(newValue as string);
      }
    );

    watch(
      () => selectedUserId.value,
      (newValue) => {
        if (!newValue) return;
        getPublications(newValue);
      }
    );

    const publications = computed(() => getPublicationsByUserId(selectedUserId.value));

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
      sortedPublications,
      authorInfos,
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
