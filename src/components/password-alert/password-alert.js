import { useTheme } from '@emotion/react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

export default function PasswordAlert() {
  const theme = useTheme();
  const { user } = useAuthContext();
  const router = useRouter();

  const [open, setOpen] = useState(user?.temporaryPassword);

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickItem = () => {
    router.push(paths.dashboard.security);
    setOpen(false);
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: theme.transitions.duration.shortest - 80,
      }}
    >
      <DialogTitle>Atenção</DialogTitle>
      <DialogContent>
        <Typography sx={{ mb: 3 }}>A sua senha é temporária e precisa ser atualizada.</Typography>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" color="error" onClick={handleClose}>
          Não atualizar agora
        </Button>
        <Button variant="contained" color="warning" onClick={handleClickItem}>
          Atualizar agora
        </Button>
      </DialogActions>
    </Dialog>
  );
}
