'use client';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect } from 'react';
import EmptyContent from 'src/components/empty-content';
import Iconify from 'src/components/iconify';
import LoadingProgress from 'src/components/loading-progress';
import useNotifications from 'src/hooks/use-notifications';
import { RouterLink } from 'src/routes/components';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import NotificationList from '../notification-list';

export default function NotificationListView() {
  const router = useRouter();
  const params = useParams();
  const { onGetNotifications, notifications, notificationsStatus } = useNotifications();
  const { id } = params;

  const renderList = (
    <>
      {notifications.length > 0 && (
        <>
          {notifications.map((notification, index) => (
            <React.Fragment key={`${notification.id}-${index}`}>
              <NotificationList notification={notification} id={id} />
            </React.Fragment>
          ))}
        </>
      )}
    </>
  );

  const handleGoBack = useCallback(() => {
    router.back();
  }, []);

  useEffect(() => {
    if (id) {
      onGetNotifications(id);
    }
  }, [id]);

  return (
    <Container maxWidth={'lg'} sx={{ height: 1 }}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 2 }}>
        <Button
          color="inherit"
          sx={{ mr: 1 }}
          startIcon={<ArrowCircleLeftIcon />}
          onClick={handleGoBack}
        >
          Voltar
        </Button>
      </Box>
      <Stack direction={'row'}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Notificações
        </Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.notification.create(id)}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Nova
        </Button>
      </Stack>
      <Box p={6}>
        {notificationsStatus.loading ? (
          <LoadingProgress />
        ) : (
          <>
            {notificationsStatus.empty ? (
              <EmptyContent
                imgUrl="/assets/icons/empty/ic_content.svg"
                sx={{
                  borderRadius: 1.5,
                  bgcolor: 'background.default',
                  height: '50vh',
                }}
                title="Nenhuma notificação"
              />
            ) : (
              <Box
                gap={3}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  md: 'repeat(2, 1fr)',
                }}
              >
                <>{renderList}</>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
}
