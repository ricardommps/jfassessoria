import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
// config
import { HOST_API_JF } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API_JF });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.data.message) {
      enqueueSnackbar(error.response.data.message, { autoHideDuration: 3000, variant: 'error' });
    }
    Promise.reject((error.response && error.response.data) || 'Something went wrong');
  },
);

export default axiosInstance;

export const API_ENDPOINTS = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  auth: {
    me: '/api/v2/user/me',
    login: '/api/v2/auth',
    register: '/api/auth/register',
  },
  customer: '/api/v2/customer',
  program: {
    list: '/api/v2/program/customer',
    details: '/api/v2/program',
    register: '/api/v2/program',
    clone: '/api/v2/program/clone',
    send: '/api/v2/program/sendProgram',
  },
  training: {
    list: '/api/v2/training/program',
    details: '/api/v2/training',
    register: '/api/v2/training',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
