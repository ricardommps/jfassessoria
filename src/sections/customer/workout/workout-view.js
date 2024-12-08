import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import LoadingProgress from 'src/components/loading-progress';
import { useResponsive } from 'src/hooks/use-responsive';
import useWorkout from 'src/hooks/use-workout';

import WorkoutItem from './workout-item';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function WorkoutView({ open, onClose, workoutId }) {
  const smDown = useResponsive('down', 'sm');
  const { onGetWorkout, workout } = useWorkout();

  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    if (workout?.id === workoutId) return;
    setLoading(true); // Indica que o processo está em execução
    try {
      await onGetWorkout(workoutId);
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
        <Box
          sx={{
            width: '375px', // Largura típica de uma tela de smartphone
            height: '667px', // Altura típica de uma tela de smartphone
            margin: 'auto',
            border: '1px solid #ccc',
            borderRadius: '16px',
            overflow: 'hidden',
            boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
            position: 'relative',
          }}
        >
          <Container
            sx={{
              height: 'calc(667px - 24px - 56px)', // Altura total menos a barra superior e inferior
              overflowY: 'auto',
              padding: '16px',
              textAlign: 'center',
            }}
          >
            <WorkoutItem workout={workout} />
          </Container>
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
