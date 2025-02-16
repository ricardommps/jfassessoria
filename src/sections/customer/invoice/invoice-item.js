import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { PDFViewer } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';

import InvoicePDF from './invoice-pdf';
// {format(new Date(date_published), 'dd MMM yyyy')}
export default function InvoiceItem({
  invoice,
  customer,
  setInvoiceSelected,
  setLoading,
  loading,
  onDeleteInvoice,
  handleSuccess,
  handleSendNotification,
  notification,
}) {
  const popover = usePopover();
  const view = useBoolean();
  const onDelete = useBoolean();

  const [messageInvoice, setMessageInvoice] = useState(
    'Seu comprovante de pagamento já está disponivel',
  );
  const handleDelete = useCallback(async () => {
    try {
      setLoading(true);
      onDelete.onFalse();
      await onDeleteInvoice(invoice.id);
      enqueueSnackbar('Notificação deletada com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleSuccess();
    } catch (error) {
      enqueueSnackbar(`${error.message}`, {
        autoHideDuration: 8000,
        variant: 'error',
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [invoice.id]);

  const renderStatus = () => {
    switch (invoice.status) {
      case 'paid':
        return (
          <Label variant="soft" color={'success'}>
            Pago
          </Label>
        );
      case 'pending':
        return (
          <Label variant="soft" color={'warning'}>
            Pendente
          </Label>
        );
      case 'overdue':
        return (
          <Label variant="soft" color={'error'}>
            Atrasado
          </Label>
        );
      case 'draft':
        return (
          <Label variant="soft" color={'info'}>
            Rascunho
          </Label>
        );
      default:
        <Label variant="soft">-</Label>;
    }
  };
  return (
    <>
      <Stack component={Card} direction="row">
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
            width: '100%',
          }}
        >
          <Stack direction="row" pb={2}>
            <Box flexGrow={1}>{renderStatus()}</Box>
          </Stack>
          <Stack spacing={1} flexGrow={1}>
            <Box component="span" sx={{ typography: 'subtitle2' }}>
              {`Número:  ${invoice.invoiceNumber || '-'}`}
            </Box>
            <Box component="span" sx={{ typography: 'subtitle2' }}>
              {`Valor:  ${invoice.totalAmount || '-'}`}
            </Box>
            <Box component="span" sx={{ typography: 'subtitle2' }}>
              {`Vencimento:  ${format(new Date(invoice.dueDate), 'dd/MM/yyyy')}`}
            </Box>
            <Box component="span" sx={{ typography: 'subtitle2' }}>
              {`Descrição: ${invoice.description || '-'}`}
            </Box>
          </Stack>
        </Stack>
        <IconButton onClick={popover.onOpen} sx={{ position: 'absolute', top: 8, right: 8 }}>
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton>
        <CustomPopover
          open={popover.open}
          onClose={popover.onClose}
          arrow="center-top"
          sx={{ width: 300 }}
        >
          <MenuItem
            onClick={() => {
              setInvoiceSelected(invoice);
              popover.onClose();
            }}
          >
            <Iconify icon="solar:pen-bold" />
            Editar
          </MenuItem>

          <MenuItem
            onClick={() => {
              view.onTrue();
              popover.onClose();
            }}
          >
            <Iconify icon="iconamoon:send-fill" />
            Ver comprovante
          </MenuItem>
          {invoice.status === 'paid' && (
            <MenuItem
              onClick={() => {
                notification.onTrue();
                popover.onClose();
              }}
            >
              <Iconify icon="mdi:add-alert" />
              Enviar notificação de pagamento
            </MenuItem>
          )}

          <MenuItem
            onClick={() => {
              onDelete.onTrue();
              popover.onClose();
            }}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
            Deletar
          </MenuItem>
        </CustomPopover>
      </Stack>
      <Dialog fullScreen open={view.value}>
        <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
          <DialogActions
            sx={{
              p: 1.5,
            }}
          >
            <Button color="inherit" variant="contained" onClick={view.onFalse}>
              Fechar
            </Button>
          </DialogActions>

          <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <InvoicePDF invoice={invoice} customer={customer} />
            </PDFViewer>
          </Box>
        </Box>
      </Dialog>

      {onDelete.value && (
        <ConfirmDialog
          open={onDelete.value}
          onClose={onDelete.onFalse}
          title={'Deseja DELETAR a fatura?'}
          action={
            <LoadingButton
              variant="contained"
              color="success"
              onClick={handleDelete}
              loading={loading}
            >
              Confirmar
            </LoadingButton>
          }
        />
      )}

      <ConfirmDialog
        open={notification.value}
        onClose={notification.onFalse}
        title="Copiar"
        loading={loading}
        content={
          <Stack spacing={3}>
            <Typography variant="body2">Digite a Mensagem.</Typography>
            <TextField
              id="qnt-copy"
              label="Mensagem"
              variant="outlined"
              value={messageInvoice}
              multiline
              rows={6}
              onChange={(e) => {
                setMessageInvoice(e.target.value);
              }}
            />
          </Stack>
        }
        action={
          <LoadingButton
            variant="contained"
            color="success"
            onClick={() => handleSendNotification(messageInvoice, invoice)}
            loading={loading}
          >
            Confirmar
          </LoadingButton>
        }
      />
    </>
  );
}
