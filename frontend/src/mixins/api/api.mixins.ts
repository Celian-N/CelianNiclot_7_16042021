import { useRouter } from 'vue-router';
import Cookies from 'js-cookie';

export const useApi = ()=>{
  const router = useRouter();

  const login = async (email:string, password : string) => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    };
    await fetch('http://localhost:3000/auth/login', request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        router.push({ name: 'Home' });
        Cookies.set('groupomania_token', res.token, { expires: 7 });
      })
      .catch((error) => alert('Erreur :' + error));
  }

  const getAllUsers = async ()=>{
    return await fetch('http://localhost:3000/users', { method: 'GET' })
    .then((result) => {
      return result.json();
    })
    .then((res) => {
      return res
    })
    .catch((error) => alert('Erreur :' + error));
  }

  return {login, getAllUsers}
}
