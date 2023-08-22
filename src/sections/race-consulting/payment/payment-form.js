import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify/iconify';

import NewEditForm from './new-edit-form';

export default function PaymentForm({
  payment,
  newPayment,
  handleNewPayment,
  customerId,
  handleCancelPayment,
}) {
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
        <Typography variant="h6"> Renovar plano </Typography>
      </Stack>
      {!payment && !newPayment && (
        <Stack>
          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            sx={{ mb: 2, width: 'fit-content' }}
            onClick={handleNewPayment}
          >
            Novo Registro
          </Button>
        </Stack>
      )}
      {(payment || (!payment && newPayment)) && (
        <Stack sx={{ position: 'relative' }}>
          <NewEditForm
            payment={payment}
            customerId={customerId}
            handleCancelPayment={handleCancelPayment}
          />
        </Stack>
      )}
    </Stack>
  );
}
