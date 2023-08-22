import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';
const initialState = {
  payments: [],
  paymentsStatus: {
    loading: false,
    empty: true,
  },
  paymentCreated: false,
  paymentCreatedStatus: {
    loading: false,
  },
  updatePaymentSuccess: null,
  deletePaymentSuccess: null,
  paymentError: false,
};

const slice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    getPaymentsStart(state) {
      state.paymentsStatus.loading = true;
      state.paymentsStatus.empty = false;
      state.paymentError = false;
      state.payments = [];
      state.paymentCreated = false;
      state.paymentCreatedStatus.loading = false;
      state.updatePaymentSuccess = false;
      state.deletePaymentSuccess = false;
    },
    getPaymentsFailure(state) {
      state.paymentsStatus.loading = false;
      state.paymentsStatus.empty = false;
      state.paymentError = true;
      state.payments = [];
    },
    getPaymentsSuccess(state, action) {
      const payments = action.payload;
      state.payments = payments;

      state.paymentsStatus.loading = false;
      state.paymentsStatus.empty = !payments.length;
      state.paymentError = false;
    },
    paymentCreatedStart(state) {
      state.paymentCreated = false;
      state.paymentCreatedStatus.loading = true;
      state.paymentError = false;
    },
    paymentCreatedFailure(state) {
      state.paymentCreated = false;
      state.paymentCreatedStatus.loading = false;
      state.paymentError = true;
    },
    paymentCreatedSuccess(state) {
      state.paymentCreated = true;
      state.paymentCreatedStatus.loading = false;
      state.paymentError = false;
    },
    updatePaymentStart(state) {
      state.updatePaymentSuccess = false;
      state.paymentError = false;
    },
    updatePaymentSuccess(state) {
      state.updatePaymentSuccess = true;
      state.paymentError = false;
    },
    updatePaymentFailure(state) {
      state.updatePaymentSuccess = false;
      state.paymentError = true;
    },
    deletePaymentStart(state) {
      state.deletePaymentSuccess = false;
      state.paymentError = false;
    },
    deletePaymentFailure(state) {
      state.paymentError = true;
      state.deletePaymentSuccess = false;
    },
    deletePaymentSuccess(state) {
      state.deletePaymentSuccess = true;
      state.paymentError = false;
    },
  },
});

export default slice.reducer;

export function getPayments(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getPaymentsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.payment.list}/${customerId}`);
      dispatch(slice.actions.getPaymentsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getPaymentsFailure(error));
    }
  };
}

export function paymentCreatedReq(payment) {
  return async (dispatch) => {
    dispatch(slice.actions.paymentCreatedStart());
    try {
      const data = { ...payment };
      const response = await axios.post(API_ENDPOINTS.payment.created, data);
      dispatch(slice.actions.paymentCreatedSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.paymentCreatedFailure(error));
    }
  };
}

export function updatePayment(paymentUpadate, paymentId) {
  return async (dispatch) => {
    dispatch(slice.actions.updatePaymentStart());
    try {
      const dataUpdate = { ...paymentUpadate };
      const response = await axios.put(`${API_ENDPOINTS.payment.created}/${paymentId}`, dataUpdate);
      dispatch(slice.actions.updatePaymentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.updatePaymentFailure());
      console.error(error);
    }
  };
}

export function deletePayment(paymentId) {
  return async (dispatch) => {
    dispatch(slice.actions.deletePaymentStart());
    try {
      const response = await axios.delete(`${API_ENDPOINTS.payment.delete}/${paymentId}`);
      dispatch(slice.actions.deletePaymentSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.deletePaymentFailure(error));
    }
  };
}
