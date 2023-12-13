import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NearMeIcon from '@mui/icons-material/NearMe';
import { Stack } from '@mui/material';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import { useBoolean } from 'src/hooks/use-boolean';
import { getModuleName } from 'src/utils/training-modules';

import { BootstrapInput } from '../program/styles';
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
  programId,
  onCloneTraining,
  onSendTrainig,
  onDeleteTraining,
  sendTrainingStatus,
}) {
  const popover = usePopover();
  const confirm = useBoolean();
  const deleteTraining = useBoolean();

  const [trainingName, setTrainingName] = useState('');

  const addDefaultSrc = (ev) => {
    ev.target.src = 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg';
  };

  const handleChangeTrainingName = (event) => {
    setTrainingName(event.target.value);
  };

  const handleCloneTraining = () => {
    confirm.onFalse();
    const payload = Object.assign({}, training);
    delete payload.id;
    payload.datePublished = null;
    payload.published = false;
    payload.programId = programId;
    payload.finished = false;
    onCloneTraining(payload);
  };

  const handleCloseDeleteTraining = () => {
    deleteTraining.onFalse();
    setTrainingName(null);
  };

  return (
    <>
      <Stack key={training.id}>
        <ListItem published={training.published}>
          <img
            onError={addDefaultSrc}
            src={training?.cover_url || 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg'}
          />
          <BasecInfoColumn1>
            <Stack direction="row">
              <BasecInfoTitle>{getModuleName(training.name)} </BasecInfoTitle>
            </Stack>

            <BasecInfoSubTitle>{training.description}</BasecInfoSubTitle>
            <BasecInfoSubTitle bold>
              {' '}
              {training.datePublished &&
                format(new Date(training.datePublished), 'dd/MM/yyyy', { locale: ptBR })}
              {training.trainingDateOther && (
                <>
                  {' ou '}
                  {training.trainingDateOther &&
                    format(new Date(training.trainingDateOther), 'dd/MM/yyyy', { locale: ptBR })}
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
          <>
            Tem certeza que deseja copiar o treino<strong> {training.name} </strong>?
          </>
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
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <Typography>
                Digite o nome do treino{' '}
                <Box component="span" fontWeight="bold" color="#FF5630">
                  {training.name}
                </Box>{' '}
                para continuar:
              </Typography>
              <BootstrapInput onChange={handleChangeTrainingName} />
            </FormControl>
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
            disabled={training.name.trim() !== trainingName?.trim()}
          >
            DELETAR
          </Button>
        }
      />
    </>
  );
}
