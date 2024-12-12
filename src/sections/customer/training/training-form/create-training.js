import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import LoadingProgress from 'src/components/loading-progress';
import { useResponsive } from 'src/hooks/use-responsive';
import useWorkout from 'src/hooks/use-workout';

import TrainingForm from './training-form';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CreateTraining({
  open,
  trainingId,
  onClose,
  handleSuccessCreate,
  program,
}) {
  const smDown = useResponsive('down', 'sm');

  const { onCreateWorkout, onGetWorkout, workout, onUpdateWorkout } = useWorkout();

  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      await onGetWorkout(trainingId);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [trainingId]);

  const FeedBackContent = () => (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Criar treino
          </Typography>
        </Toolbar>
      </AppBar>

      <Box p={2} sx={{ overflowX: 'hidden' }}>
        {loading && <LoadingProgress />}
        {!loading && !trainingId && (
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TrainingForm
              onUpdateTraining={onUpdateWorkout}
              onCreateTraining={onCreateWorkout}
              program={program}
              handleSuccessCreate={handleSuccessCreate}
              onClose={onClose}
            />
          </Stack>
        )}
        {!loading && workout && (
          <Stack spacing={3} sx={{ pt: 1 }}>
            <TrainingForm
              training={workout}
              onUpdateTraining={onUpdateWorkout}
              onCreateTraining={onCreateWorkout}
              program={program}
              handleSuccessCreate={handleSuccessCreate}
              onClose={onClose}
            />
          </Stack>
        )}
      </Box>
    </>
  );

  useEffect(() => {
    if (trainingId) {
      initialize();
    }
  }, [trainingId, initialize]);

  if (smDown) {
    return (
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <FeedBackContent />
      </Dialog>
    );
  }
  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <FeedBackContent />
    </Dialog>
  );
}
