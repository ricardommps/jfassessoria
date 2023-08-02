import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import NearMeIcon from '@mui/icons-material/NearMe';
import PrintIcon from '@mui/icons-material/Print';
import { Typography } from '@mui/material';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import format from 'date-fns/format';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useState } from 'react';
import { ButtonIcon } from 'src/components/button-icon/button-icon';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { useBoolean } from 'src/hooks/use-boolean';
import useProgram from 'src/hooks/use-program';

import PreviewPdf from './preview-pdf';
import {
  Advanced,
  BasecColumnAction,
  BasecInfoColumn1,
  BasecInfoColumn2,
  BasecInfoSubTitle,
  BasecInfoTitle,
  BaseHeader,
  Beginner,
  ListItem,
} from './styles';

export default function ProgramItem({
  onSelectedProgram,
  onCloneProgram,
  cloneProgramStatus,
  handleOpenSend,
  sendProgramStatus,
}) {
  const { programs } = useProgram();
  const confirm = useBoolean();
  const view = useBoolean();
  const notification = useBoolean();

  const [action, setAction] = useState({
    title: null,
    message: null,
    program: null,
  });
  const [programId, setProgramProgramId] = useState(null);
  const [notificationPdf, setNotificationPdf] = useState(null);

  const loadingAction = cloneProgramStatus.loading || sendProgramStatus.loading;

  const handleNotificationPdf = (event) => {
    setNotificationPdf(event.target.value);
  };

  const handleOpenNotification = (e, program) => {
    e.stopPropagation();
    notification.onTrue();
    setProgramProgramId(program);
  };

  const handleCloseNotification = () => {
    notification.onFalse();
    setProgramProgramId(null);
  };

  const handleConfirmNotification = () => {
    view.onTrue();
    notification.onFalse();
  };

  const handleCopyProgram = useCallback((program, e) => {
    e.stopPropagation();
    confirm.onTrue();
    setAction({
      title: 'Clonar',
      message: 'Tem certeza que deseja copiar esse programa?',
      program: program,
    });
  }, []);

  const handleClosePreviewPdf = () => {
    view.onFalse();
    setProgramProgramId(null);
    setNotificationPdf(null);
  };

  const onCloneConfirm = () => {
    confirm.onFalse();
    setAction(null);
    const payload = Object.assign({}, action.program);
    delete payload.id;
    payload.name = `[COPY]${payload.name}`;
    payload.active = false;
    const newTrainings = payload.trainings.map((obj) => {
      const newTraining = {
        ...obj,
        name: `[COPY]${obj.name}`,
        datePublished: null,
        published: false,
      };
      delete newTraining.id;
      return { ...newTraining };
    });
    payload.trainings = [...newTrainings];
    onCloneProgram(payload);
  };

  const renderreferenceMonth = (referenceMonth) => {
    if (referenceMonth) {
      return format(new Date(referenceMonth), 'MMMM-yyyy');
    }

    return '';
  };
  const renderDifficultyLevel = (difficylty) => {
    if (difficylty === 'Avançado') {
      return (
        <span>
          <Advanced>{difficylty}</Advanced>
        </span>
      );
    } else {
      return (
        <span>
          <Beginner>{difficylty}</Beginner>
        </span>
      );
    }
  };

  const notificationContent = () => {
    return (
      <Stack>
        <Typography>
          Caso deseje exibir uma notificação no rodapé do pdf, digite no campo abaixo
        </Typography>
        <TextField
          autoFocus
          margin="dense"
          id="name"
          label="Notificação"
          fullWidth
          multiline
          rows={4}
          onChange={handleNotificationPdf}
        />
      </Stack>
    );
  };

  return (
    <>
      {programs &&
        programs.map((program) => (
          <Stack
            key={program.id}
            onClick={() => {
              loadingAction ? null : onSelectedProgram(program.id);
            }}
          >
            <ListItem sx={{ padding: '2px 8px' }}>
              <BasecInfoColumn1>
                <BasecInfoTitle>
                  {loadingAction ? <Skeleton variant="text" /> : <>{program.name}</>}
                </BasecInfoTitle>
                <BasecInfoSubTitle>
                  {loadingAction ? <Skeleton variant="text" /> : <>{program.goal}</>}
                </BasecInfoSubTitle>
                <BasecInfoSubTitle>
                  {loadingAction ? (
                    <Skeleton variant="text" />
                  ) : (
                    <>{renderreferenceMonth(program.referenceMonth)}</>
                  )}
                </BasecInfoSubTitle>
              </BasecInfoColumn1>
              <BasecInfoColumn2>
                <BasecInfoTitle>
                  {loadingAction ? <Skeleton variant="text" /> : <>PV: {program.pv}</>}
                </BasecInfoTitle>
                <BasecInfoSubTitle>
                  {loadingAction ? <Skeleton variant="text" /> : <>Pace: {program.pace}</>}
                </BasecInfoSubTitle>
              </BasecInfoColumn2>
              <BasecColumnAction>
                <InputAdornment position="end" sx={{ mr: 1 }}>
                  <ButtonIcon
                    onClick={(event) => (loadingAction ? null : handleCopyProgram(program, event))}
                  >
                    <Tooltip title="Clonar programa" placement="top">
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
                    onClick={(event) => (loadingAction ? null : handleOpenSend(program, event))}
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
                  <ButtonIcon
                    onClick={(event) =>
                      loadingAction ? null : handleOpenNotification(event, program.id)
                    }
                  >
                    <Tooltip title="Gerar pdf" placement="top">
                      {loadingAction ? (
                        <Stack pt={2}>
                          <Skeleton variant="rectangular" width={20} height={20} />
                        </Stack>
                      ) : (
                        <PrintIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
                      )}
                    </Tooltip>
                  </ButtonIcon>
                </InputAdornment>
              </BasecColumnAction>
            </ListItem>
            {program.difficultyLevel && (
              <BaseHeader>
                {loadingAction ? (
                  <Skeleton variant="text" />
                ) : (
                  <> {renderDifficultyLevel(program.difficultyLevel)}</>
                )}
              </BaseHeader>
            )}
            <Stack sx={{ p: 1 }} />
          </Stack>
        ))}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={action?.title}
        content={action?.message}
        action={
          <Button variant="contained" color="error" onClick={onCloneConfirm}>
            Confirmar
          </Button>
        }
      />
      <ConfirmDialog
        open={notification.value}
        onClose={handleCloseNotification}
        title={'Avisos'}
        content={notificationContent()}
        action={
          <Button variant="contained" color="error" onClick={handleConfirmNotification}>
            Salvar
          </Button>
        }
      />
      {view.value && (
        <PreviewPdf
          open={view.value}
          onClose={handleClosePreviewPdf}
          programId={programId}
          notificationPdf={notificationPdf}
        />
      )}
    </>
  );
}

ProgramItem.propTypes = {
  onSelectedProgram: PropTypes.func,
};
