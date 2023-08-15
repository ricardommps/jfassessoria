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
};

const slice = createSlice({
  name: 'customer',
  initialState,
  reducers: {
    getCustomersStart(state) {
      state.customersStatus.loading = true;
      state.customersStatus.empty = false;
      state.customersStatus.error = null;
      state.customerCreate = null;
      state.updateCustomerSuccess = null;
    },
    getCustomersFailure(state, action) {
      state.customersStatus.loading = false;
      state.customersStatus.empty = false;
      state.customersStatus.error = action.payload;
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
    },
  },
});

export default slice.reducer;

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
      console.error(error);
    }
  };
}

export function clearCustomer() {
  return async (dispatch) => {
    dispatch(slice.actions.clearCustomer());
  };
}
