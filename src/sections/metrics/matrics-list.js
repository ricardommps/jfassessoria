import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tabs from '@mui/material/Tabs';
import { useCallback, useEffect, useState } from 'react';
import EmptyContent from 'src/components/empty-content/empty-content';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import {
  getComparator,
  TableHeadCustom,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';
import useMetrics from 'src/hooks/use-metrics';

import ChartTableRow from './chart-table-row';

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 1, label: 'Desempenho' },
  { value: 2, label: 'Competição' },
  { value: 3, label: 'Parametros fisiológicos' },
];

const TABLE_HEAD = [
  { id: 'title', label: 'Título' },
  { id: 'type', label: 'Tipo' },
  { id: 'module', label: 'Módulo' },
  { id: 'updatedAt', label: 'Atualização' },
  { id: '', width: 88 },
];

const defaultFilters = {
  type: 'all',
};
export default function MetricsList({ id }) {
  const table = useTable({ defaultOrderBy: 'updatedAt' });
  const { metricsCreated, onFindMetrics, metricsCreatedStatus } = useMetrics();
  const [tableData, setTableData] = useState([]);
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });

  const handleFilters = useCallback(
    (name, value) => {
      table.onResetPage();
      setFilters((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    },
    [table],
  );

  const handleFilterType = useCallback(
    (event, newValue) => {
      handleFilters('type', newValue);
    },
    [handleFilters],
  );

  useEffect(() => {
    onFindMetrics(id);
  }, [id]);

  useEffect(() => {
    if (metricsCreated) {
      setTableData([...metricsCreated]);
    }
  }, [metricsCreated]);

  return (
    <Card sx={{ mt: 2 }}>
      {metricsCreated && filters && (
        <Tabs
          value={filters.type}
          onChange={handleFilterType}
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {TYPE_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.type) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 1 && 'success') ||
                    (tab.value === 2 && 'warning') ||
                    (tab.value === 3 && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && metricsCreated.length}
                  {tab.value === 1 && metricsCreated.filter((item) => item.type === '1').length}

                  {tab.value === 2 && metricsCreated.filter((item) => item.type === '2').length}
                  {tab.value === 3 && metricsCreated.filter((item) => item.type === '3').length}
                </Label>
              }
            />
          ))}
        </Tabs>
      )}

      {metricsCreatedStatus.loading && (
        <Stack alignItems={'center'} height={200} justifyContent={'center'}>
          <CircularProgress />
        </Stack>
      )}

      {!metricsCreatedStatus.loading &&
        (metricsCreatedStatus.empty || dataFiltered?.length === 0) && (
          <EmptyContent
            imgUrl="/assets/icons/empty/ic_content.svg"
            sx={{
              borderRadius: 1.5,
              bgcolor: 'background.default',
              height: '50vh',
            }}
          />
        )}
      {!metricsCreatedStatus.loading && dataFiltered?.length > 0 && (
        <>
          <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
            <Scrollbar>
              <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
                <TableHeadCustom
                  order={table.order}
                  orderBy={table.orderBy}
                  headLabel={TABLE_HEAD}
                  onSort={table.onSort}
                />
                <TableBody>
                  {dataFiltered.map((row) => (
                    <ChartTableRow key={`chart-list-${row.id}`} row={row} />
                  ))}
                </TableBody>
              </Table>
            </Scrollbar>
          </TableContainer>
          <TablePaginationCustom
            count={dataFiltered.length}
            page={table.page}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </>
      )}
    </Card>
  );
}
function applyFilter({ inputData, comparator, filters }) {
  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const metric = comparator(a[0], b[0]);
    if (metric !== 0) return metric;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);
  if (filters.type !== 'all') {
    inputData = inputData.filter((item) => Number(item.type) === filters.type);
  }

  return inputData;
}
