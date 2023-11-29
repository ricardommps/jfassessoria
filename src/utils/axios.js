import axios from 'axios';
// config
import { HOST_API_JF } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API_JF });

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
);

export default axiosInstance;

export const API_ENDPOINTS = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  user: {
    changePassword: '/api/v2/user',
  },
  auth: {
    me: '/api/v2/user/me',
    login: '/api/v2/auth',
    register: '/api/auth/register',
  },
  customer: '/api/v2/customer',
  customerAll: '/api/v2/customer/all',
  feedbacktraining: {
    save: '/api/v2/trainingfeedback',
  },
  metrics: {
    performance: '/api/v2/metrics/performance',
    find: '/api/v2/metrics/find',
    create: '/api/v2/metrics/',
    physiological: '/api/v2/metrics/physiological',
  },
  finishedtraining: {
    listByReview: '/api/v2/finishedtraining/review',
    trainingReview: '/api/v2/finishedtraining/review/training',
    update: '/api/v2/finishedtraining/update',
    allDone: '/api/v2/finishedtraining/review/done',
  },
  program: {
    list: '/api/v2/program/customer',
    register: '/api/v2/program',
    clone: '/api/v2/program/clone',
    send: '/api/v2/program/sendProgram',
    all: '/api/v2/program',
    viewPdf: '/api/v2/program/viewPdf',
    delete: '/api/v2/program',
    hide: '/api/v2/program/hide',
    show: '/api/v2/program/show',
    archived: '/api/v2/program/archived',
    allChart: '/api/v2/program/allChart',
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
