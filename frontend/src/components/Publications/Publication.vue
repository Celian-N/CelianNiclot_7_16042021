<template>
  <div class="my-sm column bg-white pa-md br-md full-width main-shadow" style="box-sizing: border-box">
    <div class="row items-start justify-between mb-md">
      <div class="row items-center">
        <Avatar size="50px" :userPic="authorInfos.userPic" class="mr-sm" />
        <div class="column items-start">
          <span class="text-main text-bold">{{ authorInfos.firstname }} {{ authorInfos.lastname }}</span>
          <span class="text-caption font-12">{{ publicationMoment }}</span>
        </div>
      </div>
      <div v-if="publication.authorId == user.id" class="position-relative">
        <IconButton :button="{ size: '30px', icon: 'more_horiz', color: 'primary' }" @onClick="showMenu = !showMenu" />
        <transition name="fade">
          <div v-if="showMenu" class="publication-menu column bg-white br-sm input-shadow overflow-hidden">
            <button
              v-if="publication.authorId == user.id"
              class="pa-sm full-width row justify-start items-center font-12"
              @click="editPublication"
            >
              <span class="material-icons-round mr-xs font-20">edit</span>
              Modifier
            </button>
            <button
              v-if="publication.authorId == user.id"
              class="pa-sm full-width row justify-start items-center font-12"
              @click="$emit('onDeletePublication', publication.id)"
            >
              <span class="material-icons-round mr-xs font-20">delete</span>
              Supprimer
            </button>
          </div>
        </transition>
      </div>
    </div>
    <div v-if="publication.text" class="mb-md">{{ publication.text }}</div>

    <div
      v-if="publication.imageUrl || publication.videoUrl || publication.gifUrl || publication.link"
      class="column items-center mb-md"
    >
      <img class="full-width br-sm" v-if="publication.imageUrl" :src="publication.imageUrl" />

      <Article v-if="publicationArticle" :article="publicationArticle" />

      <img class="full-width br-sm" v-if="publication.gifUrl" :src="publication.gifUrl" />
      <div v-if="publication.videoUrl && publication.videoUrl.match(embedRegex)" class="full-width">
        <iframe
          width="100%"
          height="300"
          :src="`${publication.videoUrl}?fs=0&modestbranding=1&iv_load_policy=3`"
          title="YouTube video player"
          frameborder="0"
          allowfullscreen
          class="br-sm"
        ></iframe>
      </div>
    </div>

    <div class="row items-center justify-end">
      <span class="font-12 text-caption mr-xs">{{ commentsLength }}</span>
      <span class="material-icons-round publication-icons text-caption mr-sm">chat</span>

      <span
        class="font-12 mr-xs"
        :class="publication.userLiked.includes(user.id) ? 'text-secondary' : 'text-caption'"
        >{{ publication.userLiked.length }}</span
      >
      <button
        @click="$emit('onLikePublication', { publicationId: publication.id, userId: user.id })"
        class="row items-center justify-center"
      >
        <span
          class="material-icons-round publication-icons"
          :class="publication.userLiked.includes(user.id) ? 'text-secondary' : 'text-caption'"
          >favorite</span
        >
      </button>
    </div>
    <hr class="full-width vertical-separator mb-sm" />

    <Comments
      ref="commentsRef"
      :comments="publicationComments"
      :user="user"
      @loadMoreComments="loadMoreComments"
      @onDeleteComment="onDeleteComment"
      @onSaveComment="saveComment"
      @onLikeComment="onLikeComment"
    />
    <div class="row items-center my-sm">
      <Avatar size="35px" :userPic="user.userPic" class="mr-sm" />
      <InputField
        autogrow
        @onInput="(val) => (newComment = val)"
        :value="newComment"
        placeholder="Commentaire"
        :customTextareaClass="'pr-sm'"
        :maxLength="255"
        borderRadius="8px"
        style="flex: 1"
        :button="{
          icon: 'send',
          color: 'primary',
          size: '25px',
        }"
        @onClick="addComment"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, PropType, onMounted, ref, computed } from 'vue';
import { IPublication, IPublicationAuthor } from '../../interface/publications/publication';
import { IUser } from '../../interface/user/user';
import { useRouter } from 'vue-router';
import { useComments } from '../../store/comments/comments.store';
import Comments from '../Comments/Comments.vue';
import Avatar from '../Avatar/Avatar.vue';
import moment from 'moment';
import InputField from '../InputField/InputField.vue';
import IconButton from '../IconButton/IconButton.vue';
import { showErrorBanner, showSuccessBanner } from '../../mixins/banners/banners.mixins';
import Article from '../Article/Article.vue';
import { useMetaLinks } from '../../store/metadata/state';
import { useApi } from '../../mixins/api/api.mixins';

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
    Avatar,
    InputField,
    IconButton,
    Article,
  },
  setup(props) {
    const showMenu = ref(false);
    const router = useRouter();

    const authorInfos = ref<IPublicationAuthor>({
      firstname: '',
      lastname: '',
    });

    const embedRegex = /^(https|http):\/\/(?:www\.)?youtube-nocookie.com\/embed\/[A-z0-9]+/;

    const publicationMoment = moment(props.publication.creationDate).locale('fr').fromNow();
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
      likeComment,
      fetchCommentsLength,
    } = useComments();
    const { fetchAuthorInfos } = useApi();
    const { getDataById } = useMetaLinks();

    const publicationComments = computed(() => getCommentsByPublication(props.publication.id));
    const publicationArticle = computed(() => getDataById(props.publication.id));
    const currentCommentsPage = ref(0);
    const newComment = ref('');
    const commentsLength = ref(0);

    const loadMoreComments = async () => {
      currentCommentsPage.value++;
      const moreComments = await fetchMorePublicationComments(props.publication.id, currentCommentsPage.value);

      if (publicationComments.value.length == commentsLength.value && commentsRef.value)
        return (commentsRef.value.showLoadMoreButton = false);
    };
    const addComment = async () => {
      const result = await createComment(props.publication.id, newComment.value);
      if (!result) return showErrorBanner('Impossible de poster le commentaire');
      newComment.value = '';
    };

    const onDeleteComment = async (commentId: number) => {
      const deletedCommentId = await deleteComment(commentId);
      if (!deletedCommentId) return showErrorBanner('Impossible de supprimer le commentaire');
      showSuccessBanner('Commentaire supprimé avec succès !');
      if (!publicationComments.value.length) return await fetchFirstComment(props.publication.id);
    };

    const saveComment = async (options: { commentId: number; newComment: string }) => {
      const editedComment = await editComment(options.commentId, options.newComment);

      if (!editedComment || !editedComment.id || !commentsRef.value)
        return showErrorBanner('Impossible de modifier le commentaire');
      showSuccessBanner('Commentaire modifié avec succès !');
      commentsRef.value.closeEditingMode(options.commentId);
    };

    const onLikeComment = async (options: { commentId: number; userId: number }) => {
      const likedComment = await likeComment(options.commentId, options.userId);

      if (!likedComment) return;
    };

    onMounted(async () => {
      await fetchFirstComment(props.publication.id);
      commentsLength.value = await fetchCommentsLength(props.publication.id);
      authorInfos.value = await fetchAuthorInfos(props.publication.authorId);
    });

    return {
      editPublication,
      embedRegex,
      loadMoreComments,
      newComment,
      addComment,
      publicationComments,
      commentsRef,
      onDeleteComment,
      saveComment,
      onLikeComment,
      publicationMoment,
      showMenu,
      commentsLength,
      publicationArticle,
      authorInfos
    };
  },
});
</script>
<style lang="scss" scoped>
.max-width {
  max-width: 200px;
}
.publication-icons {
  font-size: 20px;
}
.publication-menu {
  position: absolute;
  top: -10px;
  left: 40px;
  transition: opacity 1000ms;
  & button {
    &:hover {
      background: rgba(grey, 0.1);
    }
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
