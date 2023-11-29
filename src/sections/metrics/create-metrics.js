'use client';

import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import FormControl from '@mui/material/FormControl';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { BootstrapInput } from 'src/components/bootstrap-input/bootstrap-input';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import EmptyContent from 'src/components/empty-content/empty-content';
import Scrollbar from 'src/components/scrollbar';
import { TableHeadCustom, TableSelectedAction, useTable } from 'src/components/table';
import { useBoolean } from 'src/hooks/use-boolean';
import useMetrics from 'src/hooks/use-metrics';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { fDateMetrics } from 'src/utils/format-time';
import { renderType } from 'src/utils/metrics';

import ChartView from './chart-view';
import MetricsTableRow from './metrics-table-row';
import MetricsToolbar from './metrics-toobar';
import PHMetricsTableRow from './ph-metrics-table-row';
const defaultFiltersDesempenho = {
  module: '',
  startDate: null,
  endDate: null,
};

const defaultFilters = {
  startDate: null,
  endDate: null,
};

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

export default function CreateMetrics() {
  const params = useParams();
  const router = useRouter();
  const chartView = useBoolean();
  const onConfirm = useBoolean();
  const table = useTable({ defaultOrderBy: 'createDate' });
  const {
    onClearMetrics,
    onGetListPerformanceMetrics,
    metricsStatus,
    metrics,
    onCreateChart,
    createChart,
    onGetListPhysiologicalMetrics,
  } = useMetrics();
  const [tableData, setTableData] = useState(null);
  const [chartTitle, setChartTitle] = useState(null);
  const { type, id } = params;

  const [filters, setFilters] = useState(
    Number(type) === 1 ? defaultFiltersDesempenho : defaultFilters,
  );
  const [selectedRows, setSelectedRows] = useState(null);

  const handleGoBack = useCallback(() => {
    handleClearFilter();
    router.back();
  }, []);

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleClearFilter = () => {
    setFilters(defaultFilters);
    setSelectedRows(null);
    setTableData(null);
    table.setSelected([]);
    onClearMetrics();
  };

  const handleSubmit = () => {
    if (Number(type) === 1) {
      const { module, startDate, endDate } = filters;
      onGetListPerformanceMetrics(
        id,
        fDateMetrics(startDate).toString(),
        fDateMetrics(endDate).toString(),
        module,
      );
      return;
    }
    if (Number(type) === 2) {
      const { startDate, endDate } = filters;
      onGetListPerformanceMetrics(
        id,
        fDateMetrics(startDate).toString(),
        fDateMetrics(endDate).toString(),
        'COMPETICAO',
      );
      return;
    }

    if (Number(type) === 3) {
      const { startDate, endDate } = filters;
      onGetListPhysiologicalMetrics(
        id,
        fDateMetrics(startDate).toString(),
        fDateMetrics(endDate).toString(),
      );
      return;
    }
  };

  const handleGenerateChart = () => {
    const rowsIten = tableData.filter((row) => table.selected.includes(row.id));
    setSelectedRows(rowsIten);
  };

  const handleChartTitle = (event) => {
    setChartTitle(event.target.value);
  };

  const handleCreateChart = useCallback(async () => {
    try {
      const payload = {
        customerId: Number(id),
        title: chartTitle,
        type: type,
        chartData: selectedRows,
      };
      if (Number(type) === 1) {
        payload.module = filters.module;
      }
      if (Number(type) === 2) {
        payload.module = 'COMPETICAO';
      }
      onCreateChart(payload);
    } catch (error) {
      console.error(error);
    }
  }, [selectedRows, chartTitle, type, id]);

  const renderTableHead = () => {
    switch (Number(type)) {
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

  const disabledFind =
    !filters.startDate || !filters.endDate || (Number(type) === 1 && filters.module.length === 0);

  useEffect(() => {
    if (metrics) {
      setTableData(metrics);
    }
  }, [metrics]);

  useEffect(() => {
    if (selectedRows) {
      chartView.onTrue();
    }
  }, [selectedRows]);

  useEffect(() => {
    onClearMetrics();
  }, []);

  useUpdateEffect(() => {
    if (createChart?.id) {
      enqueueSnackbar('Métrica criada com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleClearFilter();
      onClearMetrics();
      router.push(paths.dashboard.customersRacing);
    }
  }, [createChart]);

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
      <Stack direction={'row'}>
        <Stack sx={{ flexGrow: 1 }}>
          <Typography variant="h4" component="div">
            Criar métricas
          </Typography>
          <Typography variant="h6" component="div">
            {renderType(type)}
          </Typography>
        </Stack>
      </Stack>
      <Card>
        <MetricsToolbar
          filters={filters}
          onFilters={handleFilters}
          disabledFind={disabledFind}
          handleClearFilter={handleClearFilter}
          handleSubmit={handleSubmit}
          typeMetrics={Number(type)}
        />
        {metricsStatus.loading && (
          <Stack alignItems={'center'} height={200} justifyContent={'center'}>
            <CircularProgress />
          </Stack>
        )}
        {!metricsStatus.loading && (metricsStatus.empty || metrics?.length === 0) && (
          <EmptyContent
            imgUrl="/assets/icons/empty/ic_content.svg"
            sx={{
              borderRadius: 1.5,
              bgcolor: 'background.default',
              height: '50vh',
            }}
          />
        )}
        {!metricsStatus.loading && metrics?.length > 0 && (
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
                  {metrics.map((row, index) => (
                    <>
                      {Number(type) === 3 ? (
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
                          type={Number(type)}
                        />
                      )}
                    </>
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
        )}
      </Card>
      {chartView.value && (
        <ChartView
          open={chartView.value}
          onClose={chartView.onFalse}
          chartData={selectedRows}
          onConfirm={onConfirm}
          type={Number(type)}
        />
      )}
      {onConfirm.value && (
        <ConfirmDialog
          open={onConfirm.value}
          onClose={onConfirm.onFalse}
          title={'Deseja gerar o gráfico?'}
          content={
            <>
              <FormControl variant="standard" sx={{ width: '100%' }}>
                <Typography>Título</Typography>
                <BootstrapInput onChange={handleChartTitle} />
              </FormControl>
            </>
          }
          action={
            <LoadingButton variant="contained" color="success" onClick={handleCreateChart}>
              Confirmar
            </LoadingButton>
          }
        />
      )}
    </Container>
  );
}
