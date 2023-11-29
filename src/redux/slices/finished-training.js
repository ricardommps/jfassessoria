import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const initialState = {
  listByReview: [],
  listByReviewStatus: {
    loading: false,
    empty: true,
    error: null,
  },
  trainingReview: null,
  trainingReviewStatus: {
    loading: false,
    error: null,
  },
  updateFinishedTraining: null,
  updateFinishedTrainingStatus: {
    loading: false,
    error: null,
  },
  allDone: [],
  allDoneStatus: {
    loading: false,
    empty: true,
    error: null,
  },
};

const slice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    getListAllDoneStart(state) {
      state.listByReview = [];
      state.allDone = [];
      state.allDoneStatus.loading = true;
      state.allDoneStatus.empty = false;
      state.allDoneStatus.error = null;
      state.trainingReview = null;
      state.trainingReviewStatus.loading = false;
      state.trainingReviewStatus.error = null;
    },
    getListAllDoneFailure(state, action) {
      const error = action.payload;
      state.allDoneStatus.error = error;

      state.allDone = [];
      state.allDoneStatus.loading = false;
      state.allDoneStatus.empty = false;
    },
    getListAllDoneSuccess(state, action) {
      const allDone = action.payload;
      state.allDone = allDone;

      state.allDoneStatus.loading = false;
      state.allDoneStatus.empty = !allDone.length || allDone.length === 0;
      state.allDoneStatus.error = null;
    },
    getListByReviewStart(state) {
      state.allDone = [];
      state.listByReview = [];
      state.listByReviewStatus.loading = true;
      state.listByReviewStatus.empty = false;
      state.listByReviewStatus.error = null;
      state.trainingReview = null;
      state.trainingReviewStatus.loading = false;
      state.trainingReviewStatus.error = null;
      state.updateFinishedTraining = null;
      state.updateFinishedTrainingStatus.loading = false;
      state.updateFinishedTrainingStatus.error = null;
    },
    getListByReviewFailure(state, action) {
      const error = action.payload;

      state.listByReviewStatus.error = error;

      state.listByReview = [];
      state.listByReviewStatus.loading = true;
      state.listByReviewStatus.empty = false;
    },
    getListByReviewSuccess(state, action) {
      const listByReview = action.payload;
      state.listByReview = listByReview;

      state.listByReviewStatus.loading = false;
      state.listByReviewStatus.empty = !listByReview.length || listByReview.length === 0;
      state.listByReviewStatus.error = null;
    },
    getTrainingReviewStart(state) {
      state.trainingReview = null;
      state.trainingReviewStatus.loading = true;
      state.trainingReviewStatus.error = null;
      state.updateFinishedTraining = null;
      state.updateFinishedTrainingStatus.loading = false;
      state.updateFinishedTrainingStatus.error = null;
    },
    getTrainingReviewFailure(state, action) {
      const error = action.payload;
      state.trainingReviewStatus.error = error;

      state.trainingReview = null;
      state.trainingReviewStatus.loading = false;
    },
    getTrainingReviewSuccess(state, action) {
      const trainingReview = action.payload;
      state.trainingReview = trainingReview;

      state.trainingReviewStatus.loading = false;
      state.trainingReviewStatus.error = null;
    },
    updateFinishedTrainingStart(state) {
      state.updateFinishedTraining = null;
      state.updateFinishedTrainingStatus.loading = true;
      state.updateFinishedTrainingStatus.error = null;
    },
    updateFinishedTrainingFailure(state, action) {
      const error = action.payload;
      state.updateFinishedTrainingStatus.error = error;

      state.updateFinishedTraining = null;
      state.updateFinishedTrainingStatus.loading = false;
    },
    updateFinishedTrainingSuccess(state, action) {
      const updateFinishedTraining = action.payload;
      state.updateFinishedTraining = updateFinishedTraining;

      state.updateFinishedTrainingStatus.loading = false;
      state.updateFinishedTrainingStatus.error = null;
    },
    clearTrainingReview(state) {
      state.trainingReview = null;
      state.trainingReviewStatus.loading = false;
      state.trainingReviewStatus.error = null;
    },
  },
});

export default slice.reducer;

export function getListAllDone(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getListAllDoneStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.finishedtraining.allDone}/${customerId}`);
      dispatch(slice.actions.getListAllDoneSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getListAllDoneFailure(error));
    }
  };
}

export function getListByReview(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getListByReviewStart());
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.finishedtraining.listByReview}/${customerId}`,
      );
      dispatch(slice.actions.getListByReviewSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getListByReviewFailure(error));
    }
  };
}

export function getTrainingReview(id) {
  return async (dispatch) => {
    dispatch(slice.actions.getTrainingReviewStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.finishedtraining.trainingReview}/${id}`);
      dispatch(slice.actions.getTrainingReviewSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getTrainingReviewFailure(error));
    }
  };
}

export function updateFinishedTrainingReq(finishedUpadate) {
  return async (dispatch) => {
    dispatch(slice.actions.updateFinishedTrainingStart());
    try {
      const dataUpdate = { ...finishedUpadate };
      const response = await axios.put(`${API_ENDPOINTS.finishedtraining.update}`, dataUpdate);
      dispatch(slice.actions.updateFinishedTrainingSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.updateFinishedTrainingFailure(error));
    }
  };
}

export function clearTrainingReview() {
  return async (dispatch) => {
    dispatch(slice.actions.clearTrainingReview());
  };
}
