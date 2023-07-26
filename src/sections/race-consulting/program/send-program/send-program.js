import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify/iconify';

import CustomerList from './customer-list';

export default function SendProgram({
  open,
  onClose,
  program,
  onSelectCustomer,
  handleSendProgram,
  sendProgramStatus,
  ...other
}) {
  return (
    <Dialog
      sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
      maxWidth="xs"
      open={open}
      {...other}
    >
      <DialogTitle>
        <Stack alignItems="center" direction="column">
          <Stack alignItems="center" pb={2}>
            <Iconify icon="eva:people-outline" width={30} />
            <Typography>Selecione alunos para este programa</Typography>
            <Typography sx={{ fontWeight: 800 }}>{program?.name}</Typography>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <CustomerList onSelectCustomer={onSelectCustomer} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancelar
        </Button>
        <LoadingButton
          onClick={handleSendProgram}
          variant="contained"
          loading={sendProgramStatus.loading}
          fullWidth
        >
          Enviar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
