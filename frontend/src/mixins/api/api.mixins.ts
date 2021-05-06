import { ICreateUser } from '../../interface/user/user';
import { ICreatePublication } from '../../interface/publications/publication';
import Cookies from 'js-cookie';
import axios from 'axios';

export const useApi = () => {
  const loginCall = async (email: string, password: string) => {
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
        return res;
      })
      .catch((error) => alert('Erreur :' + error));
  };
  const signupCall = async (user: ICreateUser) => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ...user }),
    };
    return await fetch('http://localhost:3000/auth/signup', request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => alert('Erreur :' + error));
  };

  const createPublicationCall = async (publication: ICreatePublication, image?: File) => {
    const formData = new FormData();
    formData.append('publication', JSON.stringify(publication));
    if (image) {
      formData.append('image', image);
    }
    return axios
      .post('http://localhost:3000/publications', formData, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => {
        console.log(error)
        alert('Erreur :' + error)
      });
  };
  const getAllPostsCall = async (page?:number) => {
    return await fetch(`http://localhost:3000/publications/?page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
        alert('Erreur :' + error);
      });
  };
  const getPostByIdCall = async (publicationId: number) => {
    return await fetch(`http://localhost:3000/publications/${publicationId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
        alert('Erreur :' + error);
      });
  };
  const deletePublicationCall = async (publicationId: number) => {
    return await fetch(`http://localhost:3000/publications/${publicationId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.log(error);
        alert('Erreur :' + error);
      });
  };

  const editPublicationCall = async (publicationId: number, editedPublication: ICreatePublication, image?: File) => {
    const formData = new FormData();
    formData.append('publicationId', JSON.stringify(publicationId));
    formData.append('publication', JSON.stringify(editedPublication));
    if (image) {
      formData.append('image', image);
    }
    return axios
      .put(`http://localhost:3000/publications/${publicationId}`, formData, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => alert('Erreur :' + error));
  };

  const getAllUsers = async () => {
    return await fetch('http://localhost:3000/users', { method: 'GET' })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => alert('Erreur :' + error));
  };

  const getCurrentUser = async () => {
    return await fetch('http://localhost:3000/auth/me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
    })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => alert('Erreur :' + error));
  };

  return {
    loginCall,
    getAllUsers,
    signupCall,
    createPublicationCall,
    getAllPostsCall,
    deletePublicationCall,
    getCurrentUser,
    editPublicationCall,
    getPostByIdCall,
  };
};
