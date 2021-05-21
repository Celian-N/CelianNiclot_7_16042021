<template>
  <div class="publications-container">
    <PublicationInput :username="user.firstname" />
    <div class="column items-center full-width">
      <div v-for="publication in publications" :key="`publication-${publication.id}`" class="full-width">
        <Publication
          :publication="publication"
          :user="user"
          @onDeletePublication="(val) => $emit('deletePublication', val)"
          @onLikePublication="(val) => $emit('likePublication', val)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, ref } from 'vue';
import { IPublication } from '../../interface/publications/publication';
import Publication from './Publication.vue';
import { IUser } from '../../interface/user/user';
import PublicationInput from './PublicationInput.vue';

export default defineComponent({
  name: 'Publications',
  props: {
    publications: { type: Array as PropType<IPublication[]> },
    user: { type: Object as PropType<IUser>, required: true },
  },
  components: {
    Publication,
    PublicationInput,
  },
  setup(props) {
    const sortedPublications = ref<IPublication[]>([]);

    watch(
      () => props.publications,
      (value) => {
        if (!value) return;
        sortedPublications.value = value.sort((a, b) => {
          return +new Date(b.creationDate) - +new Date(a.creationDate);
        });
      }
    );
  },
});
</script>

<style lang="scss">
.publications-container {
  height: 100%;
  overflow-x: visible;
  overflow-y: scroll;
  margin-right: -150px;
  padding-right: 150px;
  margin-left: -150px;
  padding-left: 150px;
  &::-webkit-scrollbar {
    display: none;
  }
}
</style>
