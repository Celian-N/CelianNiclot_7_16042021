import { ICreateUser } from '../../interface/user/user'

export const useApi = ()=>{

  const loginCall = async (email:string, password : string) => {
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
    return await fetch('http://localhost:3000/auth/login', request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res
      })
      .catch((error) => alert('Erreur :' + error));
  }
  const signupCall = async (user : ICreateUser) => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({...user}),
    };
   return await fetch('http://localhost:3000/auth/signup', request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res
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

  return {loginCall, getAllUsers, signupCall}
}
