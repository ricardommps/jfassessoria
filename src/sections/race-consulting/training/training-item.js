import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NearMeIcon from '@mui/icons-material/NearMe';
import ReviewsIcon from '@mui/icons-material/Reviews';
import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import Label from 'src/components/label';
import { useBoolean } from 'src/hooks/use-boolean';
import useTraining from 'src/hooks/use-training';
import { useRouter } from 'src/routes/hook';
import { getModuleName } from 'src/utils/training-modules';

import FeedBack from './feedback';
import {
  BasecColumnAction,
  BasecInfoColumn1,
  BasecInfoSubTitle,
  BasecInfoTitle,
  ListItem,
} from './styles';

export default function TrainingItem({
  training,
  onTrainingById,
  onCloneTraining,
  onSendTrainig,
  onDeleteTraining,
  sendTrainingStatus,
  refreshList,
}) {
  const router = useRouter();
  const popover = usePopover();
  const confirm = useBoolean();
  const feedBack = useBoolean();
  const deleteTraining = useBoolean();

  const { cloneTraining } = useTraining();

  const [trainingName, setTrainingName] = useState('');
  const [qntCopy, setQntCopy] = useState(1);

  const handleChangeTrainingName = (event) => {
    setTrainingName(event.target.value);
  };

  const handleCloneTraining = () => {
    confirm.onFalse();
    onCloneTraining(training.id, qntCopy);
  };

  const handleCloseDeleteTraining = () => {
    deleteTraining.onFalse();
    setTrainingName(null);
  };

  const handleCloseFeedBack = () => {
    feedBack.onFalse();
    refreshList();
  };

  useEffect(() => {
    if (cloneTraining) {
      setQntCopy(1);
    }
  }, [cloneTraining]);

  const statusTrainingColor = () => {
    if (training.finished) {
      return '#FFAB00 !important';
    }

    if (training.published) {
      return '#00b826 !important';
    }

    if (training.published === false) {
      return '#f44336 !important';
    }
    return 'transparent !important';
  };

  return (
    <>
      <Stack key={training.id}>
        <ListItem statusColor={statusTrainingColor()}>
          <BasecInfoColumn1>
            <Stack direction="column">
              {training?.finished && !training?.finished_review && (
                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                  sx={{ p: 1 }}
                >
                  <Label variant="soft" color="info">
                    Aguardando FeedBack
                  </Label>
                </Stack>
              )}

              <BasecInfoTitle>{getModuleName(training.name)} </BasecInfoTitle>
              <BasecInfoSubTitle>{training.subtitle}</BasecInfoSubTitle>
            </Stack>

            <BasecInfoSubTitle>{training.description}</BasecInfoSubTitle>
            <BasecInfoSubTitle bold>
              {' '}
              {training.date_published &&
                format(new Date(training.date_published), 'dd/MM/yyyy', { locale: ptBR })}
              {training.trainingDateOther && (
                <>
                  {' ou '}
                  {training.training_date_other &&
                    format(new Date(training.training_date_other), 'dd/MM/yyyy', { locale: ptBR })}
                </>
              )}
            </BasecInfoSubTitle>
          </BasecInfoColumn1>
          <BasecColumnAction>
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
              disabled={sendTrainingStatus.loading}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </BasecColumnAction>
        </ListItem>

        <Stack sx={{ p: 1 }} />
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
            onTrainingById(training.id);
          }}
        >
          <EditIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Editar
        </MenuItem>

        <MenuItem
          onClick={() => {
            confirm.onTrue();
            popover.onClose();
          }}
        >
          <ContentCopyIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Copiar
        </MenuItem>

        <MenuItem
          onClick={(e) => {
            onSendTrainig(training, e);
            popover.onClose();
          }}
        >
          <NearMeIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Enviar
        </MenuItem>

        {training.finished && (
          <MenuItem
            onClick={(e) => {
              feedBack.onTrue();
              popover.onClose();
            }}
          >
            <ReviewsIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
            FeedBack
          </MenuItem>
        )}

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
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Copiar"
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
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleCloneTraining();
              confirm.onFalse();
            }}
          >
            Confirmar
          </Button>
        }
      />

      <ConfirmDialog
        open={deleteTraining.value}
        onClose={handleCloseDeleteTraining}
        title={`DELERAR ${training.name}`}
        content={
          <>
            <Typography>Este treino será excluído definitivamente.</Typography>
            <Alert variant="filled" severity="error" sx={{ margin: '15px 0' }}>
              Aviso: esta ação não é reversível. Por favor, tenha certeza.
            </Alert>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setTrainingName(null);
              onDeleteTraining(training.id);
              deleteTraining.onFalse();
            }}
          >
            DELETAR
          </Button>
        }
      />
      {feedBack.value && (
        <FeedBack
          open={feedBack.value}
          onClose={handleCloseFeedBack}
          trainingId={training.id}
          type="training"
        />
      )}
    </>
  );
}
