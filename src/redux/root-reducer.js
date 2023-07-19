import { combineReducers } from 'redux';
import createWebStorage from 'redux-persist/lib/storage/createWebStorage';

import customerReducer from './slices/customers';
import programReducer from './slices/program';
import trainingReducer from './slices/training';

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
});
