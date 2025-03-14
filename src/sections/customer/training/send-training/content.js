import LoadingButton from '@mui/lab/LoadingButton';
import Button from '@mui/material/Button';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { memo } from 'react';
import Iconify from 'src/components/iconify/iconify';

import CustomerProgramList from './customer-program-list';

export const Content = memo(
  ({
    training,
    onSelectProgram,
    type,
    vs2,
    onClose,
    handleSendTraining,
    loading,
    programsIdSelected,
  }) => (
    <>
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
        <CustomerProgramList onSelectProgram={onSelectProgram} type={type} vs2={vs2} />
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
    </>
  ),
);
