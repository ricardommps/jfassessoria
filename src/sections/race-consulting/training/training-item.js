import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NearMeIcon from '@mui/icons-material/NearMe';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Tooltip from '@mui/material/Tooltip';
import { format } from 'date-fns';
import { useCallback, useState } from 'react';
import { ButtonIcon } from 'src/components/button-icon/button-icon';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import useTraining from 'src/hooks/use-training';

import {
  BasecColumnAction,
  BasecInfoColumn1,
  BasecInfoSubTitle,
  BasecInfoTitle,
  ListItem,
} from './styles';

export default function TrainingItem({ programId, handleOpenSend, sendTrainingStatus }) {
  const { trainings, onTrainingById, onCloneTraining, cloneTrainingStatus } = useTraining();
  const confirm = useBoolean();
  const [action, setAction] = useState({
    title: null,
    message: null,
    training: null,
  });
  const addDefaultSrc = (ev) => {
    ev.target.src = 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg';
  };
  const loadingAction = cloneTrainingStatus.loading || sendTrainingStatus.loading;

  const handleCopyTraining = useCallback((training, e) => {
    e.stopPropagation();
    confirm.onTrue();
    setAction({
      title: 'Clonar',
      message: 'Tem certeza que deseja copiar esse treino?',
      training: training,
    });
  }, []);

  const onCloseConfirm = () => {
    confirm.onFalse();
    setAction(null);
    const payload = Object.assign({}, action.training);
    delete payload.id;
    payload.name = `[COPY]${payload.name}`;
    payload.datePublished = null;
    payload.published = false;
    payload.programId = programId;
    onCloneTraining(payload);
  };

  return (
    <>
      {trainings &&
        trainings.map((training) => (
          <Stack key={training.id} onClick={() => onTrainingById(training.id)}>
            <ListItem>
              <img
                onError={addDefaultSrc}
                src={
                  training?.cover_url || 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg'
                }
              />
              <BasecInfoColumn1>
                <BasecInfoTitle>{training.name}</BasecInfoTitle>
                <BasecInfoSubTitle>{training.description}</BasecInfoSubTitle>
                <BasecInfoSubTitle>
                  {' '}
                  {training.datePublished &&
                    format(new Date(training.datePublished), 'dd MMM yyyy')}
                </BasecInfoSubTitle>
              </BasecInfoColumn1>
              <BasecColumnAction>
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <ButtonIcon
                    onClick={(event) =>
                      loadingAction ? null : handleCopyTraining(training, event)
                    }
                  >
                    <Tooltip title="Clonar treino" placement="top">
                      {loadingAction ? (
                        <Stack pt={2}>
                          <Skeleton variant="rectangular" width={20} height={20} />
                        </Stack>
                      ) : (
                        <ContentCopyIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
                      )}
                    </Tooltip>
                  </ButtonIcon>
                  <ButtonIcon
                    onClick={(event) => (loadingAction ? null : handleOpenSend(training, event))}
                  >
                    <Tooltip title="Enviar programa" placement="top">
                      {loadingAction ? (
                        <Stack pt={2}>
                          <Skeleton variant="rectangular" width={20} height={20} />
                        </Stack>
                      ) : (
                        <NearMeIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
                      )}
                    </Tooltip>
                  </ButtonIcon>
                </InputAdornment>
              </BasecColumnAction>
            </ListItem>

            <Stack sx={{ p: 1 }} />
          </Stack>
        ))}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={action?.title}
        content={action?.message}
        action={
          <Button variant="contained" color="error" onClick={onCloseConfirm}>
            Confirmar
          </Button>
        }
      />
    </>
  );
}
