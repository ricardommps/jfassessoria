// @mui
import AssignmentIcon from '@mui/icons-material/Assignment';
import DeleteIcon from '@mui/icons-material/Delete';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import InsightsIcon from '@mui/icons-material/Insights';
import PlaylistAddCheckCircleIcon from '@mui/icons-material/PlaylistAddCheckCircle';
import ReviewsIcon from '@mui/icons-material/Reviews';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import { addHours, format } from 'date-fns';
import { useState } from 'react';
import { BootstrapInput } from 'src/components/bootstrap-input/bootstrap-input';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color/svg-color';
import { useBoolean } from 'src/hooks/use-boolean';

export default function CustomerTableRow({
  row,
  selected,
  handleOpenCustomer,
  handleOpenProgram,
  handleOpenPayment,
  onDeleteCustomer,
  handleOpenArquivedProgram,
  handleOpenReview,
  handleOpenAllDone,
  handleOpenMetrics,
}) {
  const theme = useTheme();
  const popover = usePopover();
  const deleteCustomer = useBoolean();

  const [customerName, setCustomerName] = useState('');

  const { payments } = row;

  const handleChangeCustomerName = (event) => {
    setCustomerName(event.target.value);
  };

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
    if (!dueDate) {
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

  const handleCloseDeleteCustomer = () => {
    deleteCustomer.onFalse();
    setCustomerName();
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Chip label={row.active ? 'Ativo' : 'Inativo'} color={row.active ? 'primary' : 'error'} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center', padding: '23px' }}>
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
            color: payments
              ? checkDueDate(payments[0]?.due_date, payments[0]?.payment_date)
              : theme.palette.success.main,
          }}
        >
          {payments ? format(addHours(new Date(payments[0]?.due_date), 3), 'dd/MM/yyyy') : ''}
        </TableCell>

        <TableCell
          sx={{
            whiteSpace: 'nowrap',
            color: payments
              ? checkExpiresDate(payments[0]?.expires_date)
              : theme.palette.success.main,
          }}
        >
          {payments ? format(addHours(new Date(payments[0]?.expires_date), 3), 'dd/MM/yyyy') : ''}
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          {row?.programs}
        </TableCell>

        <TableCell align="center" sx={{ whiteSpace: 'nowrap' }}>
          {row?.reviews}
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
            <AssignmentIcon sx={{ mr: 1 }} />
            Programas
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            handleOpenArquivedProgram(row.id);
            popover.onClose();
          }}
        >
          <DeleteSweepIcon sx={{ mr: 1 }} />
          Programas Arquivados
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenPayment(row.id);
            popover.onClose();
          }}
        >
          <SvgColor src="/assets/icons/navbar/ic_invoice.svg" sx={{ mr: 1 }} />
          Renovar
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenReview(row.id);
            popover.onClose();
          }}
        >
          <ReviewsIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Aguardando Feedback
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenAllDone(row.id);
            popover.onClose();
          }}
        >
          <PlaylistAddCheckCircleIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Feedbacks concluidos
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleOpenMetrics(row.id);
            popover.onClose();
          }}
        >
          <InsightsIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Métricas
        </MenuItem>
        <MenuItem
          onClick={() => {
            deleteCustomer.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Deletar
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={deleteCustomer.value}
        onClose={handleCloseDeleteCustomer}
        title={`DELERAR ${deleteCustomer.name}`}
        content={
          <>
            <Typography>
              Este aluno será excluído definitivamente, juntamente com todos os seus lançamentos de
              planos, programas e treinos.
            </Typography>
            <Alert variant="filled" severity="error" sx={{ margin: '15px 0' }}>
              Aviso: esta ação não é reversível. Por favor, tenha certeza.
            </Alert>
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <Typography>
                Digite o nome do programa{' '}
                <Box component="span" fontWeight="bold" color="#FF5630">
                  {row.name}
                </Box>{' '}
                para continuar:
              </Typography>
              <BootstrapInput onChange={handleChangeCustomerName} />
            </FormControl>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onDeleteCustomer(row.id);
              setCustomerName(null);
              deleteCustomer.onFalse();
            }}
            disabled={row.name.trim() !== customerName?.trim()}
          >
            DELETAR
          </Button>
        }
      />
    </>
  );
}
