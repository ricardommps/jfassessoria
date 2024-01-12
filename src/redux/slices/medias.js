import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';
const initialState = {
  medias: [],
  mediasStatus: {
    loading: false,
    empty: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'medias',
  initialState,
  reducers: {
    getAllMediasStart(state) {
      state.medias = [];
      state.mediasStatus.error = null;
      state.mediasStatus.loading = true;
      state.mediasStatus.empty = false;
    },
    getAllMediasFailure(state, action) {
      state.medias = [];
      state.mediasStatus.error = action.payload;
      state.mediasStatus.loading = false;
      state.mediasStatus.empty = false;
    },
    getAllMediasSuccess(state, action) {
      const medias = action.payload;
      state.medias = medias;

      state.mediasStatus.error = null;
      state.mediasStatus.loading = false;
      state.mediasStatus.empty = !medias.length || medias.length === 0;
    },
  },
});

export default slice.reducer;

export function getListMedias() {
  return async (dispatch) => {
    dispatch(slice.actions.getAllMediasStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.medias.root}`);
      dispatch(slice.actions.getAllMediasSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getAllMediasFailure(error));
    }
  };
}
