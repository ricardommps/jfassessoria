import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import { useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import Tooltip from '@mui/material/Tooltip';
import Iconify from 'src/components/iconify';
import {
  emptyRows,
  TableEmptyRows,
  TableHeadCustom,
  TableNoData,
  TablePaginationCustom,
  TableSelectedAction,
} from 'src/components/table';

import MediaTableRow from './media-table-row';
import MediaTableToolbar from './media-table-toolbar';

const TABLE_HEAD = [
  { id: 'title', label: 'Name', width: 300 },
  { id: 'instrucctions', label: 'Instruções' },
  { id: 'blocked', label: 'Status', width: 120 },
  { id: 'tags', label: 'Tags', width: 120 },
  { id: '', width: 88 },
];

export default function MediaListTable({
  table,
  tableData,
  dataFiltered,
  notFound,
  handleEditRow,
  filters,
  handleFilters,
}) {
  const theme = useTheme();
  const {
    dense,
    page,
    rowsPerPage,
    //
    selected,
    onSelectAllRows,
    //
  } = table;

  const denseHeight = dense ? 58 : 78;

  return (
    <>
      <Card>
        <MediaTableToolbar filters={filters} onFilters={handleFilters} />
        <TableContainer
          sx={{
            p: theme.spacing(0, 3, 3, 3),
          }}
        >
          <TableSelectedAction
            dense={dense}
            numSelected={selected.length}
            rowCount={tableData.length}
            onSelectAllRows={(checked) =>
              onSelectAllRows(
                checked,
                tableData.map((row) => row.id),
              )
            }
            action={
              <>
                <Tooltip title="Share">
                  <IconButton color="primary">
                    <Iconify icon="solar:share-bold" />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete">
                  <IconButton color="primary">
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </Tooltip>
              </>
            }
            sx={{
              pl: 1,
              pr: 2,
              top: 16,
              left: 24,
              right: 24,
              width: 'auto',
              borderRadius: 1.5,
            }}
          />
          <Table
            size={dense ? 'small' : 'medium'}
            sx={{
              minWidth: 960,
              borderCollapse: 'separate',
              borderSpacing: '0 16px',
            }}
          >
            <TableHeadCustom
              order={table.order}
              orderBy={table.orderBy}
              headLabel={TABLE_HEAD}
              onSort={table.onSort}
              sx={{
                [`& .${tableCellClasses.head}`]: {
                  '&:first-of-type': {
                    borderTopLeftRadius: 12,
                    borderBottomLeftRadius: 12,
                  },
                  '&:last-of-type': {
                    borderTopRightRadius: 12,
                    borderBottomRightRadius: 12,
                  },
                },
              }}
            />
            <TableBody>
              {dataFiltered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row) => (
                  <MediaTableRow key={row.id} row={row} handleEditRow={handleEditRow} />
                ))}

              <TableEmptyRows
                height={denseHeight}
                emptyRows={emptyRows(page, rowsPerPage, tableData.length)}
              />

              <TableNoData
                notFound={notFound}
                sx={{
                  m: -2,
                  borderRadius: 1.5,
                  border: `dashed 1px ${theme.palette.divider}`,
                }}
              />
            </TableBody>
          </Table>
        </TableContainer>
        <TablePaginationCustom
          count={dataFiltered.length}
          page={table.page}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          //
          dense={table.dense}
        />
      </Card>
    </>
  );
}
