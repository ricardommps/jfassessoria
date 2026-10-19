// @mui
import AssignmentIcon from '@mui/icons-material/Assignment';
import BarChartIcon from '@mui/icons-material/BarChart';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
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

import { PROGRAM_TYPES } from './programs/program-type';

export default function CustomerTableRow({ row, selected, setCustomerSelected }) {
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

    const exchangeDates = [
      { type: PROGRAM_TYPES.GYM, label: 'Força' },
      { type: PROGRAM_TYPES.RUNNING, label: 'Corrida' },
      { type: PROGRAM_TYPES.COMPLEMENTARY, label: 'Complementares' },
    ].flatMap(({ type, label }) => {
      const program = programs.find((item) => item?.type === type);
      return program ? [{ type, label, date: getProgramDate(program) || '—' }] : [];
    });

    if (!exchangeDates.length) return null;

    return (
      <Stack>
        {exchangeDates.map(({ type, label, date }) => (
          <Typography key={type} sx={{ color: 'text.primary' }}>
            {label}: {date}
          </Typography>
        ))}
      </Stack>
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
          <>
            <MenuItem
              onClick={() => {
                popover.onClose();
                router.push(paths.dashboard.customer.lessonPackages(row.id));
              }}
            >
              <CalendarMonthIcon sx={{ mr: 1 }} />
              Pacotes de aulas
            </MenuItem>
            <MenuItem
              onClick={() => {
                popover.onClose();
                router.push(paths.dashboard.customer.program(row.id));
              }}
            >
              <AssignmentIcon sx={{ mr: 1 }} />
              Programas
            </MenuItem>
            {setCustomerSelected && (
              <MenuItem
                onClick={() => {
                  popover.onClose();
                  setCustomerSelected(row);
                }}
              >
                <BarChartIcon sx={{ mr: 1 }} />
                Trimp
              </MenuItem>
            )}
          </>
        )}
      </CustomPopover>
    </>
  );
}
