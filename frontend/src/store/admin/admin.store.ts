import { inject, provide } from 'vue';
import { adminStore } from './state';
import { useApi } from '../../mixins/api/api.mixins';
import { IApiPublication, IPublication } from '@/interface/publications/publication';
import { IComment } from '@/interface/comments/comments';
import {isComment} from '../../helpers/postType/postType.helper'
import { metaLinksStore } from '../metadata/state';

export const adminStoreProvider = () => {
  provide('adminStore', adminStore);
};

export function useAdmin() {
  const { setPosts, removePost, ...rest } = inject('adminStore') as typeof adminStore;
  const {
    getSignaledPosts,
    deletePostAdmin,
    ignorePostAdmin,
    banUserAdmin
  } = useApi();

  const fetchSignaledPosts = async () => {
    const posts = await getSignaledPosts() as (IComment | IApiPublication)[];
    if (!posts) return;
    
    posts.forEach((post) => {
      if(isComment(post)){
        setPosts([post])
      }
      else{
        setPosts([{ ...post, link: post.link?.og.url }]);
        if (post.link) {
          metaLinksStore.setData(post.id, [post.link]);
        }
      }}
      )
      
    return posts;
  };

  const deletePost = async (type : string, postId : number)=>{
    const post = await deletePostAdmin(type, postId);
    if (!post) return;

    removePost(postId);
    return post;
  }

  const ignorePost = async (type : string, postId : number)=>{
    const post = await ignorePostAdmin(type, postId);
    if (!post) return;
    
    removePost(postId);
    return post;
  }

  const banUser = async (userId: number)=>{
    const user = await banUserAdmin(userId);
    if (!user) return;

    return user;
  }

  return {
    fetchSignaledPosts,
    deletePost,
    ignorePost,
    banUser,
    ...rest
  };
}
