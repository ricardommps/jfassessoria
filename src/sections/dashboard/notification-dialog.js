import { Box, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { forwardRef } from 'react';
import useNotifications from 'src/hooks/use-notifications';
import { useResponsive } from 'src/hooks/use-responsive';

import NotificationForm from '../customer/forms/notification-form';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function NotificationDialog({ open, onClose, customerId }) {
  const smDown = useResponsive('down', 'sm');
  const { onClearCreateNotification } = useNotifications();

  const handleSuccess = () => {
    onClearCreateNotification();
    onClose();
  };

  const NotificationContent = () => (
    <Box p={3}>
      <Typography variant="h4" sx={{ flex: 1 }}>
        Enviar Parabéns
      </Typography>
      <NotificationForm id={customerId} onCancel={onClose} onSuccess={handleSuccess} />
    </Box>
  );

  if (smDown) {
    return (
      <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
        <NotificationContent />
      </Dialog>
    );
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <NotificationContent />
    </Dialog>
  );
}
