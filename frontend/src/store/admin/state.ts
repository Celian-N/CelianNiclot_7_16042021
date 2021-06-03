import { IComment } from '@/interface/comments/comments';
import { IPublication } from '@/interface/publications/publication';
import { readonly, ref, computed } from 'vue';

type AdminStateInterface = Record<string, IComment | IPublication>;

const adminState = ref<AdminStateInterface>({});

const setters = {
  setPosts: (posts: (IComment |IPublication)[]) => {
    posts.forEach((post) => {
        adminState.value = { ...adminState.value, [post.id]: post };
    });
  },
  removePost: (postId: number) => {
    const copy = { ...adminState.value };
    delete copy[postId];
    adminState.value = { ...copy };
  },
  clearComments: () => {
    adminState.value = {};
  },
};

const getters = {
  getAllSignaled: computed(() => Object.values(adminState.value)),
};

export const adminStore = {
  adminState: readonly(adminState),
  ...setters,
  ...getters,
};
