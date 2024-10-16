import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import TablePaceSpeed from 'src/components/table-pace-speed/table-pace-speed';

export default function DialogTablePaceSpeed({ open, onClose, actionType, handleTableSelected }) {
  const [value, setValue] = useState(null);

  const handleClick = (row) => {
    setValue(row);
  };
  const handleDelete = () => {
    setValue(null);
  };

  const handleSave = () => {
    if (actionType === 'vla' || actionType === 'vlan') {
      handleTableSelected(value.speed);
    } else {
      handleTableSelected(value.pace);
    }

    setValue(null);
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        <Stack
          pb={3}
          direction="column"
          spacing={2}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant="h6"> Tabela Pace/Km </Typography>
          {actionType && (
            <Stack direction="row">
              <Typography> Selecione um valor para o </Typography>
              <Typography fontWeight={'bold'}> &nbsp; {actionType.toUpperCase()}</Typography>
            </Stack>
          )}
          {value && (
            <Chip
              label={`${actionType.toUpperCase()}: ${
                actionType === 'vla' || actionType === 'vlan' ? value.speed : value.pace
              }`}
              color="success"
              variant="outlined"
              onDelete={handleDelete}
            />
          )}
        </Stack>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <TablePaceSpeed handleClick={handleClick} actionType={actionType} />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Fechar
        </Button>
        {value && (
          <Button variant="outlined" color="inherit" onClick={handleSave}>
            Salvar
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
