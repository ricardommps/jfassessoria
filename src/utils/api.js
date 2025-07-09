import axios from 'axios';
// config
import { HOST_API_JF_APP } from 'src/config-global';

// ----------------------------------------------------------------------

const apiInstance = axios.create({ baseURL: HOST_API_JF_APP });

// axiosInstance.interceptors.response.use(
//   (response) => response,
//   (error) => Promise.reject((error.response && error.response.data) || 'Something went wrong'),
// );

apiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      console.error(error.message);
    }
    return Promise.reject((error.response && error.response.data) || 'Something went wrong');
  },
);

export default apiInstance;

export const API_ENDPOINTS = {
  workouts: '/api/v2/workouts',
};
