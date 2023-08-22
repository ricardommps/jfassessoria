import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { useState } from 'react';

import History from './history';
import PaymentForm from './payment-form';
export default function PaymentList({ open, onClose, customerId, ...other }) {
  const [paymentSelected, setPaymentSelected] = useState(null);
  const [newPayment, setNewPayment] = useState(false);
  const handleNewPayment = () => {
    setNewPayment(true);
    setPaymentSelected(null);
  };

  const handlePaymentSelected = (payment) => {
    setPaymentSelected(payment);
  };

  const handleCancelPayment = () => {
    setNewPayment(null);
    setPaymentSelected(null);
  };

  return (
    <Dialog fullWidth maxWidth="md" open={open} onClose={onClose} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        Planos
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 15,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 1, pb: 5, border: 'none' }}>
        <Card>
          <Stack
            spacing={3}
            alignItems={{ md: 'flex-start' }}
            direction={{ xs: 'column-reverse', md: 'row' }}
            sx={{ p: 3 }}
          >
            <History
              customerId={customerId}
              handlePaymentSelected={handlePaymentSelected}
              handleCancelPayment={handleCancelPayment}
            />
            <PaymentForm
              payment={paymentSelected}
              newPayment={newPayment}
              handleNewPayment={handleNewPayment}
              customerId={customerId}
              handleCancelPayment={handleCancelPayment}
            />
          </Stack>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
