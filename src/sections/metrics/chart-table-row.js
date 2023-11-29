import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import { renderType } from 'src/utils/metrics';
import { getModuleName } from 'src/utils/training-modules';

import ChartEdit from './chart-edit';

export default function ChartTableRow({ row }) {
  const popover = usePopover();
  const details = useBoolean();
  return (
    <>
      <TableRow hover>
        <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
          {row.title}
        </TableCell>
        <TableCell align="left" sx={{ whiteSpace: 'nowrap', color: 'success' }}>
          <Label
            variant={'soft'}
            color={
              (Number(row.type) === 1 && 'success') ||
              (Number(row.type) === 2 && 'warning') ||
              (Number(row.type) === 3 && 'error') ||
              'default'
            }
          >
            {renderType(row.type)}
          </Label>
        </TableCell>
        <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
          {getModuleName(row.module)}
        </TableCell>
        <TableCell align="left" sx={{ whiteSpace: 'nowrap' }}>
          {row.updatedAt}
        </TableCell>
        <TableCell align="right" sx={{ px: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="top-left"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={() => {
            details.onTrue();
            popover.onClose();
          }}
        >
          <Iconify icon="solar:eye-bold" />
          Ver gráfico
        </MenuItem>
      </CustomPopover>
      {details.value && <ChartEdit item={row} open={details.value} onClose={details.onFalse} />}
    </>
  );
}
