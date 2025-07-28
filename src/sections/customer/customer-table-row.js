// @mui
import AssignmentIcon from '@mui/icons-material/Assignment';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color/svg-color';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

export default function CustomerTableRow({ row, selected }) {
  const popover = usePopover();
  const router = useRouter();
  const formatDate = (dateLike) => {
    if (!dateLike) return '';
    const d = new Date(dateLike);
    return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('pt-BR'); // 05/10/2025
  };

  // Ajuste aqui o campo de data do seu objeto de programa (ex.: endDate, date, exchangeDate...)
  const getProgramDate = (p) =>
    formatDate(p?.endDate ?? p?.date ?? p?.exchangeDate ?? p?.updatedAt);

  const RendetExchangeDate = () => {
    const programs = Array.isArray(row?.programs) ? row.programs : [];

    // Encontrar por tipo
    const corrida = programs.find((p) => p?.type === 1);
    const forca = programs.find((p) => p?.type === 2);

    // Sem programas: não renderiza nada
    if (!corrida && !forca) return null;

    // Monta nós de UI
    const primaryNode = forca ? (
      <Stack>
        <Typography sx={{ color: 'text.primary' }}>
          Força: {getProgramDate(forca) || '—'}
        </Typography>
      </Stack>
    ) : corrida ? (
      // Se só tem corrida, ela vai no primary
      <Stack>
        <Typography sx={{ color: 'text.primary' }}>
          Corrida: {getProgramDate(corrida) || '—'}
        </Typography>
      </Stack>
    ) : null;

    const secondaryNode =
      forca && corrida ? (
        <Stack>
          <Typography sx={{ color: 'text.primary' }}>
            Corrida: {getProgramDate(corrida) || '—'}
          </Typography>
        </Stack>
      ) : undefined; // sem secondary quando só existe um tipo

    return (
      <ListItemText
        primary={primaryNode}
        secondary={secondaryNode}
        primaryTypographyProps={{ typography: 'body2' }}
        secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
      />
    );
  };

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
          <RendetExchangeDate />
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
