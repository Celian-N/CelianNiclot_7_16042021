import { readonly, ref, computed } from 'vue';
import { IUser } from '../../interface/user/user';

type UserStateInterface = IUser;

const userState = ref<UserStateInterface>({
  id: 0,
  email: '',
  firstname: '',
  lastname: '',
  active: true,
  adminRole: false,
});

const setters = {
  setUser: (user: IUser) => {
    userState.value = { ...user };
  },
  updateUser: (updatedProperties: Partial<UserStateInterface>) => {
    userState.value = { ...userState.value, ...updatedProperties };
  },
  clearUser: () => {
    userState.value = { id: 0, email: '', firstname: '', lastname: '', active: true, adminRole: false };
  },
};

const getters = {
  getUser: computed(() => userState.value),
  getUserPic: computed(() => userState.value.userPic),
  getUserInfos: computed(() => {
    return {
      id: userState.value.id,
      firstname: userState.value.firstname,
      lastname: userState.value.lastname,
      email: userState.value.email,
      job: userState.value.job,
    };
  }),
  getUserEmail: computed(() => userState.value.email),
  getUserId: computed(() => userState.value.id),
  getUserIsActive: computed(() => userState.value.active),
};

export const userStore = {
  userState: readonly(userState),
  ...setters,
  ...getters,
};
