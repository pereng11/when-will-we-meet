import { Cookies } from 'react-cookie';

const cookies = new Cookies();

const setCookie = (name: string, value: string, options?: any) => {
  return cookies.set(name, value, { ...options });
};

const getCookie = (name: string) => {
  return cookies.get(name);
};

const removeCookie = (name: string, options?: any) => {
  return cookies.remove(name, { ...options });
};

export { setCookie, getCookie, removeCookie };
