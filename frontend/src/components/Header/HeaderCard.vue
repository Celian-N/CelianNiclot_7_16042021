<template>
  <header
    class="row items-center px-md bg-white br-md main-shadow"
    :class="searchIsOpen ? 'justify-center' : 'justify-between'"
  >
    <img v-if="!searchIsOpen" src="../../assets/logo_groupomania.png" alt="Logo groupomania" />
    <IconButton
      v-if="!searchIsOpen"
      :button="{ size: '30px', icon: 'search', color: 'secondary' }"
      class="self-center search-button"
      @onClick="() => (searchIsOpen = true)"
    />
    <div
      class="input-container position-relative"
      :class="[searchIsOpen && 'input-container__open']"
      :style="searchIsOpen ? 'width:100%' : 'width : 250px'"
    >
      <InputField
        @onClick="() => (searchIsOpen = false)"
        @onInput="(val) => (searchedUser = val)"
        :value="searchedUser"
        :button="buttonConfig"
        :maxLength="255"
        borderRadius="24px"
        placeholder="Rechercher"
        class="self-stretch search-input"
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
import IconButton from '../IconButton/IconButton.vue';

import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'HeaderCard',
  components: {
    InputField,
    Avatar,
    IconButton,
  },
  setup() {
    const { getAllUsers } = useApi();

    const searchedUser = ref('');
    const showMenu = ref(false);
    const userList = ref(null);
    const users = ref<IUser[] | undefined>(undefined);
    const router = useRouter();
    const searchIsOpen = ref(false);

    onClickOutside(userList, (event) => (showMenu.value = false));

    const searchDebounced = useDebounce(searchedUser, 1000);

    const buttonConfig = {
      icon: 'search',
      color: 'secondary',
      size: '30px',
    };
    const selectUser = (user: Partial<IUser>) => {
      if (!user.id) return;
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
    };

    watch(
      () => searchDebounced.value,
      (newValue, prevValue) => {
        if (newValue != prevValue) {
          searchUser(newValue);
        }
      }
    );

    return { buttonConfig, users, searchedUser, userList, showMenu, selectUser, searchIsOpen };
  },
});
</script>

<style lang="scss" scoped>
header {
  height: 10vh;
}
img {
  width: 120px;
}
.users-container {
  position: absolute;
  top: 55px;
  max-height: 300px;
  width: 100%;
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
.search-button {
  display: none;
}
@media screen and (max-width: 500px) {
  .search-button {
    display: block;
  }
  .input-container {
    display: none;
  }
  .input-container__open {
    display: block;
  }
}
</style>
