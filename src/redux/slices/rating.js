import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';

const initialState = {
  ratings: [],
  ratingsStatus: {
    loading: false,
    error: null,
    empty: false,
  },
};

const slice = createSlice({
  name: 'rating',
  initialState,
  reducers: {
    ratingsStart(state) {
      state.ratings = null;
      state.ratingsStatus.loading = true;
      state.ratingsStatus.error = null;
      state.ratingsStatus.empty = false;
    },
    ratingsFailure(state, action) {
      state.ratings = null;
      state.ratingsStatus.loading = false;
      state.ratingsStatus.error = action.payload;
      state.ratingsStatus.empty = false;
    },
    ratingsSuccess(state, action) {
      const ratings = action.payload;

      state.ratings = ratings;
      state.ratingsStatus.loading = false;
      state.ratingsStatus.error = null;
      state.ratingsStatus.empty = !ratings.length;
    },
  },
});

export default slice.reducer;

export function getRatings() {
  return async (dispatch) => {
    dispatch(slice.actions.ratingsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.rating.root}`);
      dispatch(slice.actions.ratingsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.ratingsFailure(error));
    }
  };
}
