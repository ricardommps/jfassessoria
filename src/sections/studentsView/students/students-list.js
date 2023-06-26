import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { customersData } from 'src/_mock';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import {
  emptyRows,
  getComparator,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TableSelectedAction,
  useTable,
} from 'src/components/table';
import { applyFilter } from 'src/layouts/_common/searchbar/utils';

import StudantsTableRow from './studants-table-row';
import StudantsTableToolbar from './studants-table-toolbar';

const TABLE_HEAD = [
  { id: 'status', label: 'Status', width: 80 },
  { id: 'name', label: 'Name' },
  { id: 'premium_expires_date', label: 'Expiração', width: 220 },
  { id: 'programs', label: 'Programas', width: 180 },
  { id: '', width: 90 },
];

const defaultFilters = {
  name: '',
  status: 'all',
};

export function StudentsList({ handleSelectCurrentCustomer }) {
  const { customers } = customersData;
  const table = useTable();

  const tableData = customers;

  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filters,
  });
  const denseHeight = table.dense ? 52 : 72;
  const canReset = !isEqual(defaultFilters, filters);
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

  return (
    <>
      <StudantsTableToolbar filters={filters} onFilters={handleFilters} />
      <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
        <TableSelectedAction
          dense={table.dense}
          numSelected={table.selected.length}
          rowCount={tableData.length}
          onSelectAllRows={(checked) =>
            table.onSelectAllRows(
              checked,
              tableData.map((row) => row.id),
            )
          }
          action={
            <Tooltip title="Delete">
              <IconButton color="primary" onClick={confirm.onTrue}>
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          }
        />
        <Scrollbar>
          <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 800 }}>
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              rowCount={tableData.length}
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
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage,
                )
                .map((row) => (
                  <StudantsTableRow
                    key={row.id}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    handleSelectCurrentCustomer={handleSelectCurrentCustomer}
                  />
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
    </>
  );
}

StudentsList.propTypes = {
  handleSelectCurrentCustomer: PropTypes.func,
};
