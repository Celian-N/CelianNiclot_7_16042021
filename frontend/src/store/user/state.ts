import { readonly, ref, computed, watch } from 'vue';
import { IUser } from '../../interface/user/user';

type UserStateInterface = IUser;

const userState = ref<UserStateInterface>({
  id: 0,
  email: '',
  firstname: '',
  lastname: '',
  active: true,
});

const setters = {
  setUser: (user: IUser) => {
    userState.value = { ...user };
  },
  updateUser: (updatedProperties: Partial<UserStateInterface>) => {
    userState.value = { ...userState.value, ...updatedProperties };
  },
  clearUser: () => {
    userState.value = { id: 0, email: '', firstname: '', lastname: '', active: true };
  },
};

const getters = {
  getUser: computed(() => userState.value),
  getUserEmail: computed(() => userState.value.email),
  getUserId: computed(() => userState.value.id),
  getUserIsActive: computed(() => userState.value.active),
};

export const userStore = {
  userState: readonly(userState),
  ...setters,
  ...getters,
};
