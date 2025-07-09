import { createSlice } from '@reduxjs/toolkit';
import { API_ENDPOINTS, jfAppApi } from 'src/utils/axios';

const initialState = {
  invoices: [],
  invoicesStatus: {
    loading: false,
    error: null,
    empty: false,
  },
  invoiceAction: null,
  invoiceActionStatus: {
    loading: false,
    error: null,
    empty: false,
  },
};

const slice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    getInvoicesStart(state) {
      state.invoiceAction = null;
      state.invoiceActionStatus.loading = false;
      state.invoiceActionStatus.error = null;
      state.invoiceActionStatus.empty = false;

      state.invoices = [];
      state.invoicesStatus.loading = true;
      state.invoicesStatus.error = null;
      state.invoicesStatus.empty = false;
    },
    getInvoicesFailure(state, action) {
      state.invoices = [];
      state.invoicesStatus.loading = false;
      state.invoicesStatus.error = action.payload;
      state.invoicesStatus.empty = false;
    },
    getInvoicesSuccess(state, action) {
      const invoices = action.payload;

      state.invoices = invoices;
      state.invoicesStatus.loading = false;
      state.invoicesStatus.error = false;
      state.invoicesStatus.empty = !invoices.length || invoices.length === 0;
    },

    createAndEditStart(state) {
      state.invoiceAction = null;
      state.invoiceActionStatus.loading = true;
      state.invoiceActionStatus.error = null;
      state.invoiceActionStatus.empty = false;
    },
    createAndEditFailure(state, action) {
      state.invoiceAction = null;
      state.invoiceActionStatus.loading = false;
      state.invoiceActionStatus.error = action.payload;
      state.invoiceActionStatus.empty = false;
    },
    createAndEditSuccess(state, action) {
      state.invoiceAction = action.payload;
      state.invoiceActionStatus.loading = false;
      state.invoiceActionStatus.error = null;
      state.invoiceActionStatus.empty = false;
    },

    deleteInvoiceStart(state) {
      state.invoiceAction = null;
      state.invoiceActionStatus.loading = true;
      state.invoiceActionStatus.error = null;
      state.invoiceActionStatus.empty = false;
    },
    deleteInvoiceFailure(state, action) {
      state.invoiceAction = null;
      state.invoiceActionStatus.loading = false;
      state.invoiceActionStatus.error = action.payload;
      state.invoiceActionStatus.empty = false;
    },
    deleteInvoicenSuccess(state, action) {
      state.invoiceAction = action.payload;
      state.invoiceActionStatus.loading = false;
      state.invoiceActionStatus.error = null;
      state.invoiceActionStatus.empty = false;
    },
  },
});
export default slice.reducer;
export function getInvoicesReq(customerId) {
  return async (dispatch) => {
    dispatch(slice.actions.getInvoicesStart());
    try {
      const response = await jfAppApi.get(`${API_ENDPOINTS.invoice.all}/${customerId}`);
      dispatch(slice.actions.getInvoicesSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getInvoicesFailure(error));
    }
  };
}

export function createAndEditReq(payload, invoiceId) {
  return async (dispatch) => {
    dispatch(slice.actions.createAndEditStart());
    const invoicePayload = Object.assign({}, payload);
    delete invoicePayload.id;
    try {
      if (invoiceId) {
        const response = await jfAppApi.put(
          `${API_ENDPOINTS.invoice.root}/${invoiceId}`,
          invoicePayload,
        );
        dispatch(slice.actions.createAndEditSuccess(response.data));
      } else {
        const response = await jfAppApi.post(`${API_ENDPOINTS.invoice.root}`, invoicePayload);
        dispatch(slice.actions.createAndEditSuccess(response.data));
      }
    } catch (error) {
      dispatch(slice.actions.createAndEditFailure(error));
      const errorMessage = 'Erro ao salvar os dados';
      throw new Error(errorMessage);
    }
  };
}

export function deleteInvoiceReq(invoiceId) {
  return async (dispatch) => {
    dispatch(slice.actions.deleteInvoiceStart());
    try {
      const response = await jfAppApi.delete(`${API_ENDPOINTS.invoice.root}/${invoiceId}`);
      dispatch(slice.actions.deleteInvoicenSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.deleteInvoiceFailure(error));
      throw new Error(error);
    }
  };
}
