import { ICreateUser } from '../../interface/user/user';
import {
  IApiPublication,
  ICreatePublication,
  IPublication,
  IPublicationAuthor,
} from '../../interface/publications/publication';
import Cookies from 'js-cookie';
import axios from 'axios';
import { IComment } from '@/interface/comments/comments';

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
        console.log(res);
        return res;
      })
      .catch((error) => {
        console.warn('Erreur :' + error);
      });
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

  const editUser = async (
    userId: number,
    user: Omit<ICreateUser, 'password'>,
    newPassword?: string,
    image?: File | null
  ) => {
    const formData = new FormData();
    formData.append('user', JSON.stringify(user));
    if (newPassword) {
      formData.append('password', newPassword);
    }
    if (image) {
      formData.append('image', image);
    }
    return axios
      .put(`http://localhost:3000/users/${userId}`, formData, {
        headers: {
          Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
        },
      })
      .then((res) => {
        return res.data;
      })
      .catch((error) => console.warn('Erreur :' + error));
  };

  //PUBLICATIONS

  const createPublicationCall = async (publication: ICreatePublication, image?: File | null) => {
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
      }) as Promise<IApiPublication>;
  };

  const getArticleCall = async (link: string) => {
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
    return (await fetch(`http://localhost:3000/publications/?page=${page}`, {
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
      })) as Promise<IApiPublication[]>;
  };

  const getMostLikedPublicationCall = async () => {
    return (await fetch(`http://localhost:3000/publications/more-liked`, {
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
      })) as Promise<IPublication[]>;
  };

  const getPostByIdCall = async (publicationId: number) => {
    return (await fetch(`http://localhost:3000/publications/${publicationId}`, {
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
      })) as Promise<IApiPublication>;
  };
  const getPostsByUserIdCall = async (userId: number) => {
    return (await fetch(`http://localhost:3000/publications/user/${userId}`, {
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
      })) as Promise<IApiPublication[]>;
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

  const editPublicationCall = async (
    publicationId: number,
    editedPublication: ICreatePublication,
    image?: File | null
  ) => {
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
      .catch((error) => console.warn('Erreur :' + error)) as Promise<IApiPublication>;
  };

  const likePublicationCall = async (publicationId: number, userId: number) => {
    return await fetch(`http://localhost:3000/publications/${publicationId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
      body: JSON.stringify({ userId: userId }),
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

  const fetchAuthorInfosCall = async (authorId: number) => {
    return (await fetch(`http://localhost:3000/users/${authorId}`, {
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
      })) as Promise<IPublicationAuthor>;
  };
  //USERS

  const getAllUsers = async (searchedUser: string) => {
    const queryUser = `?search=${searchedUser}`;
    return await fetch(`http://localhost:3000/users${queryUser}`, { method: 'GET' })
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
  const getCommentsLengthCall = async (publicationId: number) => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
    };
    const queryPublication = `?publicationId=${publicationId}`;
    return (await fetch(`http://localhost:3000/comments${queryPublication}`, request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.warn('Erreur :' + error))) as Promise<number>;
  };

  const getCommentsCall = async (publicationId: number, page?: number) => {
    const request = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
    };
    const queryPage = page ? `?page=${page}` : '';
    return (await fetch(`http://localhost:3000/comments/${publicationId}${queryPage}`, request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.warn('Erreur :' + error))) as Promise<IComment[]>;
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
    return (await fetch(`http://localhost:3000/comments/${publicationId}`, request)
      .then((result) => {
        return result.json();
      })
      .then((res) => {
        return res;
      })
      .catch((error) => console.warn('Erreur :' + error))) as Promise<IComment>;
  };
  const deleteCommentCall = async (commentId: number) => {
    return (await fetch(`http://localhost:3000/comments/${commentId}`, {
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
      })) as Promise<IComment>;
  };
  const editCommentCall = async (commentId: number, newComment: string) => {
    return (await fetch(`http://localhost:3000/comments/${commentId}`, {
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
      })) as Promise<IComment>;
  };

  const likeCommentCall = async (commentId: number, userId: number) => {
    return await fetch(`http://localhost:3000/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + Cookies.get('groupomania_token'),
      },
      body: JSON.stringify({ commentId: commentId, userId: userId }),
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

  //---ADMIN---

  const getSignaledPosts = async () => {
    return (await fetch(`http://localhost:3000/admin`, {
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
      })) as Promise<(IComment | IApiPublication)[]>;
  };

  const deletePostAdmin = async (type: string, postId: number) => {
    return await fetch(`http://localhost:3000/admin/${type}/${postId}`, {
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
  const ignorePostAdmin = async (type: string, postId: number) => {
    console.log('postId : ', postId);
    return await fetch(`http://localhost:3000/admin/${type}/${postId}`, {
      method: 'POST',
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

  const banUserAdmin = async (userId: number) => {
    return await fetch(`http://localhost:3000/admin/ban/${userId}`, {
      method: 'POST',
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

  const signalComment = async (commentId: number) => {
    return await fetch(`http://localhost:3000/comments/signaled/${commentId}`, {
      method: 'POST',
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

  const signalPublication = async (publicationId: number) => {
    return await fetch(`http://localhost:3000/publications/signaled/${publicationId}`, {
      method: 'POST',
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
    getArticleCall,
    editUser,
    fetchAuthorInfosCall,
    getSignaledPosts,
    deletePostAdmin,
    ignorePostAdmin,
    banUserAdmin,
    signalComment,
    signalPublication,
    getPostsByUserIdCall,
    getMostLikedPublicationCall,
  };
};
