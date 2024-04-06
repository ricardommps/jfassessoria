'use client';

import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useCallback } from 'react';
import { useParams, useRouter } from 'src/routes/hook';
import Review from 'src/sections/race-consulting/training-review/review';
export default function FeedBackView() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const handleGoBack = useCallback(() => {
    router.back();
  }, []);
  if (id) {
    return (
      <Container maxWidth="md">
        <Card>
          <Stack
            spacing={3}
            alignItems={{ md: 'flex-start' }}
            direction={{ xs: 'column-reverse', md: 'row' }}
            sx={{ p: 3 }}
          >
            <Review currentTrainingId={id} handleCloseForm={handleGoBack} type="training" />
          </Stack>
        </Card>
      </Container>
    );
  }

  return null;
}
