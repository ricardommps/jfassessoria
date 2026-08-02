import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { Fragment, useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import LoadingProgress from 'src/components/loading-progress';
import { useBoolean } from 'src/hooks/use-boolean';
import useInvoice from 'src/hooks/use-invoice';
import useNotifications from 'src/hooks/use-notifications';

import InvoiceForm from '../forms/invoice-form';
import InvoiceItem from './invoice-item';

const PAYMENT_NOTIFICATION_MESSAGE = 'Seu comprovante de pagamento já está disponivel';

function buildInvoiceNotificationPayload(
  customerId,
  invoice,
  message = PAYMENT_NOTIFICATION_MESSAGE,
) {
  return {
    recipientId: customerId,
    title: 'Olá',
    content: message,
    type: 'invoice',
    link: `/invoice/download/${invoice.id}`,
    metadata: {
      invoiceId: invoice.id,
    },
  };
}

export default function Invoice({ customer, loading, setLoading }) {
  const customerId = customer?.id ?? null;
  const { invoices, onGetInvoices, onCreateAndEditInvoice, onDeleteInvoice } = useInvoice();
  const { onCreateAndEdit } = useNotifications();
  const openForm = useBoolean();
  const notification = useBoolean();

  const [invoiceSelected, setInvoiceSelected] = useState();

  const initialize = useCallback(async () => {
    if (!customerId) {
      return;
    }

    setLoading(true);
    try {
      await onGetInvoices(customerId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [customerId, onGetInvoices, setLoading]);

  const handleClose = () => {
    openForm.onFalse();
    setInvoiceSelected(null);
  };

  const handleSuccess = () => {
    openForm.onFalse();
    notification.onFalse();
    setInvoiceSelected(null);
    initialize();
  };

  const handleSalve = useCallback(
    async (data) => {
      if (!customerId) {
        return;
      }

      setLoading(true);
      try {
        const payload = Object.assign({}, data);
        const previousStatus = invoiceSelected?.status ?? null;
        payload.customerId = customerId;

        const savedInvoice = payload.id
          ? await onCreateAndEditInvoice(payload, payload.id)
          : await onCreateAndEditInvoice(payload);

        const shouldSendPaymentNotification =
          payload.status === 'paid' && previousStatus !== 'paid';

        if (shouldSendPaymentNotification) {
          const notificationInvoice = savedInvoice?.id
            ? savedInvoice
            : { ...payload, id: payload.id };

          if (notificationInvoice?.id) {
            try {
              await onCreateAndEdit(
                buildInvoiceNotificationPayload(customerId, notificationInvoice),
              );
            } catch (notificationError) {
              console.error(notificationError);
              enqueueSnackbar(
                'Fatura salva, mas não foi possível enviar a notificação de pagamento.',
                {
                  autoHideDuration: 8000,
                  variant: 'warning',
                },
              );
              await onGetInvoices(customerId);
              return;
            }
          }
        }

        await onGetInvoices(customerId);

        enqueueSnackbar(
          shouldSendPaymentNotification
            ? 'Fatura salva e notificação enviada com sucesso!'
            : 'Fatura salva com sucesso!',
          {
            autoHideDuration: 8000,
            variant: 'success',
          },
        );
      } catch (error) {
        enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
          autoHideDuration: 8000,
          variant: 'error',
        });
      } finally {
        setLoading(false);
        handleClose();
      }
    },
    [
      customerId,
      invoiceSelected?.status,
      onCreateAndEdit,
      onCreateAndEditInvoice,
      onGetInvoices,
      setLoading,
    ],
  );

  const handleSendNotification = useCallback(
    async (message, invoice) => {
      if (!customerId) {
        return;
      }

      setLoading(true);
      try {
        await onCreateAndEdit(buildInvoiceNotificationPayload(customerId, invoice, message));
        enqueueSnackbar('Notificação enviada com sucesso!', {
          autoHideDuration: 8000,
          variant: 'success',
        });
      } catch (error) {
        enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde.', {
          autoHideDuration: 8000,
          variant: 'error',
        });
      } finally {
        setLoading(false);
        handleSuccess();
      }
    },
    [customerId, onCreateAndEdit, setLoading],
  );

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    if (invoiceSelected) {
      openForm.onTrue();
    }
  }, [invoiceSelected]);

  return (
    <>
      <Stack direction={'row'} sx={{ my: 5 }}>
        <Typography variant="h4" sx={{ flex: 1 }}>
          Faturas
        </Typography>
        {!openForm.value && (
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={openForm.onTrue}
          >
            Nova
          </Button>
        )}
      </Stack>
      {loading && <LoadingProgress />}
      {!openForm.value && (
        <Box>
          <>
            {!loading && invoices.length > 0 && (
              <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                  md: 'repeat(3, 1fr)',
                }}
              >
                {invoices.map((invoice) => (
                  <Fragment key={invoice.id}>
                    <InvoiceItem
                      invoice={invoice}
                      customer={customer}
                      setInvoiceSelected={setInvoiceSelected}
                      setLoading={setLoading}
                      loading={loading}
                      onDeleteInvoice={onDeleteInvoice}
                      handleSuccess={handleSuccess}
                      handleSendNotification={handleSendNotification}
                      notification={notification}
                    />
                  </Fragment>
                ))}
              </Box>
            )}
          </>
        </Box>
      )}

      {openForm.value && (
        <Box>
          <InvoiceForm
            invoice={invoiceSelected}
            customerId={customerId}
            setLoading={setLoading}
            loading={loading}
            onCancel={handleClose}
            onSalve={handleSalve}
          />
        </Box>
      )}
    </>
  );
}
