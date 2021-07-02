<template>
  <div class="full-width">
    <nav class="column side-panels__panel mt-sm br-md bg-white main-shadow pa-sm side-nav">
      <ul>
        <li v-for="tab in Object.values(navigationTabs)" :key="tab.to">
          <router-link
            v-if="!tab.for"
            :to="{ path: `${tab.to}` }"
            replace
            class="row items-center pa-sm br-sm my-xs position-relative"
          >
            <span class="material-icons-round pr-md">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            <div
              v-if="tab.to == '/messages' && unreadMessagesLength > 0"
              class="notifications bg-secondary text-white row items-center justify-center font-12"
            >
              {{ unreadMessagesLength }}
            </div>
          </router-link>
          <router-link
            v-else-if="tab.for && hasAdminRole"
            :to="{ path: `${tab.to}` }"
            replace
            class="row items-center pa-sm br-sm my-xs"
          >
            <span class="material-icons-round pr-md">{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
          </router-link>
        </li>
      </ul>
    </nav>
    <nav class="row items-center full-width side-panels__panel br-md bg-white main-shadow pa-sm bottom-nav">
      <ul>
        <li>
          <router-link to="/" replace class="row items-center pa-sm br-sm my-xs position-relative">
            <span class="material-icons-round">home</span>
          </router-link>
        </li>
        <li>
          <router-link to="/notifications" replace class="row items-center pa-sm br-sm my-xs position-relative">
            <span class="material-icons-round">notifications</span>
          </router-link>
        </li>
        <li>
          <router-link to="/messages" replace class="row items-center pa-sm br-sm my-xs position-relative">
            <span class="material-icons-round">forum</span>

            <div
              v-if="unreadMessagesLength > 0"
              class="notifications bg-secondary text-white row items-center justify-center font-12"
            >
              {{ unreadMessagesLength }}
            </div>
          </router-link>
        </li>
        <li class="position-relative">
          <IconButton
            :button="{ icon: 'settings', color: 'caption' }"
            @onClick="showMenu = !showMenu"
            class="settings-button"
            customClass="pa-sm"
          />
          <transition name="fade">
            <div
              v-if="showMenu"
              ref="parametersList"
              class="settings-menu column bg-white br-sm input-shadow overflow-hidden"
            >
              <router-link
                v-if="hasAdminRole"
                to="/admin"
                replace
                class="row items-center justify-start pa-sm full-width font-12"
                @click="showMenu = !showMenu"
              >
                <span class="material-icons-round pr-sm font-20">admin_panel_settings</span>
                <span>Modération</span>
              </router-link>
              <router-link
                to="/settings"
                replace
                class="row items-center justify-start pa-sm full-width font-12"
                @click="showMenu = !showMenu"
              >
                <span class="material-icons-round pr-sm font-20">manage_accounts</span>
                <span>Paramètres</span>
              </router-link>
            </div>
          </transition>
        </li>
        <li class="nav-avatar" @click="$emit('goToMyProfile')">
          <Avatar size="40px" :userPic="userPic" @click="$emit('goToMyProfile')" />
        </li>
      </ul>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { navigationTabs } from '../../mixins/navigation/navigation.mixins';
import Avatar from '../Avatar/Avatar.vue';
import IconButton from '../IconButton/IconButton.vue';
import { onClickOutside } from '@vueuse/core';

export default defineComponent({
  props: {
    unreadMessagesLength: { type: Number, required: true },
    hasAdminRole: { type: Boolean, required: true },
    userPic: { type: String },
  },
  components: { Avatar, IconButton },
  setup() {
    const showMenu = ref(false);
    const parametersList = ref(null);
    onClickOutside(parametersList, (event) => (showMenu.value = false));
    return { navigationTabs, showMenu, parametersList };
  },
});
</script>

<style lang="scss" scoped>
.bottom-nav {
  display: none;
}
.settings-menu {
  position: absolute;
  top: -100px;
  left: -100px;
  transition: opacity 1000ms;
  & button {
    &:hover {
      background: rgba(grey, 0.1);
    }
  }
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.side-panels__panel {
  box-sizing: border-box;
}

.nav-avatar {
  display: none;
}

.parameters-tab {
  display: none;
}
.settings-button {
  &:hover {
    background: rgba(#50505096, 0.1);
  }
}
ul {
  list-style-type: none;
  padding: 0 !important;
  margin: 0 !important;
}

a {
  background: transparent;
  transition: all 300ms;
  &:hover {
    background: rgba(#50505096, 0.1);
  }
  & span:nth-child(2) {
    font-size: 14px;
  }
}
a.router-link-active.router-link-exact-active {
  background: #0d2040;
  color: white !important;
  transition: opacity 300ms;
  opacity: 1;
  &:hover {
    opacity: 0.8;
  }
}

nav a {
  color: #50505096;
  text-decoration: none;
  &:visited {
    color: #50505096;
  }
}

nav {
  height: fit-content;
}
.notifications {
  position: absolute;
  right: 20px;
  width: 20px;
  height: 20px;
  border-radius: 7px;
  font-weight: 600;
}
@media screen and (max-width: 706px) {
  .bottom-nav {
    display: block;
  }
  .side-nav {
    display: none;
  }
  .side-panels__panel {
    margin: 0;
    padding: 0;
    & ul {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
      flex: 1;
      & li {
        display: block;
      }
    }
    & .parameters-tab {
      cursor: pointer;
      display: block;
    }
    & .nav-avatar {
      cursor: pointer;
      display: block;
    }

    & .notifications {
      top: -5px;
      right:-5px;
      border-radius: 30px;
    }
  }
  .profile-card {
    display: none;
  }
}
</style>
