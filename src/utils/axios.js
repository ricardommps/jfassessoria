import axios from 'axios';
// config
import { HOST_API_JF, HOST_API_JF_APP } from 'src/config-global';

// ----------------------------------------------------------------------

// Interceptor comum para ambas as instâncias
const createResponseInterceptor = () => ({
  onFulfilled: (response) => response,
  onRejected: (error) => {
    if (axios.isCancel(error)) {
      console.error('Request cancelled:', error.message);
      return Promise.reject(error);
    }

    const errorMessage = error.response?.data || 'Something went wrong';
    console.error('API Error:', errorMessage);

    return Promise.reject(errorMessage);
  },
});

export const jfAppApi = axios.create({
  baseURL: HOST_API_JF,
  timeout: 10000, // timeout opcional
});

// Instância para JF
export const jfApi = axios.create({
  baseURL: HOST_API_JF_APP,
  timeout: 10000, // timeout opcional
});

// Aplicar interceptors
const interceptor = createResponseInterceptor();
jfAppApi.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);
jfApi.interceptors.response.use(interceptor.onFulfilled, interceptor.onRejected);

export const JF_APP_ENDPOINTS = {
  workouts: '/api/v2/workouts',
  finished: '/api/v2/finished',
};

export const API_ENDPOINTS = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/calendar',
  user: {
    changePassword: '/api/v2/user',
  },
  anamnese: {
    byCustomer: '/api/v2/anamnese',
  },
  notifications: {
    root: '/api/v2/notification',
    all: 'api/v2/notification/all',
    readAt: 'api/v2/notification/readAt',
  },
  auth: {
    me: '/api/v2/user/me',
    login: '/api/v2/auth',
    register: '/api/auth/register',
  },
  customer: '/api/v2/customer',
  profile: '/api/v2/customer/profile',
  changePassword: '/api/v2/customer/newPassword',
  customerAll: '/api/v2/customer/all',
  feedbacktraining: {
    save: '/api/v2/trainingfeedback',
  },
  medias: {
    root: '/api/v2/media',
  },
  metrics: {
    performance: '/api/v2/metrics/performance',
    find: '/api/v2/metrics/find',
    create: '/api/v2/metrics',
    physiological: '/api/v2/metrics/physiological',
    findById: '/api/v2/metrics/findById',
  },
  finishedtraining: {
    listByReview: '/api/v2/finishedtraining/review',
    trainingReview: '/api/v2/finishedtraining/review/training',
    trainingReviewId: '/api/v2/finishedtraining/review/trainingId',
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
    trainings: '/api/v2/training/trainings',
    details: '/api/v2/training/new',
    update: '/api/v2/training/update',
    register: '/api/v2/training',
    create: '/api/v2/training/newCreate',
    send: '/api/v2/training/sendTraining',
    sendNew: '/api/v2/training/sendTrainingNew',
    delete: '/api/v2/training/delete',
    clone: '/api/v2/training/clone',
    clonewithmedias: '/api/v2/training/clonewithmedias',
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
  rating: {
    root: '/api/v2/rating',
  },
  workout: {
    root: '/api/v2/workout',
  },
  finished: {
    review: '/api/v2/finished/review',
    unreviewedFinished: '/api/v2/finished/unreviewedFinished',
    volume: '/api/v2/finished/getVolumeByCustomer',
  },
  workoutLoad: '/api/v2/workout-load',
  invoice: {
    root: '/api/v2/invoice',
    all: '/api/v2/invoice/all',
  },
};
