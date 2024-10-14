'use client';

// @mui
import Container from '@mui/material/Container';
import { useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import LoadingProgress from 'src/components/loading-progress';
import useNotifications from 'src/hooks/use-notifications';
// components
import { useParams, useRouter } from 'src/routes/hook';
// routes
import { paths } from 'src/routes/paths';

import NotificationNewEditForm from '../notification-new-edit-form';
export default function NotificationCreateView() {
  const router = useRouter();
  const params = useParams();
  const { id, notificationId } = params;
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
      router.push(paths.dashboard.customersRacing);
    }
  }, [id]);

  useEffect(() => {
    if (notification) {
      setLoading(false);
    }
  }, [notification]);
  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Criar novo Notificação"
        links={[
          {
            name: 'Alunos',
            href: paths.dashboard.customersRacing,
          },
          {
            name: 'Notificação',
            href: paths.dashboard.notification.root(id),
          },
          {
            name: 'Criar',
          },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {loading ? (
        <LoadingProgress />
      ) : (
        <NotificationNewEditForm recipientId={id} notification={notification} />
      )}
    </Container>
  );
}
