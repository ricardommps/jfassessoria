import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import DialogProvider from 'src/app/context/dialog-provider';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { usePopover } from 'src/components/custom-popover';
import LoadingProgress from 'src/components/loading-progress';
import ProgramInfo from 'src/components/program-info/program-info';
import TrainingVolume from 'src/components/training-volume/trainingVolume';
import { useBoolean } from 'src/hooks/use-boolean';
import useWorkout from 'src/hooks/use-workout';

import Notification from './components/notification';
import TrainingListAction from './components/training-list-action';
import SendTraining from './send-training/send-training';
import CreateTrainingApp from './training-form/app/create-training-app';
import CreateTraining from './training-form/create-training';
import TrainingItem from './training-item';

export const NEW_OPTIONS = [
  {
    value: 1,
    label: 'Versão 1',
  },
  {
    value: 2,
    label: 'Versão app',
  },
];

export default function TrainingList({
  loading,
  trainings,
  trainingsStatus,
  handleClose,
  program,
  refreshList,
  workouts,
  workoutsNewStatus,
}) {
  const { type, vs2, customerId } = program;
  const create = useBoolean();
  const createApp = useBoolean();
  const confirm = useBoolean();
  const programInfo = useBoolean();
  const volume = useBoolean();
  const notification = useBoolean();
  const { onSendTraining } = useWorkout();

  const popover = usePopover();

  const [openSend, setOpenSend] = useState({
    open: false,
    training: null,
    v2: false,
  });
  const [action, setAction] = useState({
    title: null,
    message: null,
    training: null,
  });

  const [sendLoading, setSendLoading] = useState(false);

  const [programsIdSelected, setProgramsIdSelected] = useState([]);

  const handleOpenNotification = () => {
    notification.onTrue();
  };

  const handleCloseNotification = () => {
    notification.onFalse();
  };

  const handleCloseCreate = () => {
    create.onFalse();
    createApp.onFalse();
  };

  const handleSuccessCreate = () => {
    create.onFalse();
    createApp.onFalse();
    refreshList();
  };

  const handleCloseSend = () => {
    setProgramsIdSelected([]);
    setOpenSend({
      open: false,
      training: null,
      v2: false,
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

  const handleOpenSend = (training, v2, event) => {
    event.stopPropagation();
    setOpenSend({
      open: true,
      training: training,
      v2: v2,
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
      await onSendTraining(payload, openSend.v2);

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

  const handleOpenCreateTraining = (value) => {
    if (value === 1) {
      create.onTrue();
      createApp.onFalse();
    } else {
      createApp.onTrue();
      create.onFalse();
    }
  };

  return (
    <>
      <DialogProvider>
        <Box>
          {loading && <LoadingProgress />}
          {!loading && (
            <>
              <Box p={2}>
                <TrainingListAction
                  type={type}
                  volume={volume}
                  popover={popover}
                  programInfo={programInfo}
                  handleOpenCreateTraining={handleOpenCreateTraining}
                  handleClose={handleClose}
                  handleOpenNotification={handleOpenNotification}
                />
                <Stack spacing={2}>
                  {(!workoutsNewStatus.loading || !loading) &&
                    !workoutsNewStatus.empty &&
                    workouts && (
                      <>
                        {workouts?.map((training) => (
                          <TrainingItem
                            key={training.id}
                            training={training}
                            program={program}
                            refreshList={refreshList}
                            handleSuccessCreate={handleSuccessCreate}
                            handleOpenSend={handleOpenSend}
                            v2={true}
                          />
                        ))}
                      </>
                    )}

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
            </>
          )}
          {create.value && (
            <CreateTraining
              open={create.value}
              program={program}
              onClose={handleCloseCreate}
              handleSuccessCreate={handleSuccessCreate}
            />
          )}

          {createApp.value && (
            <CreateTrainingApp
              open={createApp.value}
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
        </Box>
      </DialogProvider>
      {programInfo.value && (
        <ProgramInfo open={programInfo.value} onClose={programInfo.onFalse} program={program} />
      )}
      {notification.value && (
        <Notification
          open={notification.value}
          onClose={handleCloseNotification}
          recipientId={customerId}
        />
      )}
    </>
  );
}
