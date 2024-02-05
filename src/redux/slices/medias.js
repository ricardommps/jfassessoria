import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';
const initialState = {
  medias: [],
  mediasStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  mediaCreate: null,
  mediaCreateStatus: {
    loading: false,
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
      state.mediaCreate = null;
      state.mediaCreateStatus.loading = false;
      state.mediaCreateStatus.error = null;
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

    createMediaStart(state) {
      state.mediaCreate = null;
      state.mediaCreateStatus.loading = true;
      state.mediaCreateStatus.error = null;
    },
    createMediaFailure(state, action) {
      const error = action.payload;

      state.mediaCreate = null;
      state.mediaCreateStatus.loading = false;
      state.mediaCreateStatus.error = error;
    },
    createMediaSuccess(state, action) {
      const mediaCreate = action.payload;

      state.mediaCreate = mediaCreate;
      state.mediaCreateStatus.loading = false;
      state.mediaCreateStatus.error = null;
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

export function createMedia(payload) {
  return async (dispatch) => {
    dispatch(slice.actions.createMediaStart());
    try {
      const data = { ...payload };
      const response = await axios.post(`${API_ENDPOINTS.medias.root}`, data);
      dispatch(slice.actions.createMediaSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.createMediaFailure(error));
    }
  };
}
