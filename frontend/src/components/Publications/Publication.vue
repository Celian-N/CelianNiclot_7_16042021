<template>
  <div class="ma-md column">
    <img :src="publication.imageUrl" class="max-width" />

    <img :src="publication.gifUrl" class="max-width" />
    <div v-if="publication.videoUrl && publication.videoUrl.match(embedRegex)">
      <iframe
        width="560"
        height="315"
        :src="`${publication.videoUrl}?fs=0&modestbranding=1&iv_load_policy=3`"
        title="YouTube video player"
        frameborder="0"
        allowfullscreen
      ></iframe>
    </div>
    <div>TEXT : {{ publication.text }}</div>
    <div v-if="publication.link" class="row">
      <span> LIEN : </span>
      <a :href="publication.link">{{ publication.link }}</a>
    </div>
    <div>
      <span>{{ publication.userLiked.length }}</span>
      <button @click="$emit('onLikePublication', { publicationId: publication.id, userId: user.id })">Like</button>
    </div>
    <div class="row items-center">
      <button v-if="publication.authorId == user.id" @click="$emit('onDeletePublication', publication.id)">
        Supprimer
      </button>
      <button v-if="publication.authorId == user.id" @click="editPublication">Modifier</button>
      <button v-if="publication.authorId == user.id" @click="showAddComment = !showAddComment">Commenter</button>
    </div>
    <Comments
      ref="commentsRef"
      :comments="publicationComments"
      :user="user"
      @loadMoreComments="loadMoreComments"
      @onDeleteComment="onDeleteComment"
      @onSaveComment="saveComment"
      @onLikeComment="onLikeComment"
    />
    <div v-if="showAddComment" class="column bg-secondary">
      <input id="comment" name="comment" type="text" v-model="newComment" placeholder="Commentaire" />
      <button @click="addComment">Ajouter commentaire</button>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, computed } from 'vue';
import { IPublication } from '../../interface/publications/publication';
import { IUser } from '../../interface/user/user';
import { useRouter } from 'vue-router';
import { useComments } from '../../store/comments/comments.store';
import Comments from '../Comments/Comments.vue';

export interface CommentsRef {
  showLoadMoreButton: boolean;
  closeEditingMode: (commentId: number) => void;
}

export default defineComponent({
  name: 'Publication',
  props: {
    publication: { type: Object as PropType<IPublication>, required: true },
    user: { type: Object as PropType<IUser>, required: true },
  },
  components: {
    Comments,
  },
  setup(props) {
    const router = useRouter();
    //TODO : DELETE ALL ROWS WITH OLD VIDEO LINK
    const embedRegex = /^(https|http):\/\/(?:www\.)?youtube-nocookie.com\/embed\/[A-z0-9]+/;

    const editPublication = () => {
      router.push({ name: 'EditPost', params: { publicationId: props.publication.id } });
    };
    const commentsRef = ref<CommentsRef | null>(null);
    const {
      fetchFirstComment,
      fetchMorePublicationComments,
      createComment,
      getCommentsByPublication,
      deleteComment,
      editComment,
      likeComment
    } = useComments();

    const publicationComments = computed(() => getCommentsByPublication(props.publication.id));
    const currentCommentsPage = ref(0);
    const showAddComment = ref(false);
    const newComment = ref('');

    const loadMoreComments = async () => {
      currentCommentsPage.value++;
      const moreComments = await fetchMorePublicationComments(props.publication.id, currentCommentsPage.value);

      if (!moreComments.length && commentsRef.value) return (commentsRef.value.showLoadMoreButton = false);
    };
    const addComment = async () => {
      const result = await createComment(props.publication.id, newComment.value);
      if (!result) return;
    };

    const onDeleteComment = async (commentId: number) => {
      const deletedCommentId = await deleteComment(commentId);
      if (!deletedCommentId) return;
      if (!publicationComments.value.length) return await fetchFirstComment(props.publication.id);
    };

    const saveComment = async (options: { commentId: number; newComment: string }) => {
      const editedComment = await editComment(options.commentId, options.newComment);

      if (!editedComment || !editedComment.id || !commentsRef.value) return;
      commentsRef.value.closeEditingMode(options.commentId);
    };

    const onLikeComment = async (options: { commentId: number; userId: number }) => {
      const likedComment = await likeComment(options.commentId, options.userId);

      if (!likedComment) return;
    };

    onMounted(async () => {
      await fetchFirstComment(props.publication.id);
    });

    return {
      editPublication,
      embedRegex,
      loadMoreComments,
      showAddComment,
      newComment,
      addComment,
      publicationComments,
      commentsRef,
      onDeleteComment,
      saveComment,
      onLikeComment
    };
  },
});
</script>
<style lang="scss" scoped>
.max-width {
  max-width: 200px;
}
</style>
