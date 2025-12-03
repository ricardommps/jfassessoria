import { createSlice } from '@reduxjs/toolkit';
import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

const initialState = {
  trimp: [],
  trimpStatus: {
    loading: false,
    error: null,
    empty: false,
  },
};

const slice = createSlice({
  name: 'trimp',
  initialState,
  reducers: {
    getTrimpStart(state) {
      state.trimp = null;
      state.trimpStatus.loading = true;
      state.trimpStatus.error = null;
      state.trimpStatus.empty = false;
    },
    getTrimpFailure(state, action) {
      state.trimp = null;
      state.trimpStatus.loading = false;
      state.trimpStatus.error = action.payload;
      state.trimpStatus.empty = false;
    },
    getTrimpSuccess(state, action) {
      state.trimp = action.payload;
      state.trimpStatus.loading = false;
      state.trimpStatus.error = false;
      state.trimpStatus.empty = false;
    },
    clearTrimp(state) {
      state.trimp = [];
      state.trimpStatus.loading = false;
      state.trimpStatus.error = null;
      state.trimpStatus.empty = false;
    },
  },
});

export default slice.reducer;

export function getTrimp(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getTrimpStart());
    try {
      const response = await jfApi.get(`${JF_APP_ENDPOINTS.finished}/getTrimpAdmin/${customerId}`);
      dispatch(slice.actions.getTrimpSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.clearTrimp(error));
    }
  };
}

export function clearTrimp() {
  return async (dispatch) => {
    dispatch(slice.actions.clearTrimp());
  };
}
