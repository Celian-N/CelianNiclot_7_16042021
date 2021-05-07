<template>
  <div>
    <PublicationInput />
    <div class="column items-center">
      <div v-for="publication in publications" :key="`publication-${publication.id}`">
        <Publication
          :publication="publication"
          :user="user"
          @onDeletePublication="(val) => $emit('deletePublication', val)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { IPublication } from '../../interface/publications/publication';
import Publication from './Publication.vue';
import PublicationInput from './PublicationInput.vue';
import { IUser } from '../../interface/user/user';

export default defineComponent({
  name: 'Publications',
  props: {
    publications: { type: Array as PropType<IPublication[]> },
    user: { type: Object as PropType<IUser>, required: true },
  },
  components: {
    Publication,
    PublicationInput
  }
});
</script>
