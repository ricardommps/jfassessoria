import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TablePaceSpeed from 'src/components/table-pace-speed/table-pace-speed';

export default function DialogTablePaceSpeed({ open, onClose, pace, paceVla, paceVlan }) {
  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>Tabela Pace/Km</DialogTitle>
      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <TablePaceSpeed pace={pace} paceVla={paceVla} paceVlan={paceVlan} />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={onClose}>
          Fechar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
