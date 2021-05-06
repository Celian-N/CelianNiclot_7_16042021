<template>
  <div class="test">
    <header class="full-width bg-primary">HEADER</header>
    <router-view />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, onMounted, ref } from 'vue';
import { usePublications } from '../store/publications/publications.store';
import { useUser } from '../store/user/user.store';
import { useApi } from '../mixins/api/api.mixins';

export default defineComponent({
  name: 'HomeLayout',
  setup() {
    const { fetchPublications, getAllPublications } = usePublications();
    const { setUser } = useUser();
    const { getCurrentUser } = useApi();

    const publications = getAllPublications.value;
    const currentPage = ref(0);

    const handleScroll = async () => {
      if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        currentPage.value++;
        const result = await fetchPublications(currentPage.value);
        if(!result.length){
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
  },
});
</script>
