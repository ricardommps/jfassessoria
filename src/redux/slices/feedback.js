import { createSlice } from '@reduxjs/toolkit';
import { API_ENDPOINTS, jfAppApi } from 'src/utils/axios';

const initialState = {
  unreviewedFinished: [],
  unreviewedFinishedStatus: {
    loading: false,
    empty: true,
    error: null,
  },
};

const slice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    getUnreviewedFinishedStart(state) {
      state.unreviewedFinished = [];
      state.unreviewedFinishedStatus.loading = true;
      state.unreviewedFinishedStatus.empty = false;
      state.unreviewedFinishedStatus.error = null;
    },
    getUnreviewedFinishedFailure(state, action) {
      const error = action.payload;
      state.unreviewedFinishedStatus.error = error;

      state.unreviewedFinished = [];
      state.unreviewedFinishedStatus.loading = false;
      state.unreviewedFinishedStatus.empty = false;
    },
    getUnreviewedFinishedSuccess(state, action) {
      const unreviewedFinished = action.payload;
      state.unreviewedFinished = unreviewedFinished;

      state.unreviewedFinishedStatus.loading = false;
      state.unreviewedFinishedStatus.empty =
        !unreviewedFinished.length || unreviewedFinished.length === 0;
      state.unreviewedFinishedStatus.error = null;
    },
  },
});

export default slice.reducer;

export function getUnreviewedFinished() {
  return async (dispatch) => {
    dispatch(slice.actions.getUnreviewedFinishedStart());
    try {
      const response = await jfAppApi.get(API_ENDPOINTS.finished.unreviewedFinished);
      dispatch(slice.actions.getUnreviewedFinishedSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getUnreviewedFinishedFailure(error));
    }
  };
}
