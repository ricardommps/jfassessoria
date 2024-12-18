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
  trainingCreateStatus: {
    loading: false,
    error: null,
  },
  cloneTraining: null,
  cloneTrainingStatus: {
    loading: false,
    error: null,
  },
  training: null,
  trainingStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  showTraining: false,
  updateTrainingSuccess: null,
  sendTrainingSuccess: false,
  sendTrainingStatus: {
    loading: false,
    error: null,
  },
  deleteTraining: null,
  deleteTrainingStatus: {
    loading: false,
    error: false,
  },
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
      state.trainingCreateStatus.error = null;
      state.trainingCreateStatus.loading = false;
      state.training = null;
      state.updateTrainingSuccess = null;
      state.cloneTrainingStatus.loading = false;
      state.cloneTrainingStatus.error = null;
      state.cloneTraining = null;
      state.deleteTraining = null;
      state.deleteTrainingStatus.loading = false;
      state.deleteTrainingStatus.error = false;
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
      state.trainingCreateStatus.error = null;
      state.trainingCreateStatus.loading = false;
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

    createTrainingStart(state) {
      state.trainingCreate = null;
      state.trainingCreateStatus.error = null;
      state.trainingCreateStatus.loading = true;
    },

    createTrainingSuccess(state, action) {
      state.trainingCreate = action.payload;
      state.trainingCreateStatus.error = null;
      state.trainingCreateStatus.loading = false;
    },

    createTrainingFailure(state, action) {
      state.trainingCreate = null;
      state.trainingCreateStatus.error = action.payload;
      state.trainingCreateStatus.loading = false;
    },

    updateTrainingSuccess(state, action) {
      state.updateTrainingSuccess = action.payload;
    },

    clearTraining(state) {
      state.trainingCreate = null;
      state.training = null;
      state.updateTrainingSuccess = null;
      state.sendTrainingSuccess = null;
      state.sendTrainingStatus.loading = false;
      state.sendTrainingStatus.error = null;
      state.sendTrainingSuccess = null;
      state.trainingCreate = null;
      state.trainingCreateStatus.error = null;
      state.trainingCreateStatus.loading = false;
    },

    clearTrainings(state) {
      state.trainingStatus.loading = false;
      state.trainingStatus.empty = false;
      state.trainingStatus.error = null;
      state.trainingCreate = null;
      state.trainings = null;
      state.training = null;
      state.trainingCreate = null;
      state.trainingCreateStatus.error = null;
      state.trainingCreateStatus.loading = false;
    },

    showTraining(state, action) {
      state.showTraining = action.payload;
    },
    cloneTrainingStart(state) {
      state.cloneTrainingStatus.loading = true;
      state.cloneTrainingStatus.error = null;
      state.cloneTraining = null;
    },
    cloneTrainingStartFailure(state, action) {
      state.cloneTrainingStatus.loading = false;
      state.cloneTrainingStatus.error = action.payload;
      state.cloneTraining = null;
    },
    cloneTrainingStartSuccess(state, action) {
      state.cloneTrainingStatus.loading = false;
      state.cloneTrainingStatus.error = null;
      state.cloneTraining = action.payload;
    },
    sendTrainingStart(state) {
      state.sendTrainingStatus.loading = true;
      state.sendTrainingStatus.error = null;
      state.sendTrainingSuccess = null;
    },
    sendTrainingFailure(state, action) {
      state.sendTrainingStatus.loading = false;
      state.sendTrainingStatus.error = action.payload;
      state.sendTrainingSuccess = null;
    },
    sendTrainingSuccess(state, action) {
      state.sendTrainingSuccess = action.payload;

      state.sendTrainingStatus.loading = false;
      state.sendTrainingStatus.error = null;
    },
    deleteTrainingStart(state) {
      state.deleteTraining = null;
      state.deleteTrainingStatus.error = null;
      state.deleteTrainingStatus.loading = true;
    },
    deleteTrainingFailure(state, action) {
      state.deleteTrainingStatus.loading = false;
      state.deleteTrainingStatus.error = action.payload;
      state.deleteTraining = null;
    },
    deleteTrainingSuccess(state, action) {
      const deleteTraining = action.payload;
      state.deleteTraining = deleteTraining;

      state.deleteTrainingStatus.loading = false;
      state.deleteTrainingStatus.error = null;
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

export function listTrainings(programId) {
  return async (dispatch) => {
    dispatch(slice.actions.getTrainingsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.training.trainings}/${programId}`);
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
      const response = await axios.get(`${API_ENDPOINTS.training.details}/${trainingId}`);
      dispatch(slice.actions.getTrainingSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.getTrainingFailure(error));
    }
  };
}

// export function createTraining(trainingData) {
//   return async (dispatch) => {
//     try {
//       dispatch(slice.actions.createTrainingStart());
//       const data = { ...trainingData };
//       const response = await axios.post(API_ENDPOINTS.training.create, data);
//       dispatch(slice.actions.createTrainingSuccess(response.data));
//     } catch (error) {
//       dispatch(slice.actions.createTrainingFailure(error));
//       console.error(error);
//     }
//   };
// }

let cancelTokenSource = null;

export function createTraining(trainingData) {
  return async (dispatch) => {
    // Cancelar a requisição anterior, se existir
    if (cancelTokenSource) {
      cancelTokenSource.cancel('Nova requisição iniciada, cancelando a anterior.');
    }

    // Criar um novo CancelToken
    cancelTokenSource = axios.CancelToken.source();

    try {
      dispatch(slice.actions.createTrainingStart());

      const data = { ...trainingData };
      const response = await axios.post(API_ENDPOINTS.training.create, data, {
        cancelToken: cancelTokenSource.token,
      });

      dispatch(slice.actions.createTrainingSuccess(response.data));
    } catch (error) {
      if (!axios.isCancel(error)) {
        dispatch(slice.actions.createTrainingFailure(error));
        console.error(error);
      }
    } finally {
      // Resetar o CancelToken após a conclusão da requisição
      cancelTokenSource = null;
    }
  };
}

export function updateTraining(trainingUpadate, trainingId) {
  return async (dispatch) => {
    try {
      const dataUpdate = { ...trainingUpadate };
      const response = await axios.put(
        `${API_ENDPOINTS.training.update}/${trainingId}`,
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

export function callCloneTraining(trainingData) {
  return async (dispatch) => {
    dispatch(slice.actions.cloneTrainingStart());
    try {
      const data = { ...trainingData };
      const response = await axios.post(API_ENDPOINTS.training.clonewithmedias, data);
      dispatch(slice.actions.cloneTrainingStartSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.cloneTrainingStartFailure(error));
    }
  };
}

export function callCloneTrainingNew(trainingId, qntCopy) {
  return async (dispatch) => {
    dispatch(slice.actions.cloneTrainingStart());
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.training.clonewithmedias}/${trainingId}?qntCopy=${qntCopy}`,
      );
      dispatch(slice.actions.cloneTrainingStartSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.cloneTrainingStartFailure(error));
    }
  };
}

export function sendTraining(sendPayload) {
  return async (dispatch) => {
    dispatch(slice.actions.sendTrainingStart());
    try {
      const data = { ...sendPayload };
      const response = await axios.post(API_ENDPOINTS.training.sendNew, data);
      dispatch(slice.actions.sendTrainingSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.sendTrainingFailure(error));
    }
  };
}

export function deleteTrainingReq(trainingId) {
  return async (dispatch) => {
    dispatch(slice.actions.deleteTrainingStart());
    try {
      const response = await axios.delete(`${API_ENDPOINTS.training.delete}/${trainingId}`);
      dispatch(slice.actions.deleteTrainingSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.deleteTrainingFailure(error));
    }
  };
}
