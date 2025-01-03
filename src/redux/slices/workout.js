import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const initialState = {
  workouts: null,
  workoutsStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  workoutAction: null,
  workoutActionStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  workout: null,
  workoutStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  workoutLoad: null,
  workoutLoadStatus: {
    loading: false,
    error: null,
    empty: false,
  },
};
const slice = createSlice({
  name: 'workout',
  initialState,
  reducers: {
    createWorkoutStart(state) {
      state.workoutAction = null;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = true;
    },
    createWorkoutSuccess(state, action) {
      state.workoutAction = action.payload;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = false;
    },
    createWorkoutFailure(state, action) {
      state.workoutAction = null;
      state.workoutActionStatus.error = action.payload;
      state.workoutActionStatus.loading = false;
    },

    cloneWorkoutStart(state) {
      state.workoutAction = null;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = true;
    },
    cloneWorkoutSuccess(state, action) {
      state.workoutAction = action.payload;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = false;
    },
    cloneWorkoutFailure(state, action) {
      state.workoutAction = null;
      state.workoutActionStatus.error = action.payload;
      state.workoutActionStatus.loading = false;
    },

    sendWorkoutStart(state) {
      state.workoutAction = null;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = true;
    },
    sendWorkoutSuccess(state, action) {
      state.workoutAction = action.payload;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = false;
    },
    sendWorkoutFailure(state, action) {
      state.workoutAction = null;
      state.workoutActionStatus.error = action.payload;
      state.workoutActionStatus.loading = false;
    },

    deleteWorkoutStart(state) {
      state.workoutAction = null;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = true;
    },
    deleteWorkoutSuccess(state, action) {
      state.workoutAction = action.payload;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = false;
    },
    deleteWorkoutFailure(state, action) {
      state.workoutAction = null;
      state.workoutActionStatus.error = action.payload;
      state.workoutActionStatus.loading = false;
    },

    reviewWorkoutStart(state) {
      state.workoutAction = null;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = true;
    },

    reviewWorkoutSuccess(state, action) {
      state.workoutAction = action.payload;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = false;
    },
    reviewWorkoutFailure(state, action) {
      state.workoutAction = null;
      state.workoutActionStatus.error = action.payload;
      state.workoutActionStatus.loading = false;
    },

    getWorkoutsStart(state) {
      state.workout = null;
      state.workoutStatus.error = null;
      state.workoutStatus.loading = false;
      state.workoutStatus.empty = false;

      state.workoutAction = null;
      state.workoutActionStatus.error = null;
      state.workoutActionStatus.loading = false;

      state.workouts = null;
      state.workoutsStatus.error = null;
      state.workoutsStatus.loading = true;
      state.workoutsStatus.empty = false;
    },
    getWorkoutsSuccess(state, action) {
      const workouts = action.payload;
      state.workouts = workouts;

      state.workoutsStatus.error = null;
      state.workoutsStatus.loading = false;
      state.workoutsStatus.empty = !workouts.length || workouts.length === 0;
    },
    getWorkoutsFailure(state, action) {
      const error = action.payload;

      state.workoutsStatus.error = error;

      state.workouts = null;
      state.workoutsStatus.loading = false;
      state.workoutsStatus.empty = false;
    },

    getWorkoutStart(state) {
      state.workout = null;
      state.workoutStatus.error = null;
      state.workoutStatus.loading = true;
      state.workoutStatus.empty = false;

      // state.workoutLoad = null;
      // state.workoutLoadStatus.loading = false;
      // state.workoutLoadStatus.error = null;
      // state.workoutLoadStatus.empty = false;
    },
    getWorkoutSuccess(state, action) {
      const workout = action.payload;
      state.workout = workout;

      state.workoutStatus.error = null;
      state.workoutStatus.loading = false;
      state.workoutStatus.empty = false;
    },
    getWorkoutFailure(state, action) {
      const error = action.payload;

      state.workoutStatus.error = error;

      state.workout = null;
      state.workoutStatus.loading = false;
      state.workoutStatus.empty = false;
    },
    getWorkoutLoadStart(state) {
      state.workoutLoad = null;
      state.workoutLoadStatus.loading = true;
      state.workoutLoadStatus.error = null;
      state.workoutLoadStatus.empty = false;
    },
    getWorkoutLoadFailure(state, action) {
      state.workoutLoad = null;
      state.workoutLoadStatus.loading = false;
      state.workoutLoadStatus.error = action.payload;
      state.workoutLoadStatus.empty = false;
    },
    getWorkoutLoadSuccess(state, action) {
      const workoutLoad = action.payload;

      state.workoutLoad = workoutLoad;
      state.workoutLoadStatus.loading = false;
      state.workoutLoadStatus.error = null;
      state.workoutLoadStatus.empty = !workoutLoad.length || workoutLoad.length === 0;
    },
  },
});

export default slice.reducer;

let abortController = null;

export function createWorkout(payload) {
  return async (dispatch) => {
    // Cancelar a requisição anterior, se existir
    if (abortController) {
      abortController.abort(); // Cancela a requisição anterior
    }

    // Criar um novo AbortController para a nova requisição
    abortController = new AbortController();
    try {
      await dispatch(slice.actions.createWorkoutStart());
      const data = { ...payload };
      const response = await axios.post(API_ENDPOINTS.workout.root, data, {
        signal: abortController.signal,
      });
      await dispatch(slice.actions.createWorkoutSuccess(response.data));
      return response;
    } catch (error) {
      if (error.name === 'CanceledError') {
        console.error(error.message);
      } else {
        dispatch(slice.actions.createTrainingFailure(error));
        console.error(error);
        throw error(error);
      }
    } finally {
      // Resetar o CancelToken após a conclusão da requisição
      abortController = null;
    }
  };
}

export function upDateWorkout(payload, id) {
  return async (dispatch) => {
    if (abortController) {
      abortController.abort(); // Cancela a requisição anterior
    }

    // Criar um novo AbortController para a nova requisição
    abortController = new AbortController();
    try {
      dispatch(slice.actions.createWorkoutStart());
      const data = { ...payload };
      const response = await axios.put(`${API_ENDPOINTS.workout.root}/${id}`, data, {
        signal: abortController.signal,
      });
      dispatch(slice.actions.createWorkoutSuccess(response.data));
      return response;
    } catch (error) {
      if (error.name === 'CanceledError') {
        console.error(error.message);
      } else {
        dispatch(slice.actions.createTrainingFailure(error));
        throw error(error);
      }
    } finally {
      // Resetar o CancelToken após a conclusão da requisição
      abortController = null;
    }
  };
}

export function cloneWorkout(id, qntCopy) {
  return async (dispatch) => {
    dispatch(slice.actions.cloneWorkoutStart());
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.workout.root}/clone/${id}?qntCopy=${qntCopy}`,
      );
      dispatch(slice.actions.cloneWorkoutSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.cloneWorkoutFailure(error));
    }
  };
}

export function sendWorkout(payload) {
  return async (dispatch) => {
    dispatch(slice.actions.sendWorkoutStart());
    try {
      const response = await axios.post(`${API_ENDPOINTS.workout.root}/send`, payload);
      dispatch(slice.actions.sendWorkoutSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.sendWorkoutFailure(error));
    }
  };
}

export function deleteWorkout(id) {
  return async (dispatch) => {
    dispatch(slice.actions.cloneWorkoutStart());
    try {
      const response = await axios.delete(`${API_ENDPOINTS.workout.root}/${id}`);
      dispatch(slice.actions.cloneWorkoutSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.cloneWorkoutFailure(error));
    }
  };
}

export function getWorkouts(programId, type) {
  return async (dispatch) => {
    const workoutType = type === 1 ? 'running' : 'gym';
    dispatch(slice.actions.getWorkoutsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.workout.root}/${workoutType}/${programId}`);
      dispatch(slice.actions.getWorkoutsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getWorkoutsFailure(error));
      throw error(error);
    }
  };
}

export function getWorkout(id) {
  return async (dispatch) => {
    dispatch(slice.actions.getWorkoutStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.workout.root}/${id}`);
      dispatch(slice.actions.getWorkoutSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getWorkoutFailure(error));
      throw error(error);
    }
  };
}

export function getWorkoutFeedback(customerId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.getWorkoutStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.workout.root}/${customerId}/${id}`);
      dispatch(slice.actions.getWorkoutSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getWorkoutFailure(error));
      throw error(error);
    }
  };
}

export function reviewWorkout(customerId, id, payload) {
  return async (dispatch) => {
    dispatch(slice.actions.reviewWorkoutStart());
    try {
      const data = { ...payload };
      const response = await axios.put(
        `${API_ENDPOINTS.finished.review}/${customerId}/${id}`,
        data,
      );
      dispatch(slice.actions.reviewWorkoutSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.reviewWorkoutFailure(error));
      throw error(error);
    }
  };
}

export function getWorkoutLoad(customerId, id) {
  return async (dispatch) => {
    dispatch(slice.actions.getWorkoutLoadStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.workoutLoad}/${customerId}/${id}`);
      dispatch(slice.actions.getWorkoutLoadSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getWorkoutLoadFailure(error));
    }
  };
}
