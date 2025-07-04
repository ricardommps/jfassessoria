import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import DialogProvider from 'src/app/context/dialog-provider';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import LoadingProgress from 'src/components/loading-progress';
import ProgramInfo from 'src/components/program-info/program-info';
import { useBoolean } from 'src/hooks/use-boolean';
import useWorkout from 'src/hooks/use-workout';

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
  const { type, vs2 } = program;
  const create = useBoolean();
  const createApp = useBoolean();
  const confirm = useBoolean();
  const programInfo = useBoolean();
  const { onSendTraining } = useWorkout();

  const popover = usePopover();

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

  const handleOpenCreateTraining = (value) => {
    console.log('----VALUE--', value);
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

                  <Button
                    size="medium"
                    color="inherit"
                    variant="contained"
                    endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    sx={{ textTransform: 'capitalize', mb: 2 }}
                    onClick={popover.onOpen}
                  >
                    Novo treino
                  </Button>
                  <CustomPopover
                    open={popover.open}
                    onClose={popover.onClose}
                    arrow="top-right"
                    sx={{ width: 'auto' }}
                  >
                    {NEW_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        selected={option.value === 0}
                        onClick={() => {
                          popover.onClose();
                          handleOpenCreateTraining(option.value);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomPopover>
                </Stack>
                <Box pb={2}>
                  <Alert variant="outlined" severity="info" onClick={programInfo.onTrue}>
                    Informações do programa
                  </Alert>
                </Box>
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
    </>
  );
}
