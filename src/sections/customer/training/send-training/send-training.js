import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify/iconify';

import ProgramsList from './programs-list';
export default function SendTraining({
  open,
  onClose,
  training,
  onSelectProgram,
  handleSendTraining,
  loading,
  programsIdSelected,
  type,
  vs2,
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
            <Typography>Selecione programas para este treino</Typography>
            <Typography sx={{ fontWeight: 800 }}>{training.name}</Typography>
          </Stack>
        </Stack>
      </DialogTitle>
      <DialogContent dividers>
        <ProgramsList onSelectProgram={onSelectProgram} type={type} vs2={vs2} />
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancelar
        </Button>
        <LoadingButton
          onClick={handleSendTraining}
          variant="contained"
          loading={loading}
          disabled={programsIdSelected.length === 0}
          color="success"
        >
          Enviar
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}
