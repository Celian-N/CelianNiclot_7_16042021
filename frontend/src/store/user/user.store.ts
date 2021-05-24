import { ICreateUser, IUser } from '@/interface/user/user';
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

  const { loginCall, signupCall, editUser } = useApi();
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const user = await loginCall(email, password);
    if (!user.token) return;

    router.push({ name: 'Home' });
    Cookies.set('groupomania_token', user.token, { expires: 7 });
    return user
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

  const saveEditedUser = async (userId : number, user : Omit<ICreateUser, 'password'>, newPassword?:string)=>{

    if (user.userPic) {
      const editedUser = await editUser(userId,
        { ...user } , newPassword, user.userPic
      );
      if (!editedUser) return;

      updateUser(editedUser)

      return editedUser;
    } else {
      const editedUser = await editUser(userId, { ...user }, newPassword);
      if (!editedUser) return;

      updateUser(editedUser)
    
      return editedUser;
    }
  }

  return { setUser, getUser, updateUser, login, signup, logout,saveEditedUser, ...rest };
}
