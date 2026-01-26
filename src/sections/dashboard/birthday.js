import CakeOutlinedIcon from '@mui/icons-material/CakeOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import MessageOutlinedIcon from '@mui/icons-material/MessageOutlined';
import SentimentSatisfiedAltOutlinedIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import {
  Avatar,
  Box,
  Card,
  CardHeader,
  Chip,
  CircularProgress,
  Divider,
  IconButton,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import useBirthdays from 'src/hooks/use-birthdays';
import { useBoolean } from 'src/hooks/use-boolean';

import NotificationDialog from './notification-dialog';

export default function Birthday({ ...other }) {
  const { onGetBirthdays, birthdays, birthdaysStatus } = useBirthdays();
  const { today = [], tomorrow = [], monthBirthdays = [], monthLabel } = birthdays;
  const { loading, error } = birthdaysStatus;

  const [customerSelected, setCustomerSelected] = useState(null);

  const notification = useBoolean();

  const hasAnyBirthday = today.length > 0 || tomorrow.length > 0 || monthBirthdays.length > 0;

  const handleCloseNotification = () => {
    setCustomerSelected(null);
    notification.onFalse();
  };

  useEffect(() => {
    onGetBirthdays();
  }, [onGetBirthdays]);

  useEffect(() => {
    if (customerSelected) {
      notification.onTrue();
    }
  }, [customerSelected]);
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
        <CardHeader title={`ANIVERSARIANTES DO MÊS DE ${monthLabel ?? ''}`} sx={{ mb: 1 }} />

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
          {loading && (
            <Stack alignItems="center" justifyContent="center" sx={{ height: '100%' }}>
              <CircularProgress size={28} />
            </Stack>
          )}

          {/* ERROR */}
          {!loading && error && (
            <Stack
              spacing={1}
              alignItems="center"
              justifyContent="center"
              sx={{ height: '100%', textAlign: 'center' }}
            >
              <Typography variant="subtitle2" color="error">
                Erro ao carregar aniversariantes
              </Typography>
            </Stack>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && !hasAnyBirthday && (
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
              <SentimentSatisfiedAltOutlinedIcon fontSize="large" />
              <Typography variant="subtitle2">Nenhum aniversariante encontrado</Typography>
              <Typography variant="caption">
                Não há aniversários hoje, amanhã ou neste mês.
              </Typography>
            </Stack>
          )}

          {/* CONTENT */}
          {!loading && !error && hasAnyBirthday && (
            <>
              {/* HOJE */}
              {today.length > 0 && (
                <Box>
                  <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                    <CakeOutlinedIcon color="success" />
                    <Chip label="Hoje" color="success" size="small" />
                  </Stack>

                  <Stack spacing={1}>
                    {today.map((user) => (
                      <Stack
                        key={user.id}
                        direction="row"
                        alignItems="center"
                        spacing={2}
                        sx={{
                          p: 1,
                          borderRadius: 1,
                          bgcolor: (theme) => `${theme.palette.success.main}14`,
                        }}
                      >
                        <Avatar src={user.avatarUrl} />
                        <Box flexGrow={1}>
                          <Typography variant="subtitle2" sx={{ color: 'text.primary' }}>
                            {user.name}
                          </Typography>
                        </Box>
                        <IconButton size="small" onClick={() => setCustomerSelected(user.id)}>
                          <MessageOutlinedIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    ))}
                  </Stack>
                </Box>
              )}

              {/* AMANHÃ */}
              {tomorrow.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Chip label="Amanhã" color="info" size="small" sx={{ mb: 1 }} />
                    <Stack spacing={1}>
                      {tomorrow.map((user) => (
                        <Stack key={user.id} direction="row" alignItems="center" spacing={2}>
                          <Avatar src={user.avatarUrl} />
                          <Box flexGrow={1}>
                            <Typography variant="subtitle2">{user.name}</Typography>
                          </Box>
                          <IconButton size="small">
                            <MessageOutlinedIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      ))}
                    </Stack>
                  </Box>
                </>
              )}

              {/* ESTE MÊS */}
              {monthBirthdays.length > 0 && (
                <>
                  <Divider />
                  <Box>
                    <Stack direction="row" alignItems="center" spacing={1} mb={1}>
                      <CalendarMonthOutlinedIcon fontSize="small" />
                      <Typography variant="subtitle2">Aniversariantes</Typography>
                    </Stack>

                    <Stack spacing={0.5} pl={1}>
                      {monthBirthdays.map((item) => (
                        <Typography key={item.id} variant="body2" color="text.primary">
                          <strong>{item.day}</strong> • {item.name}
                        </Typography>
                      ))}
                    </Stack>
                  </Box>
                </>
              )}
            </>
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
