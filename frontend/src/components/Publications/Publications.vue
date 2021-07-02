<template>
  <div class="publications-container" ref="scrollableContainer">
    <PublicationInput :username="user.firstname" :profilPic="user.userPic" />
    <div class="column items-center full-width">
      <div v-for="publication in publications" :key="`publication-${publication.id}`" class="full-width">
        <Publication
          :publication="publication"
          :user="user"
          @onDeletePublication="(val) => $emit('deletePublication', val)"
          @onLikePublication="(val) => $emit('likePublication', val)"
          @onDeleteAdminPublication="(val) => $emit('deleteAdminPublication', val)"
          @onBanUserAdmin="(val) => $emit('banUserAdmin', val)"
          @onSignalPublication="(val) => $emit('signalPublication', val)"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch, ref, onMounted, onBeforeUnmount } from 'vue';
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
  setup(props, context) {
    const sortedPublications = ref<IPublication[]>([]);
    const scrollableContainer = ref<HTMLElement | null>(null);

    watch(
      () => props.publications,
      (value) => {
        if (!value) return;
        sortedPublications.value = value.sort((a, b) => {
          return +new Date(b.creationDate) - +new Date(a.creationDate);
        });
      }
    );

    const handleScroll = async () => {
      if (!scrollableContainer.value) return;

      if (
        scrollableContainer.value.scrollTop + scrollableContainer.value.clientHeight >=
        scrollableContainer.value.scrollHeight
      ) {
        context.emit('loadMoreResources');
      }
    };

    const removeEventListener = () => {
      window.removeEventListener('scroll', handleScroll);
    };

    onMounted(() => {
      if (!scrollableContainer.value) return;
      scrollableContainer.value.addEventListener('scroll', handleScroll, { passive: true });
    });

    onBeforeUnmount(() => {
      removeEventListener();
    });
    return { scrollableContainer };
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
