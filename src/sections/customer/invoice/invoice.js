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
export default function Invoice({ customer, loading, setLoading }) {
  const { invoices, onGetInvoices, onCreateAndEditInvoice, onDeleteInvoice } = useInvoice();
  const { onCreateAndEdit } = useNotifications();
  const openForm = useBoolean();

  const [invoiceSelected, setInvoiceSelected] = useState();

  const initialize = useCallback(async () => {
    setLoading(true);
    try {
      await onGetInvoices(customer.id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [customer.id]);

  const handleClose = () => {
    openForm.onFalse();
    setInvoiceSelected(null);
  };

  const handleSuccess = () => {
    openForm.onFalse();
    setInvoiceSelected(null);
    initialize();
  };

  const handleSalve = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const payload = Object.assign({}, data);
        payload.customerId = customer.id;
        if (payload.id) {
          await onCreateAndEditInvoice(payload, payload.id);
        } else {
          await onCreateAndEditInvoice(payload);
        }
        await onGetInvoices(customer.id);

        enqueueSnackbar('Fatura salva com sucesso!', {
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
        handleClose();
      }
    },
    [customer.id],
  );

  const handleSendNotification = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const payload = {
          recipientId: customer.id,
          ...data,
        };
        await onCreateAndEdit(payload);
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
        handleClose();
      }
    },
    [customer.id],
  );

  useEffect(() => {
    initialize();
  }, [initialize, customer.id]);

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
            customerId={customer.id}
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
