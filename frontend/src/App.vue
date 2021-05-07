<template>
  <div id="nav">
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, onMounted } from 'vue';
import { isUserLoggedIn } from './mixins/auth/auth.mixins';
import { useRouter } from 'vue-router';
import { userStoreProvider } from './store/user/user.store';
import { publicationsStoreProvider } from './store/publications/publications.store';
import { commentsStoreProvider } from './store/comments/comments.store';


export default defineComponent({
  name: 'App',
  setup(props, context: SetupContext) {
    userStoreProvider();
    publicationsStoreProvider();
    commentsStoreProvider();
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
