import CloseIcon from '@mui/icons-material/Close';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import { forwardRef } from 'react';
import useNotifications from 'src/hooks/use-notifications';
import { useResponsive } from 'src/hooks/use-responsive';
import NotificationNewEditForm from 'src/sections/notification/notification-new-edit-form';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Notification({ open, onClose, recipientId }) {
  const theme = useTheme();
  const smDown = useResponsive('down', 'sm');
  const { onClearCreateNotification } = useNotifications();
  const handleClose = () => {
    onClose();
    onClearCreateNotification();
  };
  const handleSuccess = () => {
    onClose();
    onClearCreateNotification();
  };
  const NotificationContent = () => (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>Notificar novo treino</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ pt: 1, pb: 2, border: 'none' }}>
        <NotificationNewEditForm
          recipientId={recipientId}
          onCancel={handleClose}
          onSuccess={handleSuccess}
          type={'training'}
        />
      </DialogContent>
    </>
  );

  if (smDown) {
    return (
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <NotificationContent />
      </Dialog>
    );
  }
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <NotificationContent />
    </Dialog>
  );
}
