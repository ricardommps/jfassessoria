import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const initialState = {
  trainings: null,
  trainingsStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  trainingCreate: null,
  training: null,
  trainingStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  showTraining: false,
  updateTrainingSuccess: null,
};

const slice = createSlice({
  name: 'training',
  initialState,
  reducers: {
    getTrainingsStart(state) {
      state.trainingsStatus.loading = true;
      state.trainingsStatus.empty = false;
      state.trainingsStatus.error = null;
      state.trainingCreate = null;
      state.training = null;
      state.updateTrainingSuccess = null;
    },
    getTrainingsFailure(state, action) {
      state.trainingsStatus.loading = false;
      state.trainingsStatus.empty = false;
      state.trainingsStatus.error = action.payload;
    },
    getTrainingsSuccess(state, action) {
      const trainings = action.payload;
      state.trainings = trainings;

      state.trainingsStatus.loading = false;
      state.trainingsStatus.empty = !trainings.length;
      state.trainingsStatus.error = null;
    },

    getTrainingStart(state) {
      state.trainingStatus.loading = true;
      state.trainingStatus.empty = false;
      state.trainingStatus.error = null;
      state.trainingCreate = null;
    },
    getTrainingFailure(state, action) {
      state.trainingStatus.loading = false;
      state.trainingStatus.empty = false;
      state.trainingStatus.error = action.payload;
    },
    getTrainingSuccess(state, action) {
      const training = action.payload;
      state.training = training;

      state.trainingStatus.loading = false;
      state.trainingStatus.empty = !training.length;
      state.trainingStatus.error = null;
    },

    createTrainingSuccess(state, action) {
      state.trainingCreate = action.payload;
    },

    updateTrainingSuccess(state, action) {
      state.updateTrainingSuccess = action.payload;
    },

    clearTraining(state) {
      state.trainingCreate = null;
      state.training = null;
      state.updateTrainingSuccess = null;
    },

    clearTrainings(state) {
      state.trainingStatus.loading = false;
      state.trainingStatus.empty = false;
      state.trainingStatus.error = null;
      state.trainingCreate = null;
      state.trainings = null;
      state.training = null;
    },

    showTraining(state, action) {
      state.showTraining = action.payload;
    },
  },
});

export default slice.reducer;

export function getTrainings(programId) {
  return async (dispatch) => {
    dispatch(slice.actions.getTrainingsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.training.list}/${programId}`);
      dispatch(slice.actions.getTrainingsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getTrainingsFailure(error));
    }
  };
}

export function getTrainingById(trainingId) {
  return async (dispatch) => {
    dispatch(slice.actions.getTrainingStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.training.register}/${trainingId}`);
      dispatch(slice.actions.getTrainingSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.getTrainingFailure(error));
    }
  };
}

export function createTraining(trainingData) {
  return async (dispatch) => {
    try {
      const data = { ...trainingData };
      const response = await axios.post(API_ENDPOINTS.training.register, data);
      dispatch(slice.actions.createTrainingSuccess(response.data));
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateTraining(trainingUpadate, trainingId) {
  return async (dispatch) => {
    try {
      const dataUpdate = { ...trainingUpadate };
      const response = await axios.put(
        `${API_ENDPOINTS.training.register}/${trainingId}`,
        dataUpdate,
      );
      dispatch(slice.actions.updateTrainingSuccess(response.data));
    } catch (error) {
      console.error(error);
    }
  };
}

export function clearTraining() {
  return async (dispatch) => {
    dispatch(slice.actions.clearTraining());
  };
}

export function clearTrainings() {
  return async (dispatch) => {
    dispatch(slice.actions.clearTrainings());
  };
}

export function callShowTraining(status) {
  return async (dispatch) => {
    dispatch(slice.actions.showTraining(status));
  };
}
