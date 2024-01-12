import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import EmptyContent from 'src/components/empty-content/empty-content';
import useFinishedTraining from 'src/hooks/use-finished-training';

import ReviewForm from './review-form';
import TrainingDetails from './training-details';
export default function Review({ currentTrainingId, handleCloseForm }) {
  const { onTrainingReview, trainingReviewStatus, trainingReview } = useFinishedTraining();

  useEffect(() => {
    if (currentTrainingId) {
      onTrainingReview(currentTrainingId);
    }
  }, [currentTrainingId]);

  useEffect(() => {
    if (trainingReviewStatus.error) {
      enqueueSnackbar(
        `Não foi possível executar esta operação. Tente novamente mais tarde. ${trainingReviewStatus.error}`,
        {
          autoHideDuration: 8000,
          variant: 'error',
        },
      );
    }
  }, [trainingReviewStatus]);

  return (
    <>
      {currentTrainingId && (
        <Stack
          sx={{
            minWidth: '50%',
            flexShrink: 0,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2, pb: 2 }}>
            <Button
              color="inherit"
              sx={{ mr: 1 }}
              startIcon={<ArrowCircleLeftIcon />}
              onClick={handleCloseForm}
            >
              Voltar
            </Button>
          </Box>
          <Stack>
            <TrainingDetails training={trainingReview} />
          </Stack>
        </Stack>
      )}
      <Stack
        spacing={2}
        component={Paper}
        variant="outlined"
        sx={{
          p: 2.5,
          minWidth: '50%',
          flexShrink: 0,
          borderRadius: 2,
          typography: 'body2',
          borderStyle: 'dashed',
        }}
      >
        <Stack spacing={0.5}>
          <Typography variant="h6">
            {!currentTrainingId ? 'Selecione um treino para feedback' : 'Feedback do treino'}
          </Typography>
        </Stack>

        {!currentTrainingId && (
          <EmptyContent
            imgUrl="/assets/icons/empty/ic_content.svg"
            sx={{
              borderRadius: 1.5,
              bgcolor: 'background.default',
            }}
          />
        )}
        {trainingReviewStatus.loading && (
          <Stack alignItems={'center'} height={200} justifyContent={'center'}>
            <CircularProgress />
          </Stack>
        )}
        {!trainingReviewStatus.loading && trainingReview && (
          <Stack>
            <ReviewForm training={trainingReview} handleCloseForm={handleCloseForm} />
          </Stack>
        )}
      </Stack>
    </>
  );
}
