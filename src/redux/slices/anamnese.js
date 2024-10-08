import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const initialState = {
  anamnese: null,
  anamneseStatus: {
    loading: false,
    error: null,
    empty: false,
  },
};

const slice = createSlice({
  name: 'anamnese',
  initialState,
  reducers: {
    getAnamneseStart(state) {
      state.anamnese = null;
      state.anamneseStatus.loading = true;
      state.anamneseStatus.error = null;
      state.anamneseStatus.empty = false;
    },
    getAnamneseFailure(state, action) {
      state.anamnese = null;
      state.anamneseStatus.loading = false;
      state.anamneseStatus.error = action.payload;
      state.anamneseStatus.empty = false;
    },
    getAnamneseSuccess(state, action) {
      const anamnese = action.payload;

      state.anamnese = anamnese;
      state.anamneseStatus.loading = false;
      state.anamneseStatus.error = null;
      state.anamneseStatus.empty = !anamnese.length;
    },
    clearAnamnese(state) {
      state.anamnese = null;
      state.anamneseStatus.loading = false;
      state.anamneseStatus.error = null;
      state.anamneseStatus.empty = false;
    },
  },
});

export default slice.reducer;

export function getAnamnese(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getAnamneseStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.anamnese.byCustomer}/${customerId}`);
      if (response.data.read === false && response.data.id) {
        await axios.put(`${API_ENDPOINTS.anamnese.byCustomer}/${response.data.id}`);
      }
      dispatch(slice.actions.getAnamneseSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getAnamneseFailure(error));
    }
  };
}

export function clearAnamnese() {
  return async (dispatch) => {
    dispatch(slice.actions.clearAnamnese());
  };
}
