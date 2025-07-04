import { createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios'; // Note: usando jfAppApi pois o endpoint é do JF_APP

const initialState = {
  createWorkouts: null,
  createWorkoutsStatus: {
    loading: false,
    error: null,
  },
  workoutsNew: [],
  workoutsNewStatus: {
    loading: false,
    error: null,
    empty: false,
  },
  workoutItem: null,
  workoutItemStatus: {
    loading: false,
    error: null,
    empty: false,
  },
  deleteWorkouts: null,
  deleteWorkoutsStatus: {
    loading: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'workouts', // Corrigido o typo 'woorkouts'
  initialState,
  reducers: {
    createWorkoutsStart(state) {
      state.createWorkouts = null;
      state.createWorkoutsStatus.error = null;
      state.createWorkoutsStatus.loading = true;
    },
    createWorkoutsSuccess(state, action) {
      state.createWorkouts = action.payload;
      state.createWorkoutsStatus.error = null;
      state.createWorkoutsStatus.loading = false;
    },
    createWorkoutsFailure(state, action) {
      state.createWorkouts = null;
      state.createWorkoutsStatus.error = action.payload;
      state.createWorkoutsStatus.loading = false;
    },
    deleteWorkoutsStart(state) {
      state.deleteWorkouts = null;
      state.deleteWorkoutsStatus.error = null;
      state.deleteWorkoutsStatus.loading = true;
    },
    deleteWorkoutsSuccess(state, action) {
      state.deleteWorkouts = action.payload;
      state.deleteWorkoutsStatus.error = null;
      state.deleteWorkoutsStatus.loading = false;
    },
    deleteWorkoutsFailure(state, action) {
      state.deleteWorkouts = null;
      state.deleteWorkoutsStatus.error = action.payload;
      state.deleteWorkoutsStatus.loading = false;
    },
    updateWorkoutsStart(state) {
      state.createWorkouts = null;
      state.createWorkoutsStatus.error = null;
      state.createWorkoutsStatus.loading = true;
    },
    updateWorkoutsSuccess(state, action) {
      state.createWorkouts = action.payload;
      state.createWorkoutsStatus.error = null;
      state.createWorkoutsStatus.loading = false;
    },
    updateWorkoutsFailure(state, action) {
      state.createWorkouts = null;
      state.createWorkoutsStatus.error = action.payload;
      state.createWorkoutsStatus.loading = false;
    },
    getWorkoutsStart(state) {
      state.createWorkouts = null;
      state.createWorkoutsStatus.error = null;
      state.createWorkoutsStatus.loading = false;
      state.deleteWorkouts = null;
      state.deleteWorkoutsStatus.error = null;
      state.deleteWorkoutsStatus.loading = false;
      state.workoutsNew = [];
      state.workoutsNewStatus.loading = true;
      state.workoutsNewStatus.error = null;
      state.workoutsNewStatus.empty = false;
      state.workoutItem = null;
      state.workoutItemStatus.error = null;
      state.workoutItemStatus.loading = false;
      state.workoutItemStatus.empty = false;
    },
    getWorkoutsSuccess(state, action) {
      const workouts = action.payload;
      state.workoutsNew = workouts;
      state.workoutsNewStatus.loading = true;
      state.workoutsNewStatus.error = null;
      state.workoutsNewStatus.empty = !workouts.length || workouts.length === 0;
    },
    getWorkoutsFailure(state, action) {
      const error = action.payload;
      state.workoutsNew = [];
      state.workoutsNewStatus.loading = true;
      state.workoutsNewStatus.error = error;
      state.workoutsNewStatus.empty = false;
    },
    getWorkoutItemStart(state) {
      state.workoutItem = null;
      state.workoutItemStatus.error = null;
      state.workoutItemStatus.loading = true;
      state.workoutItemStatus.empty = false;
    },
    getWorkoutItemSuccess(state, action) {
      const workoutItem = action.payload;

      state.workoutItem = workoutItem;
      state.workoutItemStatus.error = null;
      state.workoutItemStatus.loading = true;
      state.workoutItemStatus.empty = !workoutItem;
    },
    getWorkoutItemFailure(state, action) {
      const error = action.payload;

      state.workoutItem = null;
      state.workoutItemStatus.error = error;
      state.workoutItemStatus.loading = true;
      state.workoutItemStatus.empty = false;
    },
  },
});

export default slice.reducer;

let abortController = null;

export function createWorkouts(payload) {
  return async (dispatch) => {
    if (abortController) {
      abortController.abort('Nova requisição iniciada, cancelando a anterior.');
    }
    abortController = new AbortController();
    try {
      dispatch(slice.actions.createWorkoutsStart());
      const data = { ...payload };
      const response = await jfApi.post(JF_APP_ENDPOINTS.workouts, data, {
        signal: abortController.signal,
      });
      dispatch(slice.actions.createWorkoutsSuccess(response.data));
    } catch (error) {
      if (!axios.isCancel(error) && error.name !== 'AbortError') {
        dispatch(slice.actions.createWorkoutsFailure(error.message || error));
      }
    } finally {
      abortController = null;
    }
  };
}

export function deleteWorkouts(workoutId) {
  return async (dispatch) => {
    if (abortController) {
      abortController.abort('Nova requisição iniciada, cancelando a anterior.');
    }
    abortController = new AbortController();
    try {
      dispatch(slice.actions.deleteWorkoutsStart());
      const response = await jfApi.delete(`${JF_APP_ENDPOINTS.workouts}?workoutId=${workoutId}`, {
        signal: abortController.signal,
      });
      dispatch(slice.actions.deleteWorkoutsSuccess(response.data));
    } catch (error) {
      if (!axios.isCancel(error) && error.name !== 'AbortError') {
        dispatch(slice.actions.deleteWorkoutsFailure(error.message || error));
      }
    } finally {
      abortController = null;
    }
  };
}

export function updateWorkouts(payload, workoutId) {
  return async (dispatch) => {
    if (abortController) {
      abortController.abort('Nova requisição iniciada, cancelando a anterior.');
    }
    abortController = new AbortController();
    try {
      dispatch(slice.actions.updateWorkoutsStart());
      const data = { ...payload };
      const response = await jfApi.put(
        `${JF_APP_ENDPOINTS.workouts}?workoutId=${workoutId}`,
        data,
        {
          signal: abortController.signal,
        },
      );
      dispatch(slice.actions.updateWorkoutsSuccess(response.data));
    } catch (error) {
      if (!axios.isCancel(error) && error.name !== 'AbortError') {
        dispatch(slice.actions.updateWorkoutsFailure(error.message || error));
      }
    } finally {
      abortController = null;
    }
  };
}

export function getWorkouts(programId, type) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.getWorkoutsStart());
      const response = await jfApi.get(
        `${JF_APP_ENDPOINTS.workouts}/list?programId=${programId}${
          type === 1 ? '&running=true' : '&running=false'
        }`,
      );
      dispatch(slice.actions.getWorkoutsSuccess(response.data));
    } catch (error) {
      console.log('----error', error);
      dispatch(slice.actions.getWorkoutsFailure(error.message || error));
    } finally {
      abortController = null;
    }
  };
}

export function getWorkoutItem(id) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.getWorkoutItemStart());
      const response = await jfApi.get(`${JF_APP_ENDPOINTS.workouts}/workout?id=${id}`);
      dispatch(slice.actions.getWorkoutItemSuccess(response.data));
    } catch (error) {
      console.log('----error', error);
      dispatch(slice.actions.getWorkoutItemFailure(error.message || error));
    } finally {
      abortController = null;
    }
  };
}
