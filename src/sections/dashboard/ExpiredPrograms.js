import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import DirectionsRunOutlinedIcon from '@mui/icons-material/DirectionsRunOutlined';
import ErrorOutlineOutlinedIcon from '@mui/icons-material/ErrorOutlineOutlined';
import FitnessCenterOutlinedIcon from '@mui/icons-material/FitnessCenterOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
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
import { useExpiredPrograms } from 'src/hooks/useExpiredPrograms';
import { fDate } from 'src/utils/format-time';

import NotificationDialog from './notification-dialog';

export default function ExpiringPrograms({ ...other }) {
  const { data, isLoading, isError } = useExpiredPrograms();
  const customers = data ?? [];
  const totalCustomers = customers.length;

  const [customerSelected, setCustomerSelected] = useState(null);
  const notification = useBoolean();

  const hasExpiringPrograms = customers.length > 0;

  const handleCloseNotification = () => {
    setCustomerSelected(null);
    notification.onFalse();
  };

  const getDaysLabel = (days) => {
    if (days === 0) return 'Vence hoje';
    if (days === 1) return '1 dia restante';
    return `${days} dias restantes`;
  };

  const getSeverityColor = (days) => {
    if (days <= 2) return 'error';
    if (days <= 4) return 'warning';
    return 'info';
  };

  const getProgramIcon = (type) => {
    return type === 'corrida' ? (
      <DirectionsRunOutlinedIcon fontSize="small" />
    ) : (
      <FitnessCenterOutlinedIcon fontSize="small" />
    );
  };

  const getProgramLabel = (type) => {
    return type === 'corrida' ? 'Corrida' : 'Força';
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
          title="PROGRAMAS A VENCER"
          subheader={
            totalCustomers > 0
              ? `${totalCustomers} ${totalCustomers === 1 ? 'aluno' : 'alunos'} • Próximos 7 dias`
              : 'Próximos 7 dias'
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
                Erro ao carregar programas
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Tente novamente mais tarde
              </Typography>
            </Stack>
          )}

          {/* EMPTY STATE */}
          {!isLoading && !isError && !hasExpiringPrograms && (
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
              <DirectionsRunOutlinedIcon fontSize="large" />
              <Typography variant="subtitle2">Nenhum programa próximo ao vencimento</Typography>
              <Typography variant="caption">
                Não há programas que vencerão nos próximos 7 dias.
              </Typography>
            </Stack>
          )}

          {/* CONTENT */}
          {!isLoading && !isError && hasExpiringPrograms && (
            <Stack spacing={1.5}>
              {customers.map((customer) => (
                <Stack
                  key={customer.customerId}
                  direction="row"
                  alignItems="flex-start"
                  spacing={2}
                  sx={{
                    p: 1.5,
                    borderRadius: 1,
                    bgcolor: (theme) => {
                      const minDays = Math.min(
                        ...customer.programs.map((p) => p.daysUntilExpiration),
                      );
                      return minDays <= 2
                        ? `${theme.palette.error.main}14`
                        : minDays <= 4
                        ? `${theme.palette.warning.main}14`
                        : `${theme.palette.info.main}14`;
                    },
                    border: (theme) => {
                      const minDays = Math.min(
                        ...customer.programs.map((p) => p.daysUntilExpiration),
                      );
                      return `1px solid ${
                        minDays <= 2
                          ? theme.palette.error.main
                          : minDays <= 4
                          ? theme.palette.warning.main
                          : theme.palette.info.main
                      }33`;
                    },
                  }}
                >
                  <Avatar src={customer.avatar || undefined} />

                  <Box flexGrow={1}>
                    <Typography variant="subtitle2" sx={{ color: 'text.primary', mb: 1 }}>
                      {customer.customerName}
                    </Typography>

                    <Stack spacing={1}>
                      {customer.programs.map((program, index) => (
                        <Stack
                          key={index}
                          direction="row"
                          alignItems="center"
                          spacing={1}
                          flexWrap="wrap"
                        >
                          <Chip
                            icon={getProgramIcon(program.programType)}
                            label={getProgramLabel(program.programType)}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem', height: 22 }}
                          />

                          <Chip
                            icon={<AccessTimeOutlinedIcon />}
                            label={getDaysLabel(program.daysUntilExpiration)}
                            color={getSeverityColor(program.daysUntilExpiration)}
                            size="small"
                            sx={{ fontSize: '0.75rem', height: 22 }}
                          />

                          <Typography variant="caption" color="text.secondary">
                            Venc: {fDate(program.endDate)}
                          </Typography>
                        </Stack>
                      ))}
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
