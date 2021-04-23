import Cookies from 'js-cookie';

export function isUserLoggedIn() {
  return !!Cookies.get('groupomania_token');
}