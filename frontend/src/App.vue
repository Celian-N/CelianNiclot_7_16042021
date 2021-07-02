<template>
  <div id="nav">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { isUserLoggedIn } from './mixins/auth/auth.mixins';
import { useRouter } from 'vue-router';
import { userStoreProvider } from './store/user/user.store';
import { publicationsStoreProvider } from './store/publications/publications.store';
import { commentsStoreProvider } from './store/comments/comments.store';
import { metaLinksStoreProvider } from './store/metadata/state';
import { adminStoreProvider } from './store/admin/admin.store';
import { authorsStoreProvider } from './store/authors/authors.store';
import { commentsLengthStoreProvider } from './store/commentsLength/state';
import { apiStoreProvider } from './store/api/api.store';
import { socketStoreProvider } from './store/socket/socket.store';

export default defineComponent({
  name: 'App',
  setup() {
    userStoreProvider();
    publicationsStoreProvider();
    commentsStoreProvider();
    metaLinksStoreProvider();
    adminStoreProvider();
    authorsStoreProvider();
    commentsLengthStoreProvider();
    apiStoreProvider();
    socketStoreProvider();

    const router = useRouter();

    onMounted(async function () {
      const isLogged = isUserLoggedIn();
      if (!isLogged) return router.push('/login');
    });
  },
});
</script>

<style lang="scss">
@import './css/app.scss';
</style>
