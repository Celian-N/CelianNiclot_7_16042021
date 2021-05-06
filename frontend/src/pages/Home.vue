<template>
  <div class="home">
    <button @click="logout">Se deconnecter</button>
    <Publications
      :publications="sortedPublications"
      :user="user"
      @deletePublication="(val) => deleteSelectedPublication(val)"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, SetupContext, computed, watch, ref} from 'vue';
import { useUser } from '../store/user/user.store';
import { usePublications } from '../store/publications/publications.store';
import Publications from '../components/Publications/Publications.vue';
import { IPublication } from '../interface/publications/publication';

export default defineComponent({
  name: 'Home',
  components: {
    Publications,
  },
  setup(props, context: SetupContext) {
    const { logout, getUser } = useUser();
    const { deletePublication, getAllPublications, fetchPublications } = usePublications();

    const publications = computed(() => getAllPublications.value);

    const sortedPublications = ref<IPublication[]>([])
     watch(
      () => publications.value,
      (value) => {
        sortedPublications.value = value.sort((a, b) => {
          return +new Date(b.creationDate) - +new Date(a.creationDate);
        });
      }
    );

    const user = computed(() => getUser.value);

    const deleteSelectedPublication = async (id: number) => {
      const result = await deletePublication(id);
      if (!result) return console.warn('Une erreur esr survenue, impossible de supprimer la publication');
    };

    return { logout, deleteSelectedPublication, publications, user, sortedPublications };
  },
});
</script>
