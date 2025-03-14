import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import { useCallback, useEffect, useState } from 'react';
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
import useProgram from 'src/hooks/use-program';

import TableRowItem from './table-row-item';
import TableToolbar from './table-toolbar';

const TABLE_HEAD = [
  { id: '', width: 90 },
  { id: 'name', label: 'Nome' },
];

const defaultFilters = {
  name: '',
};

export default function CustomerProgramList({ onSelectProgram, type, vs2 }) {
  const table = useTable();

  const { allPrograms, onListAllPrograms } = useProgram();

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
  useEffect(() => {
    if (!allPrograms?.length) {
      onListAllPrograms();
    }
  }, []);

  useEffect(() => {
    if (allPrograms?.length) {
      const filteredData = allPrograms.filter((item) => item.type === type && item.vs2 === vs2);
      setTableData(filteredData);
    }
  }, [allPrograms, type, vs2]);

  return (
    <>
      <TableToolbar filters={filters} onFilters={handleFilters} />
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
                <TableRowItem
                  key={`customers-list-review-${row.id}`}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectProgram={onSelectProgram}
                />
              ))}
            </TableBody>
          </Table>
        </Scrollbar>
      </TableContainer>
    </>
  );
}

function applyFilter({ inputData, comparator, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (item) => item.customer?.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }
  return inputData;
}
