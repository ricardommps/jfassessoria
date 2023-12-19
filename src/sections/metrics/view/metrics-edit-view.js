'use client';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import EmptyContent from 'src/components/empty-content/empty-content';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { TableHeadCustom, TableSelectedAction, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import useMetrics from 'src/hooks/use-metrics';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { fDateMetrics } from 'src/utils/format-time';

import ChartView from '../chart-view';
import MetricsTableRow from '../metrics-table-row';
import PHMetricsTableRow from '../ph-metrics-table-row';

const TABLE_HEAD = [
  { id: 'date_published', label: 'Data do treino' },
  { id: 'tf_paces', label: 'Paces' },
  { id: 'media', label: 'Médias Pace' },
];

const TABLE_HEAD_COMPETICAO = [
  { id: 'date_published', label: 'Data da prova' },
  { id: 'distance', label: 'Distância/KM' },
  { id: 'pace', label: 'Pace' },
];

const TABLE_HEAD_PH = [
  { id: 'reference_month', label: 'Mês de referencia' },
  { id: 'name', label: 'Título' },
  { id: 'difficulty_level', label: 'Nível' },
  { id: 'pace', label: 'Pace' },
  { id: 'pace_vla', label: 'Pace-VLA' },
  { id: 'pace_vlan', label: 'Pace-VLAN' },
];

const defaultFilters = {
  startDate: null,
  endDate: null,
};

export default function MetricsEditView() {
  const params = useParams();
  const router = useRouter();
  const table = useTable({ defaultOrderBy: 'updatedAt' });
  const { id } = params;
  const {
    onFindMetric,
    metric,
    metricStatus,
    metrics,
    metricsStatus,
    createChart,
    onGetListPerformanceMetrics,
    onClearMetrics,
    onUpdateChart,
  } = useMetrics();
  const chartView = useBoolean();
  const onConfirm = useBoolean();

  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState(null);
  const [filters, setFilters] = useState(defaultFilters);

  const handleGenerateChart = () => {
    const rowsIten = tableData.filter((row) => table.selected.includes(row.id));
    setSelectedRows(rowsIten);
  };

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  const handleClearFilter = () => {
    setFilters(defaultFilters);
    setSelectedRows(null);
    setTableData(metric[0]?.chartData);
    table.onSelectAllRows(
      true,
      metric[0]?.chartData.map((item) => item.id),
    );
    onClearMetrics();
  };

  const renderTableHead = () => {
    switch (Number(metric[0].type)) {
      case 1:
        return TABLE_HEAD;
      case 2:
        return TABLE_HEAD_COMPETICAO;
      case 3:
        return TABLE_HEAD_PH;
      default:
        return TABLE_HEAD;
    }
  };

  const onFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters],
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters],
  );

  const handleLoadData = () => {
    onGetListPerformanceMetrics(
      metric[0].customerId,
      fDateMetrics(filters.startDate).toString(),
      fDateMetrics(filters.endDate).toString(),
      metric[0]?.module,
    );
  };

  const handleUpdateChart = useCallback(async () => {
    try {
      const payload = { ...metric[0] };
      payload.chartData = selectedRows;
      delete payload.id;
      delete payload.createdAt;
      delete payload.updatedAt;
      onUpdateChart(payload, metric[0].id);
    } catch (error) {
      console.error(error);
    }
  }, [selectedRows, metric]);

  useEffect(() => {
    onFindMetric(id);
  }, [id]);

  useEffect(() => {
    if (metric.length > 0) {
      setTableData(metric[0]?.chartData);
      table.onSelectAllRows(
        true,
        metric[0]?.chartData.map((item) => item.id),
      );
      //table.onSelectRow(row.id)
    }
  }, [metric]);

  useEffect(() => {
    if (metrics && metrics.length > 0) {
      const newData = tableData.concat(
        metrics.filter((i2) => !tableData.find((i1) => i1.id == i2.id)),
      );
      setTableData(newData);
    }
  }, [metrics]);

  useEffect(() => {
    if (selectedRows) {
      chartView.onTrue();
    }
  }, [selectedRows]);

  useUpdateEffect(() => {
    if (createChart?.id) {
      enqueueSnackbar('Métrica editada com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      const customerId = metric[0].customerId;
      handleClearFilter();
      router.push(paths.dashboard.metrics.root(customerId));
    }
  }, [createChart]);

  const disabledFind = !filters.startDate || !filters.endDate;
  return (
    <Container maxWidth={'lg'}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 2 }}>
        <Button
          color="inherit"
          sx={{ mr: 1 }}
          startIcon={<ArrowCircleLeftIcon />}
          onClick={handleGoBack}
        >
          Voltar
        </Button>
      </Box>
      <Stack direction={'row'} pb={2}>
        <Stack sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="div">
            Editar métricas
          </Typography>
          {metric.length > 0 && metric[0]?.title && (
            <Typography variant="h5" component="div">
              {metric[0].title}
            </Typography>
          )}
        </Stack>
      </Stack>
      <Divider />
      <Stack direction={'row'} pt={2}>
        <Stack sx={{ flexGrow: 1 }}>
          <Typography variant="h5" component="div">
            Carregar mais dados
          </Typography>
          <Stack direction={'row'} spacing={2} pt={2}>
            <DatePicker
              label="Start date"
              value={filters.startDate}
              slotProps={{ textField: { fullWidth: true } }}
              onChange={handleFilterStartDate}
              sx={{
                maxWidth: { md: 180 },
              }}
            />

            <DatePicker
              label="End date"
              value={filters.endDate}
              onChange={handleFilterEndDate}
              slotProps={{ textField: { fullWidth: true } }}
              sx={{
                maxWidth: { md: 180 },
              }}
            />
            <LoadingButton
              variant="contained"
              size="large"
              onClick={handleLoadData}
              loading={metricsStatus.loading}
              disabled={disabledFind}
            >
              Carregar
            </LoadingButton>
            <Button
              variant="contained"
              size="large"
              color={'error'}
              onClick={handleClearFilter}
              disabled={metricsStatus.loading || disabledFind}
            >
              Limpar
            </Button>
          </Stack>
          {metricsStatus.empty && (
            <Stack pt={2}>
              <Alert variant="outlined" severity="warning">
                Não foram encontrados novos dados
              </Alert>
            </Stack>
          )}
        </Stack>
      </Stack>
      <Card sx={{ mt: 2 }}>
        {metricStatus.loading && (
          <Stack alignItems={'center'} height={200} justifyContent={'center'}>
            <CircularProgress />
          </Stack>
        )}
        {!metricStatus.loading && (metricStatus.empty || metric.length === 0) && (
          <EmptyContent
            imgUrl="/assets/icons/empty/ic_content.svg"
            sx={{
              borderRadius: 1.5,
              bgcolor: 'background.default',
              height: '50vh',
            }}
          />
        )}
        {!metricStatus.loading && metric.length > 0 && (
          <>
            <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
              <TableSelectedAction
                dense={table.dense}
                numSelected={table.selected.length}
                rowCount={tableData?.length}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row.id),
                  )
                }
                action={
                  <Stack direction="row">
                    <Button
                      variant="contained"
                      startIcon={<ShowChartIcon />}
                      color="warning"
                      onClick={handleGenerateChart}
                    >
                      Visualizar gráfico
                    </Button>
                  </Stack>
                }
              />
              <Scrollbar>
                <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                  <TableHeadCustom
                    order={table.order}
                    orderBy={table.orderBy}
                    headLabel={renderTableHead()}
                    rowCount={tableData?.length}
                    numSelected={table.selected.length}
                    onSort={table.onSort}
                    onSelectAllRows={(checked) =>
                      table.onSelectAllRows(
                        checked,
                        tableData.map((row) => row.id),
                      )
                    }
                  />
                  <TableBody>
                    {tableData.map((row, index) => (
                      <>
                        {Number(metric[0].type) === 3 ? (
                          <PHMetricsTableRow
                            key={index}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                          />
                        ) : (
                          <MetricsTableRow
                            key={index}
                            row={row}
                            selected={table.selected.includes(row.id)}
                            onSelectRow={() => table.onSelectRow(row.id)}
                            type={Number(metric[0].type)}
                          />
                        )}
                      </>
                    ))}
                  </TableBody>
                </Table>
              </Scrollbar>
            </TableContainer>
          </>
        )}
      </Card>
      {chartView.value && (
        <ChartView
          open={chartView.value}
          onClose={chartView.onFalse}
          chartData={selectedRows}
          onConfirm={onConfirm}
          type={Number(metric[0].type)}
        />
      )}
      {onConfirm.value && (
        <ConfirmDialog
          open={onConfirm.value}
          onClose={onConfirm.onFalse}
          title={'Deseja editar o gráfico?'}
          content={
            <>
              <Typography>{metric[0].title}</Typography>
            </>
          }
          action={
            <LoadingButton variant="contained" color="success" onClick={handleUpdateChart}>
              Editar
            </LoadingButton>
          }
        />
      )}
    </Container>
  );
}
