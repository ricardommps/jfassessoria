import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';
const initialState = {
  customers: [],
  customersStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  customer: null,
  customerStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  customerCreate: null,
  updateCustomerSuccess: null,
  deleteCustomer: null,
  deleteCustomerStatus: {
    loading: false,
    error: false,
  },
  customersReview: [],
  customersReviewStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  customerError: false,
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
    getCustomerReviewStart(state) {
      state.customerCreate = null;
      state.updateCustomerSuccess = null;
      state.deleteCustomer = null;
      state.deleteCustomerStatus.loading = false;
      state.deleteCustomerStatus.error = false;
      state.customersReview = [];
      state.customersReviewStatus.loading = true;
      state.customersReviewStatus.empty = false;
      state.customersReviewStatus.error = null;
    },
    getCustomerReviewFailure(state, action) {
      const error = action.payload;

      state.customersReviewStatus.error = error;
      state.customersReview = [];
      state.customersReviewStatus.loading = true;
      state.customersReviewStatus.empty = false;
    },
    getCustomerReviewSuccess(state, action) {
      const customersReview = action.payload;

      state.customersReview = customersReview;
      state.customersReviewStatus.loading = false;
      state.customersReviewStatus.empty = false;
      state.customersReviewStatus.error = null;
    },
    getCustomersStart(state) {
      state.customersStatus.loading = true;
      state.customersStatus.empty = false;
      state.customersStatus.error = null;
      state.customers = [];
      state.customerCreate = null;
      state.updateCustomerSuccess = null;
      state.deleteCustomer = null;
      state.deleteCustomerStatus.loading = false;
      state.deleteCustomerStatus.error = false;
    },
    getCustomersFailure(state, action) {
      state.customersStatus.loading = false;
      state.customersStatus.empty = false;
      state.customersStatus.error = action.payload;
      state.customers = [];
    },
    getCustomersSuccess(state, action) {
      const customers = action.payload;
      state.customers = customers;

      state.customersStatus.loading = false;
      state.customersStatus.empty = !customers.length;
      state.customersStatus.error = null;
    },

    createCustomerSuccess(state, action) {
      state.customerCreate = action.payload;
    },

    getCustomerStart(state) {
      state.customerStatus.loading = true;
      state.customerStatus.empty = false;
      state.customerStatus.error = null;
      state.customerCreate = null;
    },
    getCustomerFailure(state, action) {
      state.customerStatus.loading = false;
      state.customerStatus.empty = false;
      state.customerStatus.error = action.payload;
    },
    getCustomerSuccess(state, action) {
      const customer = action.payload;
      state.customer = customer;

      state.customerStatus.loading = false;
      state.customerStatus.empty = !customer.length;
      state.customerStatus.error = null;
    },

    updateCustomerSuccess(state, action) {
      state.updateCustomerSuccess = action.payload;
    },

    clearCustomer(state) {
      state.customer = null;
      state.customerStatus.loading = false;
      state.customerStatus.empty = false;
      state.customerStatus.error = null;
      state.customerCreate = null;
      state.updateCustomer = null;
      state.changePasswordSuccess = null;
      state.changePasswordStatus.loading = false;
      state.changePasswordStatus.error = null;
    },
    deleteCustomerStart(state) {
      state.deleteCustomer = null;
      state.deleteCustomerStatus.error = null;
      state.deleteCustomerStatus.loading = true;
    },
    deleteCustomerFailure(state, action) {
      state.deleteCustomerStatus.loading = false;
      state.deleteCustomerStatus.error = action.payload;
      state.deleteCustomer = null;
    },
    deleteCustomerSuccess(state, action) {
      const deleteCustomer = action.payload;
      state.deleteCustomer = deleteCustomer;

      state.deleteCustomerStatus.loading = false;
      state.deleteCustomerStatus.error = null;
    },
    customerError(state) {
      state.updateCustomerSuccess = null;
      state.customerError = true;
    },
    changePasswordStart(state) {
      state.changePasswordSuccess = null;
      state.changePasswordStatus.loading = false;
      state.changePasswordStatus.error = false;
    },
    changePasswordFailure(state, action) {
      state.changePasswordSuccess = null;
      state.changePasswordStatus.loading = false;
      state.changePasswordStatus.error = action.payload;
      state.customer = null;
      state.customerStatus.loading = false;
      state.customerStatus.empty = false;
      state.customerStatus.error = null;
      state.customerCreate = null;
      state.updateCustomer = null;
    },
    changePasswordSuccess(state, action) {
      state.changePasswordSuccess = action.payload;
      state.changePasswordStatus.loading = false;
      state.changePasswordStatus.error = false;
      state.customer = null;
      state.customerStatus.loading = false;
      state.customerStatus.empty = false;
      state.customerStatus.error = null;
      state.customerCreate = null;
      state.updateCustomer = null;
    },
  },
});

export default slice.reducer;

export function getCustomersReview() {
  return async (dispatch) => {
    dispatch(slice.actions.getCustomerReviewStart());
    try {
      const response = await axios.get(API_ENDPOINTS.customerAll);
      dispatch(slice.actions.getCustomerReviewSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getCustomerReviewFailure(error));
    }
  };
}

export function getCustomers() {
  return async (dispatch) => {
    dispatch(slice.actions.getCustomersStart());
    try {
      const response = await axios.get(API_ENDPOINTS.customer);
      dispatch(slice.actions.getCustomersSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getCustomersFailure(error));
    }
  };
}

export function getCustomerById(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getCustomerStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.customer}/${customerId}`);
      dispatch(slice.actions.getCustomerSuccess(response.data));
    } catch (error) {
      console.error(error);
      dispatch(slice.actions.getCustomerFailure(error));
    }
  };
}

export function createCustomer(customerData) {
  return async (dispatch) => {
    try {
      const data = { ...customerData };
      const response = await axios.post(API_ENDPOINTS.customer, data);
      dispatch(slice.actions.createCustomerSuccess(response.data));
    } catch (error) {
      console.error(error);
    }
  };
}

export function updateCustomer(customerUpadate, customerId) {
  return async (dispatch) => {
    try {
      const dataUpdate = { ...customerUpadate };
      const response = await axios.put(`${API_ENDPOINTS.customer}/${customerId}`, dataUpdate);
      dispatch(slice.actions.updateCustomerSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.customerError());
      console.error(error);
    }
  };
}

export function clearCustomer() {
  return async (dispatch) => {
    dispatch(slice.actions.clearCustomer());
  };
}

export function deleteCustomerReq(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.deleteCustomerStart());
    try {
      const response = await axios.delete(`${API_ENDPOINTS.customer}/${customerId}`);
      dispatch(slice.actions.deleteCustomerSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.deleteCustomerFailure(error));
    }
  };
}

export function changePassword(updatePassword, customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.changePasswordStart());
    try {
      const data = { ...updatePassword };
      delete data.confirmNewPassword;
      const response = await axios.patch(`${API_ENDPOINTS.changePassword}/${customerId}`, data);
      dispatch(slice.actions.changePasswordSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.changePasswordFailure(error));
      console.error(error);
    }
  };
}
