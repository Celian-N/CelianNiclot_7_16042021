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
    <div style="width: 33%" class="ml-sm right-panel column">
      <div style="height: 45%" class="bg-white br-md main-shadow mb-sm"></div>
      <div class="bg-white br-md main-shadow users-session">
        <div
          class="row items-center justify-between position-relative user-session"
          v-for="sessionUser in oldSessionsUsers"
          :key="sessionUser.id"
          @click="()=> goToChat(sessionUser.id)"
        >
          <Avatar size="35px" :userPic="sessionUser.userPic" class="mr-sm" />
          <div
            class="connected-status"
            :class="`background-color : ${usersConnected.includes(user.id) ? 'bg-positive' : 'bg-secondary'}`"
          ></div>
          <div class="column items-start" style="flex: 1">
            <span class="text-main font-12">{{ sessionUser.firstname }} {{ sessionUser.lastname }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed, onMounted, ref, watch } from 'vue';
import { useUser } from '../store/user/user.store';
import { usePublications } from '../store/publications/publications.store';
import Publications from '../components/Publications/Publications.vue';
import { showSuccessBanner, showErrorBanner } from '../mixins/banners/banners.mixins';
import { useAdmin } from '../store/admin/admin.store';
import { IPublication } from '../interface/publications/publication';
import Avatar from '../components/Avatar/Avatar.vue';
import { IUser } from '../interface/user/user';
import { useAuthors } from '../store/authors/authors.store';
import socket from '../socket';
import { useRouter } from 'vue-router';

interface IPublicationComponent {
  removeEventListener: () => void;
}
export interface IAuthor extends Partial<IUser> {
  sessionId: string;
}
export default defineComponent({
  name: 'Home',
  components: {
    Publications,
    Avatar,
  },
  setup(props, context: SetupContext) {
        const router = useRouter();
    const { logout, getUser } = useUser();
    const {
      fetchPublications,
      deletePublication,
      getAllPublications,
      likePublication,
      signalUserPublication,
    } = usePublications();
    const { deletePost, banUser } = useAdmin();
    const { getAuthorInfosById, fetchAuthorInfos, getAuthorIdByValue } = useAuthors();
    const usersConnected = ref<number[]>([]);

    const currentPage = ref(0);
    const publicationsComponent = ref<IPublicationComponent | null>(null);

    const publications = computed(() => getAllPublications.value);

    const sortedPublications = ref<IPublication[]>([]);
    const oldSessionsUsers = ref<IAuthor[]>([]);

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

    const getPublications = async () => {
      currentPage.value++;
      const result = await fetchPublications(currentPage.value);
      if (!result || !result.length) {
        showErrorBanner('Impossible de récupérer les publications');
        if (!publicationsComponent.value) return;
        publicationsComponent.value.removeEventListener();
      }
    };

    const setOldSessions = async (allSessions: { session_id: string; user_id_1: number; user_id_2: number }[]) => {
      for (let index = 0; index < allSessions.length; index++) {
        const otherUserId = ref<number | undefined>(undefined);
        if (allSessions[index].user_id_1 == user.value.id) {
          otherUserId.value = allSessions[index].user_id_2;
        } else if (allSessions[index].user_id_2 == user.value.id) {
          otherUserId.value = allSessions[index].user_id_1;
        }
        if (!otherUserId.value) return;
        const userInfos = getAuthorInfosById(otherUserId.value);

        if (!userInfos) {
          const infos = await fetchAuthorInfos(otherUserId.value);
          if (!infos) return;
          const userId = getAuthorIdByValue(infos);
          if (!userId) return;
          oldSessionsUsers.value.push({ ...infos, sessionId: allSessions[index].session_id, id: parseInt(userId) });
        } else {
          const userId = getAuthorIdByValue(userInfos);
          if (!userId) return;
          oldSessionsUsers.value.push({ ...userInfos, sessionId: allSessions[index].session_id, id: parseInt(userId) });
        }
      }
    };
    const goToChat = (selectedUserId : number) =>{
      router.push({ name: 'Messages', query: { userChatId: selectedUserId } });
    }
    onMounted(async () => {
      await getPublications();

      if (user.value) {
        socket.emit('getOldSessions', user.value.id);
      }
      socket.on('getOldSessions', (allSessions: { session_id: string; user_id_1: number; user_id_2: number }[]) => {
        if (!allSessions) return;
        setOldSessions(allSessions);
      });
      socket.on('user_connected', (connectedUsers: number[]) => {
        usersConnected.value = connectedUsers;
      });
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
      sortedPublications,
      oldSessionsUsers,
      usersConnected,
      goToChat
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
.right-panel {
  height: 100%;
}
.connected-status {
  width: 10px;
  height: 10px;
  position: absolute;
  bottom: 10px;
  left: 10px;
  border-radius: 30px;
}
.users-session {
  overflow: scroll;
  max-height: 45%;
  &::-webkit-scrollbar {
    display: none;
  }
  & > .user-session {
    transition: background 200ms;
    cursor: pointer;
    padding: 10px 10px 10px 10px;
    &:hover {
      background: rgba(grey, 0.2);
    }
  }
}
</style>
