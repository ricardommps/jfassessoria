import { createSlice } from '@reduxjs/toolkit';
import axios, { API_ENDPOINTS } from 'src/utils/axios';
const initialState = {
  metrics: [],
  metricsStatus: {
    loading: false,
    empty: false,
    error: null,
  },
  createChart: null,
  createChartStatus: {
    loading: false,
    error: null,
  },
  metricsCreated: [],
  metricsCreatedStatus: {
    loading: false,
    empty: false,
    error: null,
  },
};

const slice = createSlice({
  name: 'metrics',
  initialState,
  reducers: {
    getPerformanceMetricsStart(state) {
      state.metrics = null;
      state.metricsStatus.loading = true;
      state.metricsStatus.empty = false;
      state.metricsStatus.error = null;
    },
    getPerformanceMetricsFailure(state, action) {
      const error = action.payload;
      state.metricsStatus.error = error;

      state.metrics = null;
      state.metricsStatus.loading = false;
      state.metricsStatus.empty = false;
    },
    getPerformanceMetricsSuccess(state, action) {
      const metrics = action.payload;
      state.metrics = metrics;

      state.metricsStatus.loading = false;
      state.metricsStatus.empty = !metrics.length || metrics.length === 0;
      state.metricsStatus.error = null;
    },
    getFindMetricsStart(state) {
      state.metricsCreated = null;
      state.metricsCreatedStatus.loading = true;
      state.metricsCreatedStatus.empty = false;
      state.metricsCreatedStatus.error = null;
    },
    getFindMetricsFailure(state, action) {
      const error = action.payload;
      state.metricsCreatedStatus.error = error;

      state.metricsCreated = null;
      state.metricsCreatedStatus.loading = false;
      state.metricsCreatedStatus.empty = false;
    },
    getFindMetricsSuccess(state, action) {
      const metricsCreated = action.payload;
      state.metricsCreated = metricsCreated;

      state.metricsCreatedStatus.loading = false;
      state.metricsCreatedStatus.empty = !metricsCreated.length || metricsCreated.length === 0;
      state.metricsCreatedStatus.error = null;
    },
    clearMetrics(state) {
      state.metrics = [];
      state.metricsStatus.loading = false;
      state.metricsStatus.empty = false;
      state.metricsStatus.error = null;
      state.metricsCreated = null;
      state.metricsCreatedStatus.loading = false;
      state.metricsCreatedStatus.empty = false;
      state.metricsCreatedStatus.error = null;
      state.createChart = null;
      state.createChartStatus.error = null;
      state.createChartStatus.loading = false;
    },
    createChartStart(state) {
      state.createChart = null;
      state.createChartStatus.error = null;
      state.createChartStatus.loading = true;
    },
    createChartsFailure(state, action) {
      const error = action.payload;
      state.createChartStatus.error = error;

      state.createChart = null;
      state.createChartStatus.loading = false;
    },
    createChartSuccess(state, action) {
      const createChart = action.payload;
      state.createChart = createChart;

      state.createChartStatus.error = null;
      state.createChartStatus.loading = true;
    },
  },
});

export default slice.reducer;

export function getListPerformanceMetrics(id, startDate, endDate, module) {
  return async (dispatch) => {
    dispatch(slice.actions.getPerformanceMetricsStart());
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.metrics.performance}/${id}/${startDate}/${endDate}/${module}`,
      );
      dispatch(slice.actions.getPerformanceMetricsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getPerformanceMetricsFailure(error));
    }
  };
}

export function getListPhysiologicalMetrics(id, startDate, endDate) {
  return async (dispatch) => {
    dispatch(slice.actions.getPerformanceMetricsStart());
    try {
      const response = await axios.get(
        `${API_ENDPOINTS.metrics.physiological}/${id}/${startDate}/${endDate}`,
      );
      dispatch(slice.actions.getPerformanceMetricsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getPerformanceMetricsFailure(error));
    }
  };
}

export function getFindMetrics(id) {
  return async (dispatch) => {
    dispatch(slice.actions.getFindMetricsStart());
    try {
      const response = await axios.get(`${API_ENDPOINTS.metrics.find}/${id}`);
      dispatch(slice.actions.getFindMetricsSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.getFindMetricsFailure(error));
    }
  };
}

export function createChartReq(payload) {
  return async (dispatch) => {
    dispatch(slice.actions.createChartStart());
    try {
      const data = { ...payload };
      const response = await axios.post(API_ENDPOINTS.metrics.create, data);
      dispatch(slice.actions.createChartSuccess(response.data));
    } catch (error) {
      dispatch(slice.actions.createChartsFailure(error));
    }
  };
}

export function clearMetrics() {
  return async (dispatch) => {
    dispatch(slice.actions.clearMetrics());
  };
}
