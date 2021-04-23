import { readonly, ref } from 'vue';
import { IUser } from '../../interface/user/user';

type UserStateInterface = IUser;

const userState = ref<UserStateInterface>({
  id: '',
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
    userState.value = { id: '', email: '', firstname: '', lastname: '', active: true };
  },
};

const getters = {
  getEmail(state: UserStateInterface) {
    return state.email;
  },
  getUserId(state: UserStateInterface) {
    return state.id;
  },
  getUser(state: UserStateInterface) {
    return state;
  },
  getUserIsActive(state: UserStateInterface) {
    return state.active;
  },
};

export const userStore = {
  userState: readonly(userState),
  ...setters,
  ...getters,
};
