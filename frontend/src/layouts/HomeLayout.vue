<template>
  <div class="column bg-tertiary main-container overflow-hidden">
    <HeaderCard class="header-container" />
    <div class="row home-page-container">
      <div class="column side-panels mr-sm">
        <div
          class="row items-center side-panels__panel mt-sm br-md bg-white main-shadow pa-sm justify-between profile-card"
          @click="goToMyProfile"
        >
          <Avatar size="60px" :userPic="user.userPic" class="mr-sm" />
          <div class="column items-start profile-card__infos" style="flex: 1">
            <span class="text-main text-bold">{{ user.firstname }} {{ user.lastname }}</span>
            <span class="text-caption font-12">Membre depuis le {{ userInscription }}</span>
          </div>
        </div>
        <NavigationTabs
          :unreadMessagesLength="unreadMessagesLength"
          :userPic="user.userPic"
          :hasAdminRole="user.adminRole"
          @goToMyProfile="goToMyProfile"
        />
      </div>
      <div class="center-panel mt-sm">
        <router-view />
      </div>
    </div>
    <async-loader :isLoading="actionsAreLoading" :mode="'FULLSCREEN'" />
  </div>
</template>

<script lang="ts">
import socket from '../socket';
import { defineComponent, onBeforeUnmount, onMounted, computed } from 'vue';
import { useUser } from '../store/user/user.store';
import { useApi } from '../mixins/api/api.mixins';
import { navigationTabs } from '../mixins/navigation/navigation.mixins';
import HeaderCard from '../components/Header/HeaderCard.vue';
import Avatar from '../components/Avatar/Avatar.vue';
import moment from 'moment';
import { useRouter } from 'vue-router';
import { useApiStore } from '../store/api/api.store';
import AsyncLoader from '../components/AsyncLoader/AsyncLoader.vue';
import { useSocket } from '../store/socket/socket.store';
import NavigationTabs from '../components/Navigation/NavigationTabs.vue';

export default defineComponent({
  name: 'HomeLayout',
  components: {
    HeaderCard,
    Avatar,
    AsyncLoader,
    NavigationTabs,
  },
  setup() {
    const { setUser, getUser } = useUser();
    const { getCurrentUser } = useApi();
    const router = useRouter();

    const user = computed(() => getUser.value);

    const userInscription = moment(user.value.creationDate).locale('fr').format('DD MMM YYYY');
    const goToMyProfile = () => {
      router.push({ name: 'UserPublications', params: { userPublicationId: user.value.id } });
    };

    const { isLoading } = useApiStore();
    const { setSocketUser, getUnreadMessagesLength } = useSocket();
    const unreadMessagesLength = computed(() => getUnreadMessagesLength.value);

    const actionsAreLoading = computed(
      () =>
        isLoading([
          'LOGIN',
          'SIGNUP',
          'EDIT_USER',
          'SIGNUP',
          'GET_ARTICLE',
          'CREATE_PUBLICATION',
          'GET_PUBLICATIONS',
          'GET_PUBLICATION_BY_ID',
          'GET_PUBLICATION_BY_USER_ID',
          'UPDATE_PUBLICATION',
          'DELETE_PUBLICATION',
          'LIKE_PUBLICATION',
          'GET_AUTHOR_INFOS',
          'GET_CURRENT_USER',
          'GET_COMMENTS',
          'GET_COMMENTS_LENGTH',
          'CREATE_COMMENT',
          'DELETE_COMMENT',
          'UPDATE_COMMENT',
          'LIKE_COMMENT',
          'GET_SIGNALED_POSTS',
          'DELETE_POST_ADMIN',
          'IGNORE_POST_ADMIN',
          'BAN_USER_ADMIN',
          'SIGNAL_COMMENT',
          'SIGNAL_PUBLICATION',
        ]).value
    );

    onMounted(async () => {
      const currentUser = await getCurrentUser();

      setUser(currentUser);

      if (currentUser && currentUser.id !== 0) {
        socket.auth = { userId: currentUser.id };
        socket.connect();
        socket.emit('getUnreadMessages', currentUser.id);
      }

      socket.on(
        'getUnreadMessages',
        (unreadMessages: { message: string; user_id: string; session_id: string; is_read: number }[]) => {
          if (!unreadMessages) return;
          unreadMessages.forEach((unreadMessage) => {
            setSocketUser({ id: unreadMessage.user_id, newMessage: true });
          });
        }
      );
      socket.on('private message', ({ content, from, to }: { content: string; from: number; to: number }) => {
        setSocketUser({ id: from.toString(), newMessage: true });
      });
    });

    onBeforeUnmount(() => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
      socket.off('users');
      socket.off('user connected');
      socket.off('user disconnected');
      socket.off('private message');
      socket.off('messages');
      socket.off('typing');
    });

    return { navigationTabs, user, userInscription, goToMyProfile, actionsAreLoading, unreadMessagesLength };
  },
});
</script>

<style lang="scss" scoped>
.main-container {
  max-width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  padding: 12px 12px 0 12px;
  &::-webkit-scrollbar {
    display: none;
  }
}
.profile-card {
  cursor: pointer;
  transition: all 300ms;
  &:hover {
    background: rgba(#50505096, 0.05);
  }
}
.side-panels {
  width: 25%;
  z-index: 2000;
}
.center-panel {
  height: 85vh;
  flex: 1;
  overflow: hidden;
  margin-right: -150px;
  padding-right: 150px;
  margin-left: -150px;
  padding-left: 150px;
  &::-webkit-scrollbar {
    display: none;
  }
}
.material-icons-round {
  font-size: 28px;
}

@media screen and (max-width: 706px) {
  .profile-card {
    display: none;
  }
  .side-panels {
    position: fixed;
    bottom: 0;
    flex-direction: row !important;
    align-items: center;
    width: calc(100vw - 24px);
    margin: 0;
    height: 10vh;
    margin-bottom: 10px;
  }
  .center-panel {
    height: 73vh;
  }
}
@media screen and (max-width: 400px) {
  .side-panels {
    left: 0;
    width: 100vw;
    margin-bottom: 0px;
  }
}
</style>
