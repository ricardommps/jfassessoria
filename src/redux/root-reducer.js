import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import anamneseReducer from './slices/anamnese';
import customerReducer from './slices/customers';
import feedbackTrainingReducer from './slices/feedback-training';
import finishedTrainingReducer from './slices/finished-training';
import mediasReducer from './slices/medias';
import metricsReducer from './slices/metrics';
import paymentReducer from './slices/payment';
import programReducer from './slices/program';
import ratingReducer from './slices/rating';
import trainingReducer from './slices/training';
import userReducer from './slices/user';

export const createNoopStorage = () => ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  getItem(_key) {
    return Promise.resolve(null);
  },
  setItem(_key, value) {
    return Promise.resolve(value);
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  removeItem(_key) {
    return Promise.resolve();
  },
});

export const storage =
  typeof window !== 'undefined' ? createWebStorage('local') : createNoopStorage();

export const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  whitelist: [],
};

export const rootReducer = combineReducers({
  customer: customerReducer,
  program: programReducer,
  training: trainingReducer,
  payment: paymentReducer,
  user: userReducer,
  finishedTraining: finishedTrainingReducer,
  feedbackTraining: feedbackTrainingReducer,
  metrics: metricsReducer,
  medias: mediasReducer,
  rating: ratingReducer,
  anamnese: anamneseReducer,
});
