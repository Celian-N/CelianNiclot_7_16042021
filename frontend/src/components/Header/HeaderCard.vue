<template>
  <header class="row items-center justify-between px-md bg-white br-md main-shadow">
    <img src="../../assets/logo_groupomania.png" alt="Logo groupomania" />
    <div class="input-container position-relative">
      <InputField
        @onInput="(val) => (searchedUser = val)"
        :value="searchedUser"
        :button="buttonConfig"
        :maxLength="255"
        borderRadius="24px"
        placeholder="Rechercher"
        class="self-stretch"
      />
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
    </div>
  </header>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import InputField from '../InputField/InputField.vue';
import { onClickOutside, useDebounce } from '@vueuse/core';
import { useApi } from '../../mixins/api/api.mixins';
import { IUser } from '../../interface/user/user';
import Avatar from '../Avatar/Avatar.vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HeaderCard',
  components: {
    InputField,
    Avatar,
  },
  setup() {
    const { getAllUsers } = useApi();

    const searchedUser = ref('');
    const showMenu = ref(false);
    const userList = ref(null);
    const users = ref<IUser[] | undefined>(undefined);
    const router = useRouter();

    onClickOutside(userList, (event) => (showMenu.value = false));

    const searchDebounced = useDebounce(searchedUser, 1000);

    const buttonConfig = {
      icon: 'search',
      color: 'secondary',
      size: '30px',
    };
    const selectUser = (user: Partial<IUser>) => {
      if(!user.id) return;
      showMenu.value = false;
      searchedUser.value = '';
      router.push({ name: 'UserPublications', params: { userPublicationId: user.id } });
    };

    const searchUser = async (userSearch: string) => {
      if (!userSearch.trim().length) return;
      const result = await getAllUsers(userSearch);
      if (!result) return;
      showMenu.value = true;
      users.value = result;
      console.log('users.value :', users.value);
    };
    watch(
      () => searchDebounced.value,
      (newValue, prevValue) => {
        if (newValue != prevValue) {
          console.log('SEARCH');
          searchUser(newValue);
        }
      }
    );

    return { buttonConfig, users, searchedUser, userList, showMenu, selectUser };
  },
});
</script>

<style lang="scss" scoped>
header{
  height : 100px;
}
img {
  width: 120px;
}
.input-container {
  width: 250px;
}
.users-container {
  position: absolute;
  top: 55px;
  max-height: 300px;
  width: 250px;
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
