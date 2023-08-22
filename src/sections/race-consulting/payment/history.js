import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem, { timelineItemClasses } from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { addHours, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import EmptyContent from 'src/components/empty-content/empty-content';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import usePayment from 'src/hooks/use-payment';
import { formatCurrency } from 'src/utils/format-number';

export default function History({ customerId, handlePaymentSelected, handleCancelPayment }) {
  const {
    payments,
    paymentsStatus,
    onListPayments,
    paymentCreated,
    paymentError,
    updatePaymentSuccess,
    deletePaymentSuccess,
  } = usePayment();

  const checkExpiresDate = (dueDate, paymentDate) => {
    const currentDate = new Date().toISOString();
    const dueDateTimezone = addHours(new Date(dueDate), 3).toISOString();
    if (!paymentDate && dueDateTimezone < currentDate) {
      return true;
    }
    return false;
  };

  const initialize = useCallback(async () => {
    try {
      onListPayments(customerId);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, []);

  useUpdateEffect(() => {
    if (paymentCreated) {
      initialize();
      enqueueSnackbar('Operação registrada com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleCancelPayment();
    }
  }, [paymentCreated]);

  useUpdateEffect(() => {
    if (updatePaymentSuccess) {
      initialize();
      enqueueSnackbar('Registro atualizado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleCancelPayment();
    }
  }, [updatePaymentSuccess]);

  useUpdateEffect(() => {
    if (deletePaymentSuccess) {
      initialize();
      enqueueSnackbar('Registro deletado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleCancelPayment();
    }
  }, [deletePaymentSuccess]);

  useUpdateEffect(() => {
    if (paymentError) {
      initialize();
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
        autoHideDuration: 8000,
        variant: 'error',
      });
      handleCancelPayment();
    }
  }, [paymentError]);

  return (
    <Stack
      spacing={2}
      component={Paper}
      variant="outlined"
      sx={{
        p: 2.5,
        minWidth: '50%',
        flexShrink: 0,
        borderRadius: 2,
        typography: 'body2',
        borderStyle: 'dashed',
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h6"> Histórico </Typography>
      </Stack>
      <Timeline
        sx={{
          p: 0,
          m: 0,
          [`& .${timelineItemClasses.root}:before`]: {
            flex: 0,
            padding: 0,
          },
          height: '400px',
          maxHeight: '400px',
        }}
      >
        <Scrollbar>
          {paymentsStatus.empty ? (
            <EmptyContent
              imgUrl="/assets/icons/empty/ic_email_disabled.svg"
              sx={{
                borderRadius: 1.5,
                bgcolor: 'background.default',
              }}
            />
          ) : (
            <>
              {payments.map((item, index) => {
                const lastTimeline = index === payments.length - 1;
                return (
                  <TimelineItem
                    key={item.id}
                    onClick={() => handlePaymentSelected(item)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <TimelineSeparator>
                      <TimelineDot
                        color={
                          (checkExpiresDate(item.dueDate, item.paymentDate) && 'error') || 'success'
                        }
                      />
                      {lastTimeline ? null : <TimelineConnector />}
                    </TimelineSeparator>
                    <TimelineContent>
                      <Typography variant="subtitle2">
                        {format(new Date(item.startDate), 'MMMM/yyyy', { locale: ptBR })}
                      </Typography>

                      <Box sx={{ color: 'text.disabled', typography: 'caption', mt: 0.5 }}>
                        <Typography fontSize={'0.75rem'}>
                          {format(addHours(new Date(item.expiresDate), 3), 'dd/MM/yyyy')}
                        </Typography>
                        <Typography fontSize={'0.75rem'}>{formatCurrency(item.value)}</Typography>
                      </Box>
                    </TimelineContent>
                  </TimelineItem>
                );
              })}
            </>
          )}
        </Scrollbar>
      </Timeline>
    </Stack>
  );
}
