<template>
  <div class="lato bg-white br-md pa-md position-relative">
    <InputField
      @onInput="(val) => (searchedUser = val)"
      :value="searchedUser"
      :maxLength="255"
      borderRadius="16px"
      placeholder="Chercher une personne"
      class="self-stretch"
    />
    <div v-if="users && users.length && showMenu" class="users-container bg-white br-md" ref="userList">
      <div v-for="user in users" :key="`user-${user.id}`" class="row items-center py-sm user">
        <Avatar size="30px" :userPic="user.userPic" class="mx-md" />
        <span style="flex: 1" class="font-14">{{ user.firstname + ' ' + user.lastname }}</span>
      </div>
    </div>
    <!-- <select-username v-if="!usernameAlreadySelected" @onInput="onUsernameSelection" />
    <chat v-else /> -->
  </div>
</template>

<script lang="ts">
// import SelectUsername from '../components/Socket/SelectUsername.vue';
// import Chat from '../components/Socket/Chat.vue';
// import socket from '../socket';
import { defineComponent, ref, watch } from 'vue';
import InputField from '../components/InputField/InputField.vue';
import Avatar from '../components/Avatar/Avatar.vue';
import { IUser } from '../interface/user/user';
import { useApi } from '../mixins/api/api.mixins';
import { onClickOutside, useDebounce } from '@vueuse/core';

export default defineComponent({
  name: 'ChatPage',
  components: {
    // Chat,
    // SelectUsername,
    InputField,
    Avatar,
  },
  setup() {
    // const usernameAlreadySelected = ref(false);
    const { getAllUsers } = useApi();
    const searchedUser = ref('');
    const users = ref<IUser[] | undefined>(undefined);
    const showMenu = ref(false);

    const userList = ref(null);

    onClickOutside(userList, (event) => (showMenu.value = false));

    const searchDebounced = useDebounce(searchedUser, 1000);

    // const onUsernameSelection = (username : string) => {
    //   usernameAlreadySelected.value = true;
    //   socket.auth = { username };
    //   socket.connect();
    // };

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

    // onMounted(() => {
    //   const sessionID = localStorage.getItem('sessionID');

    //   if (sessionID) {
    //     usernameAlreadySelected.value = true;
    //     socket.auth = { sessionID };
    //     socket.connect();
    //   }

    //   socket.on('session', ({ sessionID, userID }) => {
    //     // attach the session ID to the next reconnection attempts
    //     socket.auth = { sessionID };
    //     // store it in the localStorage
    //     localStorage.setItem('sessionID', sessionID);
    //     // save the ID of the user
    //     socket.userID = userID;
    //   });

    //   socket.on('connect_error', (err) => {
    //     if (err.message === 'invalid username') {
    //       usernameAlreadySelected.value = false;
    //     }
    //   });
    // });
    // onUnmounted(() => {
    //   socket.off('connect_error');
    // });

    return { searchUser, searchedUser, users, showMenu, userList };
  },
});
</script>

<style lang="scss" scoped>
.users-container {
  position: absolute;
  top: 60px;
  max-height: 400px;
  width: 300px;
  overflow: scroll;
}
.user {
  transition: background 200ms;
  cursor: pointer;
  &:hover {
    background: rgba(grey, 0.2);
  }
}
</style>
