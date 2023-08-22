// @mui
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { addHours, format } from 'date-fns';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color/svg-color';

export default function CustomerTableRow({
  row,
  selected,
  handleOpenCustomer,
  handleOpenProgram,
  handleOpenPayment,
}) {
  const theme = useTheme();
  const popover = usePopover();
  const { payments } = row;

  const checkExpiresDate = (expiresDate) => {
    if (!expiresDate) {
      return theme.palette.warning.main;
    }
    const currentDate = new Date().toISOString();
    const expiresDateTimezone = addHours(new Date(expiresDate), 3).toISOString();
    if (expiresDate && expiresDateTimezone < currentDate) {
      return theme.palette.error.main;
    }
    return theme.palette.success.main;
  };

  const checkDueDate = (dueDate, paymentDate) => {
    if (!dueDate || !paymentDate) {
      return theme.palette.warning.main;
    }
    const paymentDateTimezone = paymentDate && addHours(new Date(paymentDate), 3).toISOString();
    const currentDate = new Date().toISOString();
    const dueDateTimezone = addHours(new Date(dueDate), 3).toISOString();
    if (!paymentDateTimezone && dueDateTimezone < currentDate) {
      return theme.palette.error.main;
    }
    return theme.palette.success.main;
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip label={row.active ? 'Ativo' : 'Inativo'} color={row.active ? 'primary' : 'error'} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={row?.avatarUrl || ''}
            sx={{
              width: 48,
              height: 48,
              color: 'text.secondary',
              bgcolor: 'background.neutral',
              mr: 2,
            }}
          />
          <ListItemText
            primary={row.name}
            secondary={row.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: 'nowrap',
            color: checkDueDate(payments[0]?.dueDate, payments[0]?.paymentDate),
          }}
        >
          {payments[0]?.id ? format(addHours(new Date(payments[0]?.dueDate), 3), 'dd/MM/yyyy') : ''}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap', color: checkExpiresDate(payments[0]?.expiresDate) }}>
          {payments[0]?.id
            ? format(addHours(new Date(payments[0]?.expiresDate), 3), 'dd/MM/yyyy')
            : ''}
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row?.programs ? row?.programs.length : ''}
        </TableCell>

        <TableCell align="right" sx={{ px: 1, whiteSpace: 'nowrap' }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenCustomer(row.id);
            popover.onClose();
          }}
        >
          <SvgColor src="/assets/icons/navbar/ic_user.svg" sx={{ mr: 1 }} />
          Cadastro
        </MenuItem>
        {row.active && (
          <MenuItem
            onClick={() => {
              handleOpenProgram(row.id);
              popover.onClose();
            }}
          >
            <SvgColor src="/assets/icons/navbar/icon_runner.svg" sx={{ mr: 1 }} />
            Programas
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleOpenPayment(row.id);
            popover.onClose();
          }}
        >
          <SvgColor src="/assets/icons/navbar/ic_invoice.svg" sx={{ mr: 1 }} />
          Renovar
        </MenuItem>
      </CustomPopover>
    </>
  );
}
