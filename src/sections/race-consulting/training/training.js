import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';

import TrainingForm from '../training-form/training-form';
import TrainingsList from './trainings-list';

export default function Training() {
  const { program } = useProgram();
  const {
    training,
    trainingStatus,
    onClearTraining,
    updateTrainingSuccess,
    onListTrainings,
    trainingCreate,
  } = useTraining();

  const [newTraining, setNewTraining] = useState(false);

  const handleNewTraining = () => {
    setNewTraining(true);
    onClearTraining();
  };

  const handleCancel = () => {
    setNewTraining(false);
    onClearTraining();
  };

  useEffect(() => {
    if (updateTrainingSuccess) {
      onListTrainings(program.id);
      enqueueSnackbar('Update success!', { autoHideDuration: 3000, variant: 'success' });
      handleCancel();
    }
  }, [updateTrainingSuccess]);

  useEffect(() => {
    if (trainingCreate) {
      onListTrainings(program.id);
      enqueueSnackbar('Programa criado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [trainingCreate]);

  return (
    <Paper
      id="training"
      sx={{
        px: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack>
        <Stack p={2}>
          <Typography variant="h3">Treinamentos</Typography>
          <Typography variant="h6" component="div">
            {program?.name}
          </Typography>
        </Stack>
        <Stack spacing={3} sx={{ width: '25vw', py: 1, height: 'calc(100vh - 340px)' }}>
          <Scrollbar>
            {!training && !newTraining && (
              <>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  sx={{ mb: 2 }}
                  onClick={handleNewTraining}
                >
                  Novo
                </Button>
                <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
                  <TrainingsList />
                </Stack>
              </>
            )}
            {trainingStatus?.loading && (
              <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
                <Box
                  sx={{
                    mt: 5,
                    width: 1,
                    height: 320,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress color="error" />
                </Box>
              </Stack>
            )}
            {(training || (!training && newTraining)) && (
              <Stack sx={{ px: 2, py: 2.5, position: 'relative' }}>
                <TrainingForm handleCancel={handleCancel} />
              </Stack>
            )}
          </Scrollbar>
        </Stack>
      </Stack>
    </Paper>
  );
}
