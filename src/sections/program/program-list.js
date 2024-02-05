'use client';

import Card from '@mui/material/Card';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tabs from '@mui/material/Tabs';
import { useCallback, useState } from 'react';
import Label from 'src/components/label';
import Scrollbar from 'src/components/scrollbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  useTable,
} from 'src/components/table';

import ProgramTableRow from './program-table-row';
import ProgramTableToolbar from './program-table-toolbar';

const TABLE_HEAD = [
  { id: 'name', label: 'Nome' },
  { id: 'type', label: 'Tipo' },
  { id: 'goal', label: 'Objetivo' },
  { id: 'referenceMonth', label: 'Mês' },
  { id: 'pv', label: 'PV' },
  { id: 'pace', label: 'Pace' },
  { id: '', width: 88 },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'active', label: 'Ativo' },
  { value: 'arquived', label: 'Arquivado' },
];

const defaultFilters = {
  name: '',
  status: 'active',
};

export default function ProgramList({ tableData }) {
  const table = useTable({ defaultOrderBy: 'hide' });
  const [filters, setFilters] = useState(defaultFilters);
  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const denseHeight = table.dense ? 52 : 72;
  const canReset = !!filters.name;
  const notFound = (!dataFiltered.length && canReset) || !dataFiltered.length;

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

  const handleFilterTyoe = useCallback(
    (event, newValue) => {
      handleFilters('status', newValue);
    },
    [handleFilters],
  );

  const handleResetFilters = useCallback(() => {
    setFilters(defaultFilters);
  }, []);

  return (
    <>
      <Card>
        <Tabs
          value={filters.status}
          onChange={handleFilterTyoe}
          indicatorColor="secondary"
          sx={{
            px: 2.5,
            boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
          }}
        >
          {STATUS_OPTIONS.map((tab) => (
            <Tab
              key={tab.value}
              iconPosition="end"
              value={tab.value}
              label={tab.label}
              icon={
                <Label
                  variant={
                    ((tab.value === 'all' || tab.value === filters.status) && 'filled') || 'soft'
                  }
                  color={
                    (tab.value === 'active' && 'success') ||
                    (tab.value === 'arquived' && 'error') ||
                    'default'
                  }
                >
                  {tab.value === 'all' && tableData.length}
                  {tab.value === 'active' && tableData.filter((item) => !item.hide).length}
                  {tab.value === 'arquived' && tableData.filter((item) => item.hide).length}
                </Label>
              }
            />
          ))}
        </Tabs>
        <ProgramTableToolbar
          filters={filters}
          onFilters={handleFilters}
          canReset={canReset}
          onResetFilters={handleResetFilters}
        />
        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <TableHeadCustom order={table.order} orderBy={table.orderBy} headLabel={TABLE_HEAD} />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage,
                  )
                  .map((row) => (
                    <ProgramTableRow key={row.id} row={row} />
                  ))}
                <TableEmptyRows
                  height={denseHeight}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />

                <TableNoData notFound={notFound} />
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
      </Card>
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name, status } = filters;

  const stabilizedThis = inputData?.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const program = comparator(a[0], b[0]);
    if (program !== 0) return program;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (program) => program.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }

  if (status === 'active') {
    inputData = inputData.filter((program) => !program.hide);
  }

  if (status === 'arquived') {
    inputData = inputData.filter((program) => program.hide);
  }

  return inputData;
}
