import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCustomerOverdue } from 'src/hooks/use-customers-overdue';
import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

import NotificationDialog from './notification-dialog';

export default function OverdueInvoices({ ...other }) {
  const { data, isLoading, isError } = useCustomerOverdue();
  const customers = data?.customers ?? [];
  const totalCustomers = data?.totalCustomers ?? 0;

  const [customerSelected, setCustomerSelected] = useState(null);
  const notification = useBoolean();

  const hasOverdueCustomers = customers.length > 0;

  const handleCloseNotification = () => {
    setCustomerSelected(null);
    notification.onFalse();
  };

  const getDaysLabel = (days) => {
    if (days === 0) return 'Vence hoje';
    if (days === 1) return '1 dia';
    return `${days} dias`;
  };

  const getSeverityColor = (days) => {
    if (days <= 7) return 'warning';
    if (days <= 15) return 'error';
    return 'error';
  };

  useEffect(() => {
    if (customerSelected) {
      notification.onTrue();
    }
  }, [customerSelected, notification]);

  return (
    <>
      <Card
        {...other}
        sx={{
          height: '55vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <CardHeader
          title="FATURAS EM ATRASO"
          subheader={
            totalCustomers > 0
              ? `${totalCustomers} ${totalCustomers === 1 ? 'aluno' : 'alunos'}`
              : ''
          }
          sx={{ mb: 1 }}
        />

        <Stack
          spacing={2}
          sx={{
            px: 2,
            pb: 2,
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {/* LOADING */}
          {isLoading && (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {/* ERROR */}
          {!isLoading && isError && (
            <Stack
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{ height: '100%', textAlign: 'center' }}
            >
              <ErrorOutlineOutlinedIcon color="error" fontSize="large" />
              <Typography variant="subtitle2" color="error">
                Erro ao carregar faturas atrasadas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tente novamente mais tarde
              </Typography>
            </Stack>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !isError && !hasOverdueCustomers && (
            <Stack
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{
                height: '100%',
                textAlign: 'center',
                color: 'text.secondary',
              }}
            >
              <ReceiptLongOutlinedIcon fontSize="large" />
              <Typography variant="subtitle2">Nenhuma fatura em atraso</Typography>
              <Typography variant="caption">
                Todos os alunos estão em dia com suas mensalidades.
              </Typography>
            </Stack>
          )}

          {/* CONTENT */}
          {!isLoading && !isError && hasOverdueCustomers && (
            <Stack spacing={1.5}>
              {customers.map((customer) => (
                <Stack
                  key={customer.customerId}
                  direction="row"
                  alignItems="center"
                  spacing={2}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: (theme) =>
                      customer.daysOverdue > 15
                        ? `${theme.palette.error.main}14`
                        : customer.daysOverdue > 7
                        ? `${theme.palette.error.main}0A`
                        : `${theme.palette.warning.main}14`,
                    border: (theme) =>
                      `1px solid ${
                        customer.daysOverdue > 15
                          ? theme.palette.error.main
                          : customer.daysOverdue > 7
                          ? theme.palette.error.light
                          : theme.palette.warning.main
                      }33`,
                  }}
                >
                  <Avatar src={customer.avatar || undefined} />

                  <Box flexGrow={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 0.5 }}>
                      {customer.name}
                    </Typography>

                    <Stack direction="row" alignItems="center" spacing={1} flexWrap="wrap">
                      <Chip
                        icon={<AccessTimeOutlinedIcon />}
                        label={getDaysLabel(customer.daysOverdue)}
                        color={getSeverityColor(customer.daysOverdue)}
                        size="small"
                        sx={{ fontSize: '0.75rem', height: 22 }}
                      />

                      <Typography variant="caption" color="text.secondary">
                        Venc: {fDate(customer.dueDate)}
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        •
                      </Typography>

                      <Typography variant="caption" color="text.primary" sx={{ fontWeight: 600 }}>
                        {new Intl.NumberFormat('pt-BR', {
                          style: 'currency',
                          currency: 'BRL',
                        }).format(customer.totalAmount)}
                      </Typography>
                    </Stack>
                  </Box>

                  <Tooltip title="Enviar notificação">
                    <IconButton
                      size="small"
                      onClick={() => setCustomerSelected(customer.customerId)}
                      sx={{
                        bgcolor: (theme) => `${theme.palette.primary.main}14`,
                        '&:hover': {
                          bgcolor: (theme) => `${theme.palette.primary.main}29`,
                        },
                      }}
                    >
                      <MessageOutlinedIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      </Card>

      {notification.value && (
        <NotificationDialog
          open={notification.value}
          onClose={handleCloseNotification}
          customerId={customerSelected}
        />
      )}
    </>
  );
}
