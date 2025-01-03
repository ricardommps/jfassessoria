// @mui
import AssignmentIcon from '@mui/icons-material/Assignment';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color/svg-color';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

export default function CustomerTableRow({ row, selected }) {
  const popover = usePopover();
  const router = useRouter();
  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ display: 'flex', alignItems: 'center', padding: '23px' }}>
          <Avatar alt={row.name} src={row.avatar ? row.avatar : row.name} sx={{ mr: 2 }} />
          <ListItemText
            primary={row.name}
            secondary={row.email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip label={row.active ? 'Ativo' : 'Inativo'} color={row.active ? 'primary' : 'error'} />
        </TableCell>

        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          {row.hasAnamneses && (
            <IconButton>
              <SvgColor
                src="/assets/icons/custom/healthIcon.svg"
                sx={{ color: row.anamnesisRead ? 'success.main' : 'warning.main' }}
              />
            </IconButton>
          )}
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
        sx={{ width: 240 }}
      >
        <MenuItem
          onClick={() => {
            popover.onClose();
            router.push(paths.dashboard.customer.profile(row.id));
          }}
        >
          <SvgColor src="/assets/icons/navbar/ic_user.svg" sx={{ mr: 1 }} />
          Perfil
        </MenuItem>

        {row.active && (
          <MenuItem
            onClick={() => {
              popover.onClose();
              router.push(paths.dashboard.customer.program(row.id));
            }}
          >
            <AssignmentIcon sx={{ mr: 1 }} />
            Programas
          </MenuItem>
        )}
      </CustomPopover>
    </>
  );
}
