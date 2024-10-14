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
  media: null,
  mediaStatus: {
    loading: false,
    error: null,
  },
  deleteMedia: null,
  deleteStatus: {
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

      state.media = null;
      state.mediaStatus.error = null;
      state.mediaStatus.loading = false;

      state.deleteMedia = null;
      state.deleteStatus.error = null;
      state.deleteStatus.loading = false;
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

    getMediaStart(state) {
      state.media = null;
      state.mediaStatus.error = null;
      state.mediaStatus.loading = true;
    },
    getMediaFailure(state, action) {
      state.medias = null;
      state.mediaStatus.error = action.payload;
      state.mediaStatus.loading = false;
    },
    getMediaSuccess(state, action) {
      const media = action.payload;
      state.media = media;

      state.mediaStatus.error = null;
      state.mediaStatus.loading = false;
    },

    deleteStart(state) {
      state.deleteMedia = null;
      state.deleteStatus.error = null;
      state.deleteStatus.loading = true;
    },

    deleteFailure(state, action) {
      state.deleteMedia = null;
      state.deleteStatus.error = action.payload;
      state.deleteStatus.loading = false;
    },
    deleteSuccess(state, action) {
      const deleteMedia = action.payload;
      state.deleteMedia = deleteMedia;

      state.deleteStatus.error = null;
      state.deleteStatus.loading = false;
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

export function getMediasWithStretchTag() {
  return async (dispatch) => {
    dispatch(slice.actions.getAllMediasStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.medias.root}/stretchTag`);
      dispatch(slice.actions.getAllMediasSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getAllMediasFailure(error));
    }
  };
}

export function createMedia(payload, mediaId) {
  return async (dispatch) => {
    dispatch(slice.actions.createMediaStart());
    try {
      const data = { ...payload };
      if (mediaId) {
        const response = await axios.put(`${API_ENDPOINTS.medias.root}/${mediaId}`, data);
        dispatch(slice.actions.createMediaSuccess(response.data));
      } else {
        const response = await axios.post(`${API_ENDPOINTS.medias.root}`, data);
        dispatch(slice.actions.createMediaSuccess(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.createMediaFailure(error));
    }
  };
}

export function getMediaById(id) {
  return async (dispatch) => {
    dispatch(slice.actions.getMediaStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.medias.root}/${id}`);
      dispatch(slice.actions.getMediaSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.getMediaFailure(error));
    }
  };
}

export function deleteMediaById(id) {
  return async (dispatch) => {
    dispatch(slice.actions.deleteStart());
    try {
      const response = await axios.delete(`${API_ENDPOINTS.medias.root}/${id}`);
      dispatch(slice.actions.deleteSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.deleteFailure(error));
    }
  };
}
