// @mui
// slick-carousel
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NearMeIcon from '@mui/icons-material/NearMe';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import TextMaxLine from 'src/components/text-max-line';
import WorkoutView from 'src/components/workout-view';
import { useBoolean } from 'src/hooks/use-boolean';
import useWorkout from 'src/hooks/use-workout';
import { fDate } from 'src/utils/format-time';
import { getModuleName } from 'src/utils/training-modules';

import History from '../history/history';
import FeedBack from './feedback';
import CreateTraining from './training-form/create-training';
// components
// utils

export default function TrainingItem({
  training,
  refreshList,
  handleSuccessCreate,
  handleOpenSend,
  program,
}) {
  const { type } = program;
  const popover = usePopover();
  const feedBack = useBoolean();
  const create = useBoolean();
  const history = useBoolean();
  const workoutView = useBoolean();
  const copy = useBoolean();
  const deleteTraining = useBoolean();

  const { onCloneTraining, onDeleteTraining } = useWorkout();

  const [qntCopy, setQntCopy] = useState(1);
  const [loading, setLoading] = useState(false);

  const opacityCard = () => {
    return 1;
  };

  const statusTraining = () => {
    if (training.published) {
      if (type === 1 && !training.finished) {
        return (
          <Label variant="soft" color={'primary'}>
            Treino agendado
          </Label>
        );
      }
      return (
        <Label variant="soft" color={'primary'}>
          Treino liberado
        </Label>
      );
    }

    if (training.published === false) {
      return (
        <Label variant="soft" color={'error'}>
          Treino não publicado
        </Label>
      );
    }
  };

  const handleCloseFeedBack = () => {
    feedBack.onFalse();
  };

  const handleCloseCreate = () => {
    create.onFalse();
    refreshList();
  };

  const handleCloseDeleteTraining = () => {
    deleteTraining.onFalse();
  };

  const handleCloneTraining = useCallback(async () => {
    try {
      setLoading(true);
      await onCloneTraining(training.id, qntCopy);
      copy.onFalse();
      setQntCopy(1);
      refreshList();
      enqueueSnackbar('Treino clonado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Falha ao clonar treino!', {
        autoHideDuration: 8000,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [training.id, qntCopy]);

  const handleDelectTraining = useCallback(async () => {
    try {
      setLoading(true);
      await onDeleteTraining(training.id);
      deleteTraining.onFalse();
      refreshList();
      enqueueSnackbar('Treino deletado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Falha ao deletar treino!', {
        autoHideDuration: 8000,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [training.id]);

  const handleCancel = () => {
    copy.onFalse();
    setQntCopy(1);
  };

  const countReview = training?.history.filter(
    (item) => item.review === false || !item.review,
  ).length;
  return (
    <>
      <Stack component={Card} direction="row" sx={{ opacity: opacityCard() }}>
        <Stack
          sx={{
            p: (theme) => theme.spacing(3, 3, 2, 3),
            width: '100%',
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 2 }}
            spacing={3}
          >
            <Stack>
              {type === 1 && (
                <TextMaxLine variant="subtitle1" line={1}>
                  {getModuleName(training.name)}
                </TextMaxLine>
              )}
              <TextMaxLine variant="subtitle2" line={1}>
                {training.subtitle}
              </TextMaxLine>
            </Stack>

            {training.datePublished && (
              <Box component="span" sx={{ typography: 'caption' }}>
                {fDate(training.datePublished, 'dd/MM/yyyy')}
              </Box>
            )}
          </Stack>

          <Stack alignItems="flex-start" justifyContent="space-between">
            {statusTraining()}
          </Stack>
          {training?.history && (
            <Stack alignItems="flex-start" justifyContent="space-between" pt={3}>
              <Badge
                badgeContent={countReview > 0 ? countReview : training?.history.length}
                color={countReview > 0 ? 'warning' : 'success'}
                showZero
              >
                <Button
                  variant="outlined"
                  color="info"
                  startIcon={<AssignmentTurnedInIcon />}
                  onClick={history.onTrue}
                >
                  Histórico
                </Button>
              </Badge>
            </Stack>
          )}

          <Stack direction="row" alignItems="center" pt={5}>
            <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
          </Stack>
        </Stack>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          ml: 1.5,
          width: 160,
        }}
      >
        <MenuItem
          onClick={() => {
            create.onTrue();
            feedBack.onFalse();
            popover.onClose();
          }}
        >
          <EditIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Editar
        </MenuItem>

        <MenuItem
          onClick={() => {
            copy.onTrue();
            popover.onClose();
          }}
        >
          <ContentCopyIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Copiar
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            handleOpenSend(training, e);
            popover.onClose();
          }}
        >
          <NearMeIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Enviar
        </MenuItem>

        <MenuItem
          onClick={() => {
            deleteTraining.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Deletar
        </MenuItem>
      </CustomPopover>
      {feedBack.value && (
        <FeedBack
          open={feedBack.value}
          onClose={handleCloseFeedBack}
          trainingId={training.id}
          type="training"
        />
      )}
      {create.value && (
        <CreateTraining
          open={create.value}
          program={program}
          trainingId={training.id}
          onClose={handleCloseCreate}
          handleSuccessCreate={handleSuccessCreate}
        />
      )}
      {history.value && (
        <History
          open={history.value}
          onClose={history.onFalse}
          history={training.history}
          title={'Histórico'}
          refreshList={refreshList}
          workoutView={workoutView}
        />
      )}
      {workoutView.value && (
        <WorkoutView
          open={workoutView.value}
          onClose={workoutView.onFalse}
          workoutId={training.id}
        />
      )}

      <ConfirmDialog
        open={copy.value}
        onClose={handleCancel}
        title="Copiar"
        loading={loading}
        content={
          <Stack spacing={3}>
            <Typography variant="body2">
              Tem certeza que deseja copiar o treino<strong> {training.name} </strong>?
            </Typography>
            <TextField
              id="qnt-copy"
              label="Quantidade de cópias"
              variant="outlined"
              type="number"
              value={qntCopy}
              onChange={(e) => {
                setQntCopy(e.target.value);
              }}
            />
          </Stack>
        }
        action={
          <LoadingButton
            variant="contained"
            color="success"
            onClick={handleCloneTraining}
            loading={loading}
          >
            Confirmar
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={deleteTraining.value}
        onClose={handleCloseDeleteTraining}
        loading={loading}
        title={`DELERAR ${training.running ? getModuleName(training.name) : training.subtitle}`}
        content={
          <>
            <Typography>Este treino será excluído definitivamente.</Typography>
            <Alert variant="filled" severity="error" sx={{ margin: '15px 0' }}>
              Aviso: esta ação não é reversível. Por favor, tenha certeza.
            </Alert>
          </>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDelectTraining}
            loading={loading}
          >
            DELETAR
          </LoadingButton>
        }
      />
    </>
  );
}
