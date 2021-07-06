import { ICreateUser } from '@/interface/user/user';
import { inject, provide } from 'vue';
import { userStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';
import { asyncCall } from '../api/api.store';

export const userStoreProvider = () => {
  provide('userStore', userStore);
};

export function useUser() {
  const { setUser, getUser, updateUser, clearUser, ...rest } = inject('userStore') as typeof userStore;

  const { loginCall, signupCall, editUser, deleteUser } = useApi();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const user = await asyncCall('LOGIN', () => loginCall(email, password));
    if (!user.token) return;

    router.push({ name: 'Home' });
    Cookies.set('groupomania_token', user.token, { expires: 7 });
    return user;
  };

  const signup = async (user: ICreateUser) => {
    const userCreated = await asyncCall('SIGNUP', () => signupCall(user));
    if (userCreated.message == 'duplicate_mail') return { error: 'duplicate_mail' };
    if (!userCreated.email || !userCreated.active) return;

    await asyncCall('LOGIN', () => login(userCreated.email, user.password));
  };
  const logout = () => {
    Cookies.remove('groupomania_token');
    clearUser();
    router.push({ name: 'Login' });
  };

  const saveEditedUser = async (userId: number, user: Omit<ICreateUser, 'password'>, newPassword?: string) => {
    if (user.userPic) {
      const editedUser = await asyncCall('EDIT_USER', () => editUser(userId, { ...user }, newPassword, user.userPic));
      if (!editedUser) return;

      updateUser(editedUser);

      return editedUser;
    } else {
      const editedUser = await asyncCall('EDIT_USER', () => editUser(userId, { ...user }, newPassword));
      if (!editedUser) return;

      updateUser(editedUser);

      return editedUser;
    }
  };

  const deleteMe = async (userId: number) => {
    const userDeleted = await asyncCall('DELETE_USER', () => deleteUser(userId));
    if (!userDeleted.message) return;

    logout();
  };

  return { setUser, getUser, updateUser, login, signup, logout, saveEditedUser, deleteMe, ...rest };
}
