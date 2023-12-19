import { useCallback } from 'react';
import {
  clearMetrics,
  createChartReq,
  deleteMetricReq,
  getFindMetric,
  getFindMetrics,
  getListPerformanceMetrics,
  getListPhysiologicalMetrics,
  updateChartReq,
} from 'src/redux/slices/metrics';
import { useDispatch, useSelector } from 'src/redux/store';
export default function useMetrics() {
  const dispatch = useDispatch();
  const {
    metrics,
    metricsStatus,
    metricsCreated,
    metricsCreatedStatus,
    createChart,
    createChartStatus,
    metric,
    metricStatus,
    deleteMetric,
    deleteMetricStatus,
  } = useSelector((state) => state.metrics);

  const onGetListPerformanceMetrics = useCallback(
    (id, startDate, endDate, module) => {
      dispatch(getListPerformanceMetrics(id, startDate, endDate, module));
    },
    [dispatch],
  );

  const onGetListPhysiologicalMetrics = useCallback(
    (id, startDate, endDate, module) => {
      dispatch(getListPhysiologicalMetrics(id, startDate, endDate));
    },
    [dispatch],
  );

  const onFindMetrics = useCallback(
    (id) => {
      dispatch(getFindMetrics(id));
    },
    [dispatch],
  );

  const onFindMetric = useCallback(
    (id) => {
      dispatch(getFindMetric(id));
    },
    [dispatch],
  );

  const onCreateChart = useCallback(
    (payload) => {
      dispatch(createChartReq(payload));
    },
    [dispatch],
  );

  const onUpdateChart = useCallback(
    (payload, id) => {
      dispatch(updateChartReq(payload, id));
    },
    [dispatch],
  );

  const onClearMetrics = useCallback(() => {
    dispatch(clearMetrics());
  }, [dispatch]);

  const onDeletemetric = useCallback(
    (id) => {
      dispatch(deleteMetricReq(id));
    },
    [dispatch],
  );

  return {
    metrics,
    metricsStatus,
    onGetListPerformanceMetrics,
    onClearMetrics,
    onFindMetrics,
    onCreateChart,
    metricsCreated,
    metricsCreatedStatus,
    createChart,
    createChartStatus,
    onGetListPhysiologicalMetrics,
    metric,
    metricStatus,
    deleteMetric,
    deleteMetricStatus,
    onFindMetric,
    onUpdateChart,
    onDeletemetric,
  };
}
