<template>
  <div>
    <div v-if="comments && comments.length">
      <div v-for="(comment, index) in comments" :key="`comment-${index}`" class="bg-secondary">
        <div v-if="commentEditingMode[comment.id]">
          <input name="editcomment" type="text" v-model="editedComment" />
          <button @click="closeEditingMode(comment.id)">Annuler</button>
          <button @click="$emit('onSaveComment', { commentId: comment.id, newComment: editedComment })">
            Sauvegarder
          </button>
        </div>

        <div v-else>
          <span>{{ comment.text }}</span>
          <button v-if="comment.authorId == user.id" @click="onEditComment(comment.id, comment.text)">Modifier</button>
        </div>
        <div>
          <span>{{ comment.userLiked.length }}</span>
          <button @click="$emit('onLikeComment', { commentId: comment.id, userId: user.id })">Like</button>
        </div>

        <button v-if="comment.authorId == user.id" @click="$emit('onDeleteComment', comment.id)">Supprimer</button>
      </div>
      <button v-if="comments.length > 0 && showLoadMoreButton" @click="$emit('loadMoreComments')">Charger plus</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';
import { IUser } from '../../interface/user/user';
import { IComment } from '../../interface/comments/comments';

export default defineComponent({
  name: 'Comments',
  props: {
    comments: { type: Array as PropType<IComment[]> },
    user: { type: Object as PropType<IUser>, required: true },
  },
  setup(props) {
    const showLoadMoreButton = ref(true);
    const commentEditingMode = ref<Record<number, boolean>>({});
    const editedComment = ref('');

    watch(
      () => props.comments,
      (value) => {
        if (!value) return;
        value.forEach((comment) => {
          commentEditingMode.value = { ...commentEditingMode.value, [comment.id]: false };
        });
      }
    );

    const onEditComment = (commentId: number, initialComment: string) => {
      editedComment.value = initialComment;
      commentEditingMode.value[commentId] = true;
    };
    const closeEditingMode = (commentId: number) => {
      commentEditingMode.value[commentId] = false;
    };

    return { showLoadMoreButton, commentEditingMode, editedComment, onEditComment, closeEditingMode };
  },
});
</script>
