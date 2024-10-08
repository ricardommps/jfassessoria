import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { useTablePvContext } from 'src/components/drawer-table-pv';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useBoolean } from 'src/hooks/use-boolean';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';
import { extrapolation } from 'src/utils/extrapolation';
import { paceFormater } from 'src/utils/format-number';

import TrainingForm from '../training-form/training-form';
import SendTraining from './send-training/send-training';
import TrainingsList from './trainings-list';

export default function Training() {
  const tablePv = useTablePvContext();
  const { program } = useProgram();
  const confirm = useBoolean();
  const {
    training,
    trainingStatus,
    cloneTraining,
    onClearTraining,
    updateTrainingSuccess,
    onTrainingsList,
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

  const [currentExtrapolation, setCurrentExtrapolation] = useState(null);

  const refreshList = useCallback(() => {
    onTrainingsList(program.id);
  }, [program]);

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
    tablePv.onClose;
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
    const payload = {
      trainingId: openSend.training.id,
      programsId: [...programsIdSelected],
    };
    onSendTraining(payload);
  };

  useEffect(() => {
    if (updateTrainingSuccess) {
      refreshList();
      enqueueSnackbar('Update success!', { autoHideDuration: 3000, variant: 'success' });
      handleCancel();
    }
  }, [updateTrainingSuccess]);

  useEffect(() => {
    if (trainingCreate) {
      refreshList();
      enqueueSnackbar('Treino criado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [trainingCreate]);

  useEffect(() => {
    if (cloneTraining) {
      refreshList();
      enqueueSnackbar('Treino clonado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [cloneTraining]);

  useEffect(() => {
    if (sendTrainingSuccess) {
      setNewTraining(false);
      refreshList();
      enqueueSnackbar(
        sendTrainingSuccess.status === 200
          ? 'Programa enviado com sucesso!'
          : 'Falha ao enviar programa',
        {
          autoHideDuration: 8000,
          variant: sendTrainingSuccess.status === 200 ? 'success' : 'error',
        },
      );
      handleCancel();
    }
  }, [sendTrainingSuccess]);

  useEffect(() => {
    if (deleteTraining) {
      refreshList();
      enqueueSnackbar('Treino deletado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [deleteTraining]);

  useEffect(() => {
    if (program) {
      const resultValue = extrapolation[program.pv];
      setCurrentExtrapolation(resultValue);
    }
  }, [program]);

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
              <Typography variant="h3">Treinos</Typography>
              {(!program.type || program.type === 1) && (
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon id="expandMoreIcon" />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>Detalhes do programa</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="subtitle1" component="div">
                      {`Nome do programa: ${program?.name}`}
                    </Typography>
                    <Stack
                      component={m.div}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{
                        my: 0.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ textAlign: 'left', justifyContent: 'left', width: '35%' }}
                      >
                        <ListItemText
                          primary={'Pace: '}
                          primaryTypographyProps={{
                            typography: 'subtitle1',
                          }}
                          sx={{ flex: 'none' }}
                        />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          {paceFormater(program?.pace)}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0}>
                        <ListItemText
                          primary={'V02máx: '}
                          primaryTypographyProps={{
                            typography: 'subtitle1',
                          }}
                          sx={{ flex: 'none' }}
                        />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          {currentExtrapolation?.VO2}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      component={m.div}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{
                        my: 0.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ textAlign: 'left', justifyContent: 'left', width: '35%' }}
                      >
                        <ListItemText
                          primary={'Vla: '}
                          primaryTypographyProps={{
                            typography: 'subtitle1',
                          }}
                          sx={{ flex: 'none' }}
                        />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          {program.vla} km/h
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0}>
                        <ListItemText
                          primary={'Pace - Vla: '}
                          primaryTypographyProps={{
                            typography: 'subtitle1',
                          }}
                          sx={{ flex: 'none' }}
                        />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          {paceFormater(program.paceVla)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      component={m.div}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{
                        my: 0.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ textAlign: 'left', justifyContent: 'left', width: '35%' }}
                      >
                        <ListItemText
                          primary={'Vlan: '}
                          primaryTypographyProps={{
                            typography: 'subtitle1',
                          }}
                          sx={{ flex: 'none' }}
                        />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          {program.vlan} km/h
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={0}>
                        <ListItemText
                          primary={'Pace - Vlan: '}
                          primaryTypographyProps={{
                            typography: 'subtitle1',
                          }}
                          sx={{ flex: 'none' }}
                        />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          {paceFormater(program.paceVlan)}
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack
                      component={m.div}
                      spacing={1}
                      direction="row"
                      alignItems="center"
                      sx={{
                        my: 0.5,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <Stack
                        direction="row"
                        sx={{ textAlign: 'left', justifyContent: 'left', width: '35%' }}
                      >
                        <ListItemText
                          primary={'FCM: '}
                          primaryTypographyProps={{
                            typography: 'subtitle1',
                          }}
                          sx={{ flex: 'none' }}
                        />
                        <Typography variant="subtitle2" sx={{ ml: 1 }}>
                          {program.fcmValue}
                        </Typography>
                      </Stack>
                    </Stack>
                  </AccordionDetails>
                </Accordion>
              )}
            </Stack>
            <Stack spacing={3} sx={{ width: '25vw', py: 1, height: 'calc(100vh - 340px)' }}>
              <Scrollbar>
                {!training && !newTraining && (
                  <>
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="mingcute:add-line" />}
                      sx={{ mb: 2, ml: 4 }}
                      onClick={handleNewTraining}
                    >
                      Novo
                    </Button>
                    <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
                      <TrainingsList
                        programId={program?.id}
                        handleOpenSend={handleOpenSend}
                        sendTrainingStatus={sendTrainingStatus}
                        refreshList={refreshList}
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
