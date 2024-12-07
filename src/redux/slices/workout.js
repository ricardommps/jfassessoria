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
  },
});

export default slice.reducer;

export function createWorkout(payload) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.createWorkoutStart());
      const data = { ...payload };
      const response = await axios.post(API_ENDPOINTS.workout.root, data);
      dispatch(slice.actions.createWorkoutSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.createWorkoutFailure(error));
      throw error(error);
    }
  };
}

export function upDateWorkout(payload, id) {
  return async (dispatch) => {
    try {
      dispatch(slice.actions.createWorkoutStart());
      const data = { ...payload };
      const response = await axios.put(`${API_ENDPOINTS.workout.root}/${id}`, data);
      dispatch(slice.actions.createWorkoutSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.createWorkoutFailure(error));
      throw error(error);
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

export function reviewWorkout(id, payload) {
  return async (dispatch) => {
    dispatch(slice.actions.reviewWorkoutStart());
    try {
      const data = { ...payload };
      const response = await axios.put(`${API_ENDPOINTS.finished.review}/${id}`, data);
      dispatch(slice.actions.reviewWorkoutSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.reviewWorkoutFailure(error));
      throw error(error);
    }
  };
}
