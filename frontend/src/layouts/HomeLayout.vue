<template>
  <div class="column bg-tertiary pa-sm main-container overflow-hidden">
    <HeaderCard class="header-container" />
    <div class="row">
      <div class="column side-panels mr-sm">
        <div
          class="row items-center side-panels__panel mt-sm br-md bg-white main-shadow pa-sm justify-between profile-card"
        >
          <Avatar size="60px" class="mr-sm" />
          <div class="column items-start">
            <span class="text-main text-bold">{{ user.firstname }} {{ user.lastname }}</span>
            <span class="text-caption font-12">Membre depuis le {{ userInscription }}</span>
          </div>
        </div>
        <nav class="column side-panels__panel mt-sm br-md bg-white main-shadow pa-sm">
          <ul>
            <li v-for="tab in Object.values(navigationTabs)" :key="tab.to">
              <router-link :to="{ path: `${tab.to}` }" replace class="row items-center pa-sm br-sm my-xs">
                <span class="material-icons-round pr-md">{{ tab.icon }}</span>
                <span>{{ tab.label }}</span>
              </router-link>
            </li>
          </ul>
        </nav>
      </div>
      <div class="center-panel mt-sm">
        <router-view />
      </div>

      <div></div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref, computed } from 'vue';
import { usePublications } from '../store/publications/publications.store';
import { useUser } from '../store/user/user.store';
import { useApi } from '../mixins/api/api.mixins';
import { navigationTabs } from '../mixins/navigation/navigation.mixins';
import HeaderCard from '../components/Header/HeaderCard.vue';
import Avatar from '../components/Avatar/Avatar.vue';
import moment from 'moment';
import { showErrorBanner } from '../mixins/banners/banners.mixins';

export default defineComponent({
  name: 'HomeLayout',
  components: {
    HeaderCard,
    Avatar,
  },
  setup() {
    const { fetchPublications, getAllPublications } = usePublications();
    const { setUser, getUser } = useUser();
    const { getCurrentUser } = useApi();

    const publications = getAllPublications.value;
    const currentPage = ref(0);

    const user = computed(() => getUser.value);
    // const userInscription = moment(user.value.creationDate).fromNow();
    const userInscription = moment(user.value.creationDate).locale('fr').format('DD MMM YYYY');

    const handleScroll = async () => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        currentPage.value++;
        const result = await fetchPublications(currentPage.value);
        if (!result || !result.length) {
          showErrorBanner('Impossible de récupérer les publications');
          window.removeEventListener('scroll', handleScroll);
        }
      }
    };

    onMounted(async () => {
      if (!publications.length) await handleScroll();

      const currentUser = await getCurrentUser();
      window.addEventListener('scroll', handleScroll);
      return setUser(currentUser);
    });
    onBeforeUnmount(() => {
      window.removeEventListener('scroll', handleScroll);
    });

    return { navigationTabs, user, userInscription };
  },
});
</script>

<style lang="scss" scoped>
.header-container {
  height: 10vh;
}
.main-container {
  max-width: 100vw;
  height: 98vh;
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
  &__panel {
    box-sizing: border-box;
  }
}
.center-panel {
  height: 85vh;
  width: 50%;
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
</style>
