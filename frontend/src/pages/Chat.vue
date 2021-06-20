<template>
  <div class="chat-container">
    <div
      class="lato bg-white main-shadow pa-sm br-md full-height column position-relative justify-between"
      style="height: 80vh"
    >
      <div style="height: 10%">
        <InputField
          @onInput="(val) => (searchedUser = val)"
          :value="searchedUser"
          :maxLength="255"
          borderRadius="16px"
          placeholder="Chercher une personne"
          class="self-stretch"
        />
      </div>
      <div v-if="users && users.length && showMenu" class="users-container bg-white br-md main-shadow" ref="userList">
        <div
          v-for="user in users"
          :key="`user-${user.id}`"
          class="row items-center py-sm user"
          @click="selectUser(user)"
        >
          <Avatar size="30px" :userPic="user.userPic" class="mx-md" />
          <span style="flex: 1" class="font-14">{{ user.firstname + ' ' + user.lastname }}</span>
        </div>
      </div>
      <Messages
        :selectedUser="selectedUser"
        :me="me"
        :oldSessions="oldSessionsUsers"
        :unreadMessages="unreadMessages"
        @onSelectUser="(val) => onSelectUser(val)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Messages from '../components/Socket/Messages.vue';
import socket from '../socket';
import { defineComponent, ref, watch, onMounted, computed } from 'vue';
import InputField from '../components/InputField/InputField.vue';
import Avatar from '../components/Avatar/Avatar.vue';
import { IUser } from '../interface/user/user';
import { useApi } from '../mixins/api/api.mixins';
import { onClickOutside, useDebounce } from '@vueuse/core';
import { useUser } from '../store/user/user.store';
import { useAuthors } from '../store/authors/authors.store';
import { IPublicationAuthor } from '../interface/publications/publication';
import { useApiStore } from '../store/api/api.store';
import { useSocket } from '../store/socket/socket.store';
import { useRouter } from 'vue-router';

export interface IAuthor extends Partial<IUser> {
  sessionId: string;
}

export default defineComponent({
  name: 'ChatPage',
  components: {
    Messages,
    InputField,
    Avatar,
  },
  setup() {
    const route = useRouter();
    const { userChatId } = route.currentRoute.value.query;
    const { startLoading } = useApiStore();
    const { getAllUsers } = useApi();
    const { getUser } = useUser();
    const { getAuthorInfosById, fetchAuthorInfos, getAuthorIdByValue } = useAuthors();
    const { setSocketUser, getAllUnreadMessages } = useSocket();

    const unreadMessages = computed(() => getAllUnreadMessages.value);

    const searchedUser = ref('');
    const users = ref<IUser[] | undefined>(undefined);
    const me = computed(() => getUser.value);
    const showMenu = ref(false);
    const selectedUser = ref<Partial<IUser> | undefined>(undefined);
    const oldSessionsUsers = ref<IAuthor[]>([]);

    const userList = ref(null);

    onClickOutside(userList, (event) => (showMenu.value = false));

    const searchDebounced = useDebounce(searchedUser, 1000);

    watch(
      () => searchDebounced.value,
      (newValue, prevValue) => {
        if (newValue != prevValue) {
          searchUser(newValue);
        }
      }
    );

    const searchUser = async (userSearch: string) => {
      if (!userSearch.trim().length) return;
      const result = await getAllUsers(userSearch);
      if (!result) return;
      showMenu.value = true;
      users.value = result;
    };
    const onSelectUser = (user: IPublicationAuthor) => {
      const userId = getAuthorIdByValue(user);
      if (!userId) return;
      selectUser({ ...user, id: parseInt(userId) });
    };

    const selectUser = (user: Partial<IUser>) => {
      if (selectedUser.value && selectedUser.value.id == user.id) return;
      selectedUser.value = user;
      showMenu.value = false;
      searchedUser.value = '';
    };

    watch(
      () => selectedUser.value,
      (newValue, prevValue) => {
        if (newValue != prevValue && !!newValue) {
          connectToSocket();
        }
      }
    );

    const connectToSocket = () => {
      if (!me.value || !selectedUser.value) return;
      const sessionId = `${me.value.id}-${selectedUser.value.id}`;
      if (sessionId) {
        startLoading('CHANGE_CONV');
        socket.disconnect();

        socket.auth = { sessionId };
        socket.connect();
        socket.emit('messages', socket.auth.sessionId);
      }
    };
    watch(
      () => me.value,
      (newValue) => {
        socket.auth = { userId: newValue.id };
        socket.connect();
        socket.emit('getOldSessions', newValue.id);
        socket.emit('getUnreadMessages', newValue.id);
      }
    );

    const setOldSessions = async (allSessions: { session_id: string; user_id_1: number; user_id_2: number }[]) => {
      for (let index = 0; index < allSessions.length; index++) {
        const otherUserId = ref<number | undefined>(undefined);
        if (allSessions[index].user_id_1 == me.value.id) {
          otherUserId.value = allSessions[index].user_id_2;
        } else if (allSessions[index].user_id_2 == me.value.id) {
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

    onMounted(async () => {
      if (userChatId) {
        const userInfos = getAuthorInfosById(parseInt(userChatId as string));
        if (!userInfos) {
          const result = await fetchAuthorInfos(parseInt(userChatId as string));
          return (selectedUser.value = { ...result, id: parseInt(userChatId as string) });
        }
        selectedUser.value = { ...userInfos, id: parseInt(userChatId as string) };
      }
      socket.on('session', ({ sessionId, userId }: { sessionId: string; userId: number }) => {
        socket.auth = { sessionId };
        socket.userId = userId;

        if (oldSessionsUsers.value.findIndex((session) => session.sessionId == sessionId) < 0) {
          oldSessionsUsers.value.push({ ...selectedUser.value, sessionId: sessionId });
        }
        const userId1 = sessionId.split('-')[0];
        const userId2 = sessionId.split('-')[1];
        if (parseInt(userId1) == me.value.id) {
          socket.emit('readMessages', { userId: parseInt(userId2), sessionId: sessionId });
        } else if (parseInt(userId2) == me.value.id) {
          socket.emit('readMessages', { userId: parseInt(userId1), sessionId: sessionId });
        }
      });

      if (me.value && me.value.id !== 0) {
        socket.emit('getOldSessions', me.value.id);
      }

      socket.on('getOldSessions', (allSessions: { session_id: string; user_id_1: number; user_id_2: number }[]) => {
        if (!allSessions) return;
        setOldSessions(allSessions);
      });
      socket.on('readMessages', ({ userId, sessionId }: { userId: string; sessionId: string }) => {
        if (!userId || !sessionId) return;
        setSocketUser({ id: userId, newMessage: false });
      });
    });

    return {
      searchUser,
      searchedUser,
      users,
      showMenu,
      userList,
      selectUser,
      selectedUser,
      me,
      oldSessionsUsers,
      onSelectUser,
      unreadMessages,
    };
  },
});
</script>

<style lang="scss" scoped>
.chat-container {
  overflow: hidden;
  height: 100%;
  margin-right: -150px;
  padding-right: 150px;
  margin-left: -150px;
  padding-left: 150px;
}
.users-container {
  position: absolute;
  top: 60px;
  max-height: 300px;
  width: 300px;
  overflow: scroll;
  z-index: 1000;
}
.user {
  transition: background 200ms;
  cursor: pointer;
  &:hover {
    background: rgba(grey, 0.2);
  }
}
</style>
