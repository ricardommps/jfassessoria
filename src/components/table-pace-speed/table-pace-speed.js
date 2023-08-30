import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { runningPace } from 'src/utils/running-pace';

import { StyledTableCell, StyledTableRow } from './styles';

export default function TablePaceSpeed({ handleClick, actionType, minWidth }) {
  return (
    <>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: minWidth || 500 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align="center">Pace</StyledTableCell>
              <StyledTableCell align="center">Km/H</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {runningPace.map((row) => (
              <StyledTableRow
                key={row.pace}
                onClick={() => actionType && handleClick(row)}
                clicked={actionType}
              >
                <StyledTableCell align="center">{row.pace}</StyledTableCell>
                <StyledTableCell align="center">{row.speed}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
