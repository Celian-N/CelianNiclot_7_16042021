import { ICreateUser } from '../../interface/user/user';
import { ICreatePublication } from '../../interface/publications/publication';
import Cookies from 'js-cookie';
import axios from 'axios';

export const useApi = () => {
  //LOGIN AND SIGNUP
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
      .catch((error) => console.warn('Erreur :' + error));
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
      .catch((error) => console.warn('Erreur :' + error));
  };

  //PUBLICATIONS

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
        console.warn('Erreur :' + error);
      });
  };

  const getArticleCall = async (link : string) => {
    return await fetch(`http://localhost:3000/article/?article=${link}`, {
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
        console.warn('Erreur :' + error);
      });
  };

  const getAllPostsCall = async (page?: number) => {
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
        console.warn('Erreur :' + error);
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
        console.warn('Erreur :' + error);
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
        console.warn('Erreur :' + error);
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
      .catch((error) => console.warn('Erreur :' + error));
  };

  const likePublicationCall = async (publicationId: number, userId:number) => {
    return await fetch(`http://localhost:3000/publications/${publicationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
      body: JSON.stringify({userId:userId})
    })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.warn('Erreur :' + error);
      });
  };

  //USERS

  const getAllUsers = async () => {
    return await fetch('http://localhost:3000/users', { method: 'GET' })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.warn('Erreur :' + error));
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
      .catch((error) => console.warn('Erreur :' + error));
  };

  //COMMENTS
  const getCommentsLengthCall = async (publicationId :number)=> {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
    };
    const queryPublication = `?publicationId=${publicationId}`;
    return await fetch(`http://localhost:3000/comments${queryPublication}`, request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.warn('Erreur :' + error));
  }

  const getCommentsCall = async (publicationId: number, page?: number) => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
    };
    const queryPage = page ? `?page=${page}` : '';
    return await fetch(`http://localhost:3000/comments/${publicationId}${queryPage}`, request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.warn('Erreur :' + error));
  };

  const createCommentCall = async (publicationId: number, newComment: string) => {
    const request = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
      body: JSON.stringify({ comment: newComment }),
    };
    return await fetch(`http://localhost:3000/comments/${publicationId}`, request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.warn('Erreur :' + error));
  };
  const deleteCommentCall = async (commentId: number) => {
    return await fetch(`http://localhost:3000/comments/${commentId}`, {
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
        console.warn('Erreur :' + error);
      });
  };
  const editCommentCall = async (commentId: number, newComment: string) => {
    return await fetch(`http://localhost:3000/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
      body: JSON.stringify({ newComment: newComment }),
    })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.warn('Erreur :' + error);
      });
  };

  const likeCommentCall = async (commentId: number, userId:number) => {
    return await fetch(`http://localhost:3000/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
      body: JSON.stringify({commentId : commentId, userId:userId})
    })
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => {
        console.warn('Erreur :' + error);
      });
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
    getCommentsCall,
    createCommentCall,
    deleteCommentCall,
    editCommentCall,
    likePublicationCall,
    likeCommentCall,
    getCommentsLengthCall,
    getArticleCall
  };
};
