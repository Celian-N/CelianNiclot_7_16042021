<template>
  <div>
    <header class="full-width bg-primary">HEADER</header>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { usePublications } from '../store/publications/publications.store';
import { useUser } from '../store/user/user.store';
import { useApi } from '../mixins/api/api.mixins';

export default defineComponent({
  name: 'HomeLayout',
  setup() {
    const { fetchPublications, getAllPublications } = usePublications();
    const { setUser } = useUser();
    const { getCurrentUser } = useApi();

    onMounted(async () => {
      const publications = getAllPublications.value;
      if (!publications.length) await fetchPublications();

      const currentUser = await getCurrentUser();

      return setUser(currentUser);
    });
  },
});
</script>
