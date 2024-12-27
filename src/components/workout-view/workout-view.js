import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import LoadingProgress from 'src/components/loading-progress';
import { useResponsive } from 'src/hooks/use-responsive';
import useWorkout from 'src/hooks/use-workout';

import Workout from './workout';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function WorkoutView({ open, onClose, workoutId, customerId }) {
  const smDown = useResponsive('down', 'sm');
  const { onGetWorkoutFeedback, workout } = useWorkout();

  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    if (workout?.id === workoutId) return;
    setLoading(true); // Indica que o processo está em execução
    try {
      await onGetWorkoutFeedback(customerId, workoutId);
    } catch (error) {
      console.error('Erro durante a execução:', error);
    } finally {
      setLoading(false); // Finaliza o estado de carregamento
    }
  }, [workoutId, workout]);

  useEffect(() => {
    if (workoutId) {
      initialize();
    }
  }, [workoutId]);

  const WorkoutContent = () => (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Treino
          </Typography>
        </Toolbar>
      </AppBar>
      {loading && <LoadingProgress />}
      {!loading && workout && (
        <Box>
          <Workout workout={workout} />
        </Box>
      )}
    </>
  );
  if (smDown) {
    return (
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <WorkoutContent />
      </Dialog>
    );
  }
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <WorkoutContent />
    </Dialog>
  );
}
