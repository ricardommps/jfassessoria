import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import DialogProvider from 'src/app/context/dialog-provider';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify/iconify';
import LoadingProgress from 'src/components/loading-progress';
import ProgramInfo from 'src/components/program-info/program-info';
import TrainingVolume from 'src/components/training-volume/trainingVolume';
import { useBoolean } from 'src/hooks/use-boolean';
import useFinished from 'src/hooks/use-finished';
import useWorkout from 'src/hooks/use-workout';

import SendTraining from './send-training/send-training';
import CreateTraining from './training-form/create-training';
import TrainingItem from './training-item';
export default function TrainingList({
  loading,
  trainings,
  trainingsStatus,
  handleClose,
  program,
  refreshList,
}) {
  const { type, vs2 } = program;
  const create = useBoolean();
  const confirm = useBoolean();
  const programInfo = useBoolean();
  const volume = useBoolean();
  const { onSendTraining } = useWorkout();
  const { onClearVolumeState } = useFinished();

  const [openSend, setOpenSend] = useState({
    open: false,
    training: null,
  });
  const [action, setAction] = useState({
    title: null,
    message: null,
    training: null,
  });

  const [sendLoading, setSendLoading] = useState(false);

  const [programsIdSelected, setProgramsIdSelected] = useState([]);

  const handleCloseCreate = () => {
    create.onFalse();
  };

  const handleSuccessCreate = () => {
    create.onFalse();
    refreshList();
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

  const handleOpenSend = (training, event) => {
    event.stopPropagation();
    setOpenSend({
      open: true,
      training: training,
    });
  };

  const onConfirmSend = useCallback(async () => {
    confirm.onFalse();

    try {
      setSendLoading(true);
      const payload = {
        workoutId: openSend.training.id,
        programsId: [...programsIdSelected],
      };
      await onSendTraining(payload);

      enqueueSnackbar('Treino enviado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Não foi possível executar esta operação. Tente novamente mais tarde!', {
        autoHideDuration: 8000,
        variant: 'error',
      });
    } finally {
      setSendLoading(false);
      setAction(null);
      setProgramsIdSelected([]);
      refreshList();
      setOpenSend({
        open: false,
        training: null,
      });
    }
  }, [openSend, onSendTraining, programsIdSelected]);

  const handleSendTraining = useCallback(() => {
    confirm.onTrue();
    setAction({
      title: 'Enviar',
      message: 'Tem certeza que deseja enviar esse treino para outros programas?',
      training: openSend.training,
    });
  }, []);

  const initialize = useCallback(async () => {
    try {
      onClearVolumeState();
    } catch (error) {
      console.error(error);
    }
  }, [program.id]);

  useEffect(() => {
    if (program.id) {
      initialize();
    }
  }, [program.id, initialize]);

  return (
    <>
      <DialogProvider>
        <Box>
          {loading ? (
            <LoadingProgress />
          ) : (
            <>
              <Box p={2}>
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-start',
                  }}
                >
                  <Button variant="contained" sx={{ mb: 2 }} onClick={handleClose}>
                    Fechar
                  </Button>
                  {type === 1 && (
                    <Button variant="contained" sx={{ mb: 2 }} onClick={volume.onTrue}>
                      Volume
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="mingcute:add-line" />}
                    sx={{ mb: 2 }}
                    onClick={create.onTrue}
                  >
                    Novo treino
                  </Button>
                </Stack>
                <Box pb={2}>
                  <Alert variant="outlined" severity="info" onClick={programInfo.onTrue}>
                    Informações do programa
                  </Alert>
                </Box>
                <Stack spacing={2}>
                  {(!trainingsStatus.loading || !loading) &&
                    !trainingsStatus.empty &&
                    trainings && (
                      <>
                        {trainings?.map((training) => (
                          <TrainingItem
                            key={training.id}
                            training={training}
                            program={program}
                            refreshList={refreshList}
                            handleSuccessCreate={handleSuccessCreate}
                            handleOpenSend={handleOpenSend}
                          />
                        ))}
                      </>
                    )}
                </Stack>
              </Box>
              {create.value && (
                <CreateTraining
                  open={create.value}
                  program={program}
                  onClose={handleCloseCreate}
                  handleSuccessCreate={handleSuccessCreate}
                />
              )}

              {openSend?.open && (
                <SendTraining
                  open={openSend.open}
                  onClose={handleCloseSend}
                  training={openSend.training}
                  onSelectProgram={handleSelectProgram}
                  handleSendTraining={handleSendTraining}
                  loading={sendLoading}
                  programsIdSelected={programsIdSelected}
                  type={type}
                  vs2={vs2}
                />
              )}
              {volume.value && (
                <TrainingVolume
                  open={volume.value}
                  onClose={volume.onFalse}
                  programId={program.id}
                  customerId={program.customerId}
                />
              )}
              <ConfirmDialog
                open={confirm.value}
                onClose={confirm.onFalse}
                title={action?.title}
                content={action?.message}
                action={
                  <Button variant="contained" color="success" onClick={onConfirmSend}>
                    Confirmar
                  </Button>
                }
              />
            </>
          )}
        </Box>
      </DialogProvider>
      {programInfo.value && (
        <ProgramInfo open={programInfo.value} onClose={programInfo.onFalse} program={program} />
      )}
    </>
  );
}
