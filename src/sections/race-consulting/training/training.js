import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useBoolean } from 'src/hooks/use-boolean';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';

import TrainingForm from '../training-form/training-form';
import SendTraining from './send-training/send-training';
import TrainingsList from './trainings-list';

export default function Training() {
  const { program } = useProgram();
  const confirm = useBoolean();
  const {
    training,
    trainingStatus,
    cloneTraining,
    onClearTraining,
    updateTrainingSuccess,
    onListTrainings,
    trainingCreate,
    sendTrainingSuccess,
    sendTrainingStatus,
    onSendTraining,
    deleteTraining,
  } = useTraining();

  const [programsIdSelected, setProgramsIdSelected] = useState([]);
  const [newTraining, setNewTraining] = useState(false);
  const [openSend, setOpenSend] = useState({
    open: false,
    training: null,
  });

  const [action, setAction] = useState({
    title: null,
    message: null,
    training: null,
  });

  const handleOpenSend = (training, event) => {
    event.stopPropagation();
    setOpenSend({
      open: true,
      training: training,
    });
  };

  const handleCloseSend = () => {
    setProgramsIdSelected([]);
    setOpenSend({
      open: false,
      training: null,
    });
  };

  const handleSelectProgram = useCallback(
    (inputValue) => {
      const newSelected = programsIdSelected.includes(inputValue)
        ? programsIdSelected.filter((value) => value !== inputValue)
        : [...programsIdSelected, inputValue];

      setProgramsIdSelected(newSelected);
    },
    [programsIdSelected],
  );

  const handleNewTraining = () => {
    setNewTraining(true);
    onClearTraining();
  };

  const handleCancel = () => {
    setNewTraining(false);
    onClearTraining();
    setOpenSend(null);
    setProgramsIdSelected([]);
  };

  const handleSendTraining = useCallback(() => {
    confirm.onTrue();
    setAction({
      title: 'Enviar',
      message: 'Tem certeza que deseja enviar esse treino para outros programas?',
      training: openSend.training,
    });
  }, []);

  const onConfirmSendProgram = () => {
    confirm.onFalse();
    setAction(null);
    setProgramsIdSelected([]);
    const payload = Object.assign({}, openSend.training);
    delete payload.id;
    delete payload.programId;
    payload.programsId = [...programsIdSelected];
    payload.name = `[SEND-COPY]${payload.name}`;
    onSendTraining(payload);
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
      enqueueSnackbar('Treino criado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [trainingCreate]);

  useEffect(() => {
    if (cloneTraining) {
      onListTrainings(program.id);
      enqueueSnackbar('Treino clonado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [cloneTraining]);

  useEffect(() => {
    if (sendTrainingSuccess) {
      setNewTraining(false);
      onListTrainings(program.id);
      enqueueSnackbar(
        sendTrainingSuccess.status === 200
          ? 'Programa enviado com sucesso!'
          : 'Falha ao enviar programa',
        {
          autoHideDuration: 3000,
          variant: sendTrainingSuccess.status === 200 ? 'success' : 'error',
        },
      );
      handleCancel();
    }
  }, [sendTrainingSuccess]);

  useEffect(() => {
    if (deleteTraining) {
      onListTrainings(program.id);
      enqueueSnackbar('Treino deletado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [deleteTraining]);

  return (
    <>
      <Paper
        id="training"
        sx={{
          px: 2,
          borderRadius: 2,
          bgcolor: 'background.neutral',
        }}
      >
        {program && (
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
                      <TrainingsList
                        programId={program?.id}
                        handleOpenSend={handleOpenSend}
                        sendTrainingStatus={sendTrainingStatus}
                      />
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
        )}
      </Paper>
      {openSend?.open && (
        <SendTraining
          open={openSend.open}
          onClose={handleCloseSend}
          training={openSend.training}
          onSelectProgram={handleSelectProgram}
          handleSendTraining={handleSendTraining}
          sendTrainingStatus={sendTrainingStatus}
          programsIdSelected={programsIdSelected}
        />
      )}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={action?.title}
        content={action?.message}
        action={
          <Button variant="contained" color="success" onClick={onConfirmSendProgram}>
            Confirmar
          </Button>
        }
      />
    </>
  );
}
