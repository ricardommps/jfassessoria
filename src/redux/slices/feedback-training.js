import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';
const initialState = {
  feedbackSave: null,
  feedbackSaveStatus: {
    loading: false,
    error: null,
  },
  feedbackUpdate: null,
  feedbackUpdateStatus: {
    loading: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'feedbackTraining',
  initialState,
  reducers: {
    feedbackSaveStart(state) {
      state.feedbackSave = null;
      state.feedbackSaveStatus.loading = true;
      state.feedbackSaveStatus.error = null;
    },
    feedbackSaveFailure(state, action) {
      const error = action.payload;
      state.feedbackSaveStatus.error = error;

      state.feedbackSave = null;
      state.feedbackSaveStatus.loading = false;
    },
    feedbackSaveSuccess(state, action) {
      const feedbackSave = action.payload;
      state.feedbackSave = feedbackSave;

      state.feedbackSaveStatus.loading = false;
      state.feedbackSaveStatus.error = null;
    },
    feedbackUpdateStart(state) {
      state.feedbackUpdate = null;
      state.feedbackUpdateStatus.loading = true;
      state.feedbackUpdateStatus.error = null;
    },
    feedbackUpdateFailure(state, action) {
      const error = action.payload;
      state.feedbackUpdateStatus.error = error;

      state.feedbackUpdate = null;
      state.feedbackUpdateStatus.loading = false;
    },
    feedbackUpdateSuccess(state, action) {
      const feedbackUpdate = action.payload;
      state.feedbackUpdate = feedbackUpdate;

      state.feedbackUpdateStatus.loading = false;
      state.feedbackUpdateStatus.error = null;
    },
    clearFeedback(state) {
      state.feedbackSave = null;
      state.feedbackSaveStatus.loading = false;
      state.feedbackSaveStatus.error = null;
      state.feedbackUpdate = null;
      state.feedbackUpdateStatus.loading = false;
      state.feedbackUpdateStatus.error = null;
    },
  },
});

export default slice.reducer;

export function feedbackSaveReq(saveData) {
  return async (dispatch) => {
    dispatch(slice.actions.feedbackSaveStart());
    try {
      const data = { ...saveData };
      const response = await axios.post(API_ENDPOINTS.feedbacktraining.save, data);
      dispatch(slice.actions.feedbackSaveSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.feedbackSaveFailure(error));
    }
  };
}

export function feedbackUpdateReq(updateData) {
  return async (dispatch) => {
    dispatch(slice.actions.feedbackUpdateStart());
    try {
      const data = { ...updateData };
      const response = await axios.put(API_ENDPOINTS.feedbacktraining.save, data);
      dispatch(slice.actions.feedbackUpdateSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.feedbackUpdateFailure(error));
    }
  };
}

export function clearFeedback() {
  return async (dispatch) => {
    dispatch(slice.actions.clearFeedback());
  };
}
