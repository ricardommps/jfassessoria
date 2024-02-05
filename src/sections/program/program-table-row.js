import IconButton from '@mui/material/IconButton';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
export default function ProgramTableRow({ row }) {
  const { name, type, goal, referenceMonth, pv, pace } = row;
  const popover = usePopover();
  return (
    <TableRow hover>
      <TableCell>{name}</TableCell>
      <TableCell>{type === 2 ? 'Força' : 'Corrida'}</TableCell>
      <TableCell>{goal}</TableCell>
      <TableCell>{referenceMonth}</TableCell>
      <TableCell>{pv}</TableCell>
      <TableCell>{pace}</TableCell>
      <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
        <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}
