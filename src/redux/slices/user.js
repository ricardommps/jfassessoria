import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';
const initialState = {
  changePasswordSuccess: null,
  changePasswordStatus: {
    loading: false,
    error: false,
  },
};

const slice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    changePasswordStart(state) {
      state.changePasswordSuccess = null;
      state.changePasswordStatus.loading = false;
      state.changePasswordStatus.error = false;
    },
    changePasswordFailure(state, action) {
      state.changePasswordSuccess = null;
      state.changePasswordStatus.loading = false;
      state.changePasswordStatus.error = action.payload;
    },
    changePasswordSuccess(state, action) {
      state.changePasswordSuccess = action.payload;
      state.changePasswordStatus.loading = false;
      state.changePasswordStatus.error = false;
    },
  },
});

export default slice.reducer;

export function changePassword(updatePassword) {
  return async (dispatch) => {
    dispatch(slice.actions.changePasswordStart());
    try {
      const data = { ...updatePassword };
      delete data.confirmNewPassword;
      const response = await axios.patch(API_ENDPOINTS.user.changePassword, data);
      dispatch(slice.actions.changePasswordSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.changePasswordFailure(error));
      console.error(error);
    }
  };
}
