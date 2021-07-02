<template>
  <div>
    <div v-if="comments && comments.length" class="column items-start">
      <button
        v-if="comments.length > 0 && showLoadMoreButton"
        @click="$emit('loadMoreComments')"
        class="text-caption"
        style="font-weight: 500"
      >
        Afficher plus de commentaires
      </button>
      <div
        v-for="(comment, index) in comments"
        :key="`comment-${index}`"
        class="my-sm"
        :class="`${comment.authorId == user.id ? 'self-end' : 'self-start'} ${
          commentEditingMode[comment.id] && 'full-width'
        }`"
      >
        <div class="column items-end" :class="`${commentEditingMode[comment.id] && 'full-width'}`">
          <div class="row items-start" :class="`${commentEditingMode[comment.id] && 'full-width'}`">
            <Avatar
              size="35px"
              :userPic="authorInfos[comment.authorId] ? authorInfos[comment.authorId].userPic : null"
              class="mr-xs cursor-pointer"
              @click="goToUserProfile(comment.authorId)"
            />
            <div v-if="commentEditingMode[comment.id]" class="column items-end full-width">
              <InputField
                autogrow
                @onInput="(val) => (editedComment = val)"
                :value="editedComment"
                :maxLength="255"
                borderRadius="8px"
                placeholder="Modifier mon commentaire"
                class="self-stretch"
              />
              <div class="row items-center full-width justify-end mt-sm">
                <button @click="closeEditingMode(comment.id)" class="mr-md text-primary">Annuler</button>
                <button
                  @click="$emit('onSaveComment', { commentId: comment.id, newComment: editedComment })"
                  class="text-primary"
                >
                  Sauvegarder
                </button>
              </div>
            </div>

            <div v-else class="column bg-tertiary br-sm pa-xs">
              <div class="row items-center justify-between">
                <span class="text-main text-bold mr-md font-12">{{
                  authorInfos[comment.authorId] &&
                  authorInfos[comment.authorId].firstname + ' ' + authorInfos[comment.authorId].lastname
                }}</span>
                <div class="text-caption font-10 row items-center no-wrap position-relative">
                  <span class="mr-xs">{{ moment(comment.creationDate).locale('fr').fromNow() }}</span>
                  <IconButton
                    :button="{ size: '20px', icon: 'more_horiz', color: 'primary' }"
                    @onClick="onOpenMenu(comment.id)"
                    class="self-center"
                  />
                  <transition name="fade">
                    <div
                      v-if="showMenu[comment.id]"
                      class="comment-menu column bg-white br-sm input-shadow overflow-hidden"
                    >
                      <button
                        v-if="comment.authorId == user.id"
                        @click="onEditComment(comment.id, comment.text)"
                        class="pa-sm full-width row justify-start items-center font-12"
                      >
                        <span class="material-icons-round mr-xs font-20">edit</span>
                        Modifier
                      </button>
                      <button
                        v-if="comment.authorId == user.id"
                        @click="$emit('onDeleteComment', comment.id)"
                        class="pa-sm full-width row justify-start items-center font-12"
                      >
                        <span class="material-icons-round mr-xs font-20">delete</span>
                        Supprimer
                      </button>
                      <button
                        v-if="comment.authorId !== user.id && !user.adminRole"
                        class="pa-sm full-width row justify-start items-center font-12"
                        @click="$emit('signalComment', comment.id)"
                      >
                        <span class="material-icons-round mr-xs font-20">report</span>
                        Signaler
                      </button>
                      <button
                        v-if="comment.authorId !== user.id && user.adminRole"
                        class="pa-sm full-width row justify-start items-center font-12"
                        @click="$emit('deleteAdminComment', comment.id)"
                      >
                        <span class="material-icons-round mr-xs font-20">delete</span>
                        Supprimer
                      </button>
                      <button
                        v-if="comment.authorId !== user.id && user.adminRole"
                        class="pa-sm full-width row justify-start items-center font-12"
                        @click="$emit('banUserAdmin', comment.authorId)"
                      >
                        <span class="material-icons-round mr-xs font-20">person_remove</span>
                        Bannir
                      </button>
                    </div>
                  </transition>
                </div>
              </div>
              <span class="font-12 text-main comment-text">{{ comment.text }}</span>
            </div>
          </div>
          <div v-if="!commentEditingMode[comment.id]" class="row items-center">
            <span
              class="font-10 mr-xs"
              :class="comment.userLiked.includes(user.id) ? 'text-secondary' : 'text-caption'"
              >{{ comment.userLiked.length }}</span
            >
            <button
              @click="$emit('onLikeComment', { commentId: comment.id, userId: user.id })"
              class="row items-center justify-center"
            >
              <span
                class="material-icons-round comment-icons font-14"
                :class="comment.userLiked.includes(user.id) ? 'text-secondary' : 'text-caption'"
                >favorite</span
              >
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref, watch } from 'vue';
import { IUser } from '../../interface/user/user';
import { IComment } from '../../interface/comments/comments';
import Avatar from '../Avatar/Avatar.vue';
import moment from 'moment';
import IconButton from '../IconButton/IconButton.vue';
import InputField from '../InputField/InputField.vue';
import { useAuthors } from '../../store/authors/authors.store';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Comments',
  components: {
    Avatar,
    IconButton,
    InputField,
  },
  props: {
    comments: { type: Array as PropType<IComment[]> },
    user: { type: Object as PropType<IUser>, required: true },
  },
  setup(props) {
    const showLoadMoreButton = ref(true);
    const commentEditingMode = ref<Record<number, boolean>>({});
    const editedComment = ref('');
    const showMenu = ref<Record<number, boolean>>({});

    const { fetchAuthorInfos, getAllAuthorsInfos } = useAuthors();
    const router = useRouter();

    const authorInfos = computed(() => {
      return { ...getAllAuthorsInfos.value };
    });

    const getAuthorInfos = async (comments: IComment[]) => {
      if (authorInfos.value[comments[0].authorId]) return;
      for (const comment of comments) {
        if (authorInfos.value[comment.authorId]) return;
        await fetchAuthorInfos(comment.authorId);
      }
    };

    watch(
      () => props.comments,
      (comments) => {
        if (!comments || !comments.length) return;
        resetMenus(comments);
        if (authorInfos.value[comments[0].authorId]) return;
        getAuthorInfos(comments);
      }
    );

    const resetMenus = (comments: IComment[]) => {
      comments.forEach((comment) => {
        commentEditingMode.value = { ...commentEditingMode.value, [comment.id]: false };
        showMenu.value = { ...showMenu.value, [comment.id]: false };
      });
    };

    const onOpenMenu = (commentId: number) => {
      if (showMenu.value[commentId] == true) {
        return (showMenu.value = { ...showMenu.value, [commentId]: false });
      }
      if (!props.comments) return;
      resetMenus(props.comments);
      showMenu.value = { ...showMenu.value, [commentId]: true };
    };

    const onEditComment = (commentId: number, initialComment: string) => {
      editedComment.value = initialComment;
      commentEditingMode.value[commentId] = true;
      showMenu.value[commentId] = false;
    };
    const closeEditingMode = (commentId: number) => {
      commentEditingMode.value[commentId] = false;
      showMenu.value[commentId] = false;
    };

    const goToUserProfile = (userId: number) => {
      router.push({ name: 'UserPublications', params: { userPublicationId: userId } });
    };

    return {
      showLoadMoreButton,
      commentEditingMode,
      editedComment,
      onEditComment,
      closeEditingMode,
      moment,
      showMenu,
      onOpenMenu,
      authorInfos,
      goToUserProfile,
    };
  },
});
</script>

<style lang="scss" scoped>
.comment-menu {
  position: absolute;
  top: -10px;
  left: 110px;
  transition: opacity 1000ms;
  & button {
    &:hover {
      background: rgba(grey, 0.1);
    }
  }
}
.comment-text {
  max-width: 350px;
  overflow: scroll;
  &::-webkit-scrollbar {
    display: none;
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
</style>
