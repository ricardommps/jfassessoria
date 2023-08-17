// @mui
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
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

export default function CustomerTableRow({ row, selected, handleOpenCustomer, handleOpenProgram }) {
  const popover = usePopover();

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
            handleOpenCustomer(row.id);
            popover.onClose();
          }}
        >
          <SvgColor src="/assets/icons/navbar/ic_user.svg" sx={{ mr: 1 }} />
          Renovar plano
        </MenuItem>
      </CustomPopover>
    </>
  );
}

CustomerTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onSelectRow: PropTypes.func,
  handleOpenCustomer: PropTypes.func,
  handleOpenProgram: PropTypes.func,
};
