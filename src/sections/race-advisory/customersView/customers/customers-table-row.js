// @mui
import Avatar from '@mui/material/Avatar';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color/svg-color';

export default function CustomersTableRow({
  row,
  selected,
  onSelectRow,
  handleEditCustomer,
  handleOpenProgram,
}) {
  const popover = usePopover();

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>{status === 2 ? 'Ativo' : 'Inativo'}</TableCell>

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

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <ListItemText
            primary={
              row?.premium_expires_date
                ? format(new Date(row.premium_expires_date), 'dd MMM yyyy')
                : ''
            }
            secondary={
              row?.premium_expires_date ? format(new Date(row.premium_expires_date), 'p') : ''
            }
            primaryTypographyProps={{ typography: 'body2', noWrap: true }}
            secondaryTypographyProps={{
              mt: 0.5,
              component: 'span',
              typography: 'caption',
            }}
          />
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
            handleEditCustomer(row);
            popover.onClose();
          }}
        >
          <SvgColor src="/assets/icons/navbar/ic_user.svg" sx={{ mr: 1 }} />
          Cadastro
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleOpenProgram(row);
            popover.onClose();
          }}
        >
          <SvgColor src="/assets/icons/navbar/icon_runner.svg" sx={{ mr: 1 }} />
          Programas
        </MenuItem>
      </CustomPopover>
    </>
  );
}

CustomersTableRow.propTypes = {
  onSelectRow: PropTypes.func,
  row: PropTypes.object,
  selected: PropTypes.bool,
  handleEditCustomer: PropTypes.func,
  handleOpenProgram: PropTypes.func,
};
