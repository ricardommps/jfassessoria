import axios from 'axios';
import { enqueueSnackbar } from 'notistack';
// config
import { HOST_API_JF } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API_JF });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error) {
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
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
    register: '/api/v2/program',
    clone: '/api/v2/program/clone',
    send: '/api/v2/program/sendProgram',
    all: 'api/v2/program',
    viewPdf: 'api/v2/program/viewPdf',
    delete: '/api/v2/program',
  },
  training: {
    list: '/api/v2/training/program',
    details: '/api/v2/training',
    register: '/api/v2/training',
    send: '/api/v2/training/sendTraining',
    delete: '/api/v2/training',
  },
  payment: {
    list: '/api/v2/payment',
    created: '/api/v2/payment',
    delete: '/api/v2/payment',
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
