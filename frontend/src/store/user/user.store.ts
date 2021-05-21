import { ICreateUser } from '@/interface/user/user';
import { inject, provide } from 'vue';
import { userStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import Cookies from 'js-cookie';
import { useRouter } from 'vue-router';

export const userStoreProvider = () => {
  provide('userStore', userStore);
};

export function useUser() {
  const { setUser, getUser, updateUser, clearUser, ...rest } = inject('userStore') as typeof userStore;

  const { loginCall, signupCall } = useApi();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const user = await loginCall(email, password);
    if (!user.token) return;

    router.push({ name: 'Home' });
    Cookies.set('groupomania_token', user.token, { expires: 7 });
  };

  const signup = async (user: ICreateUser) => {
    const userCreated = await signupCall(user);
    if (!userCreated.email || !userCreated.active) return;

    await login(userCreated.email, user.password);
  };
  const logout = () => {
    Cookies.remove('groupomania_token');
    clearUser();
    router.push({ name: 'Login' });
  };

  return { setUser, getUser, updateUser, login, signup, logout, ...rest };
}
