import { createSlice } from '@reduxjs/toolkit';
import { API_ENDPOINTS, jfAppApi } from 'src/utils/axios';

const initialState = {
  volume: [],
  valumeStatus: {
    loading: false,
    error: null,
    empty: false,
  },
};

const slice = createSlice({
  name: 'finished',
  initialState,
  reducers: {
    getVolumeStart(state) {
      state.volume = null;
      state.valumeStatus.loading = true;
      state.valumeStatus.error = null;
      state.valumeStatus.empty = false;
    },
    getVolumeFailure(state, action) {
      state.volume = null;
      state.valumeStatus.loading = false;
      state.valumeStatus.error = action.payload;
      state.valumeStatus.empty = false;
    },
    getVolumeSuccess(state, action) {
      state.volume = action.payload;
      state.valumeStatus.loading = false;
      state.valumeStatus.error = false;
      state.valumeStatus.empty = false;
    },
    clearVolume(state) {
      state.volume = [];
      state.valumeStatus.loading = false;
      state.valumeStatus.error = null;
      state.valumeStatus.empty = false;
    },
  },
});

export default slice.reducer;

export function getVolume(customerId, programId, startDate, endDate) {
  return async (dispatch) => {
    dispatch(slice.actions.getVolumeStart());
    try {
      const response = await jfAppApi.get(
        `${API_ENDPOINTS.finished.volume}/${customerId}?programId=${programId}&startDate=${startDate}&endDate=${endDate}`,
      );
      dispatch(slice.actions.getVolumeSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getVolumeFailure(error));
    }
  };
}

export function clearVolume() {
  return async (dispatch) => {
    dispatch(slice.actions.clearVolume());
  };
}
