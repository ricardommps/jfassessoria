import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import LoadingProgress from 'src/components/loading-progress';
import useNotifications from 'src/hooks/use-notifications';
// components
import { useRouter } from 'src/routes/hook';
// routes
import NotificationNewEditForm from 'src/sections/notification/notification-new-edit-form';

export default function NotificationForm({ id, notificationId, onCancel, onSuccess }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { onGetNotification, notification } = useNotifications();
  useEffect(() => {
    if (notificationId) {
      setLoading(true);
      onGetNotification(notificationId);
    }
  }, [notificationId]);

  useEffect(() => {
    if (!id) {
      onCancel();
    }
  }, [id]);

  useEffect(() => {
    if (notification) {
      setLoading(false);
    }
  }, [notification]);
  return (
    <Box>
      {loading ? (
        <LoadingProgress />
      ) : (
        <NotificationNewEditForm
          recipientId={id}
          notification={notification}
          onCancel={onCancel}
          onSuccess={onSuccess}
        />
      )}
    </Box>
  );
}
