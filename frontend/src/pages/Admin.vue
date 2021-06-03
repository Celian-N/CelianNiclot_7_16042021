<template>
  <div class="column" v-if="signaledPosts.length">
    <div v-for="signaledPost in signaledPosts" :key="signaledPost.text" class="mt-md column">
      <div v-if="signaledPost.publicationId" class="br-md bg-white main-shadow column items-start pa-md post mb-sm">
        <div class="row items-center">
          <Avatar
            size="30px"
            class="mr-sm"
            :userPic="authorsInfos[signaledPost.authorId] ? authorsInfos[signaledPost.authorId].userPic : null"
          />
          <span class="text-main text-bold font-12">{{
            authorsInfos[signaledPost.authorId] &&
            authorsInfos[signaledPost.authorId].firstname + ' ' + authorsInfos[signaledPost.authorId].lastname
          }}</span>
        </div>
        <div>
          {{ signaledPost.text }}
        </div>
      </div>
      <div v-else class="post">
        <Publication :publication="signaledPost" :user="user" :admin="true" />
      </div>
      <div class="row items-center justify-around button-banner bg-primary">
        <button class="negative" @click="deletePostAdmin(signaledPost)">Supprimer</button>
        <button class="negative" @click="banUserAdmin(signaledPost.authorId)">Bannir l'utilisateur</button>
        <button class="positive" @click="ignorePostAdmin(signaledPost)">Ignorer</button>
      </div>
    </div>
  </div>
  <div v-else class="column items-center justify-center" style="min-height:100px;" >
    Aucun post signalé !
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, computed, watch } from 'vue';
import { IComment } from '../interface/comments/comments';
import { IApiPublication, IPublication, IPublicationAuthor } from '../interface/publications/publication';
import { useApi } from '../mixins/api/api.mixins';
import { useUser } from '../store/user/user.store';
import { useAdmin } from '../store/admin/admin.store';
import Avatar from '../components/Avatar/Avatar.vue';
import Publication from '../components/Publications/Publication.vue';
import { showErrorBanner, showSuccessBanner } from '../mixins/banners/banners.mixins';
import { isComment } from '../helpers/postType/postType.helper';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'AdminPage',
  components: {
    Avatar,
    Publication,
  },
  setup() {
    const { getUser } = useUser();
    const { fetchSignaledPosts, getAllSignaled, deletePost, ignorePost, banUser } = useAdmin();
    const { fetchAuthorInfos } = useApi();
    const router = useRouter();

    const signaledPosts = computed(() => getAllSignaled.value);
    const user = computed(() => getUser.value);
    const authorsInfos = ref<Record<number, IPublicationAuthor>>({});

    watch(
      () => signaledPosts.value,
      async (value) => {
        await getAuthorInfos(value);
      }
    );

    const deletePostAdmin = async (signaledPost: IComment | IPublication) => {
      const postType = checkPostType(signaledPost);

      const result = await deletePost(postType, signaledPost.id);
      if (!result) return showErrorBanner('Une erreur est survenue, impossible de supprimer le post');
      return showSuccessBanner('Post supprimé avec succès');
    };
    const ignorePostAdmin = async (signaledPost: IComment | IPublication) => {
      const postType = checkPostType(signaledPost);
      console.log(signaledPost);
      const result = await ignorePost(postType, signaledPost.id);
      if (!result) return showErrorBanner('Une erreur est survenue, impossible de supprimer le post');
    };
    const banUserAdmin = async (userId: number) => {
      const result = await banUser(userId);
      if (!result) return showErrorBanner("Une erreur est survenue, impossible de bannir l'utilisateur");
      return showSuccessBanner('Utilisateur banni avec succès');
    };
    const checkPostType = (post: IComment | IPublication) => {
      return isComment(post) ? 'comment' : 'publication';
    };

    const getAuthorInfos = async (posts: (IComment | IPublication)[]) => {
      for (const post of posts) {
        if (authorsInfos.value[post.authorId]) return;
        const newAuthor = await fetchAuthorInfos(post.authorId);
        authorsInfos.value = { ...authorsInfos.value, [post.authorId]: newAuthor };
      }
    };

    onMounted(async () => {
      if(!user.value.adminRole) return router.push({ name: 'Home' });
      await fetchSignaledPosts();
    });

    return { signaledPosts, user, authorsInfos, deletePostAdmin, ignorePostAdmin, banUser };
  },
});
</script>

<style lang="scss" scoped>
.button-banner {
  padding-top: 30px;
  margin-top: -30px;
  padding-bottom: 10px;
  border-radius: 0 0 20px 20px;
  & button {
    color: white;
    transition: color 200ms;
    &.negative:hover {
      color: #e22a7f;
    }
    &.negative:hover {
      color: #e22a7f;
    }
    &.positive:hover {
      color: #2dd385;
    }
  }
}
.post {
  z-index: 0;
}
</style>
