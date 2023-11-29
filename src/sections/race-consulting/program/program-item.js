import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import NearMeIcon from '@mui/icons-material/NearMe';
import PrintIcon from '@mui/icons-material/Print';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { useCallback, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import { useBoolean } from 'src/hooks/use-boolean';

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
  BootstrapInput,
  Intermediary,
  ListItem,
} from './styles';

export default function ProgramItem({
  program,
  onCloneProgram,
  onSelectedProgram,
  onSendProgram,
  onDeleteProgram,
  cloneProgramStatus,
  sendProgramStatus,
  onHideProgram,
}) {
  const confirm = useBoolean();
  const view = useBoolean();
  const notification = useBoolean();
  const deleteProgram = useBoolean();
  const hideProgram = useBoolean();

  const popover = usePopover();

  const [notificationPdf, setNotificationPdf] = useState(null);

  const [programName, setProgramName] = useState('');

  const loadingAction = cloneProgramStatus.loading || sendProgramStatus.loading;

  const renderreferenceMonth = (referenceMonth) => {
    if (referenceMonth) {
      return format(new Date(referenceMonth), 'MMMM/yyyy', { locale: ptBR });
    }

    return '';
  };
  const renderDifficultyLevel = (difficylty) => {
    if (difficylty === 'Iniciante') {
      return (
        <span>
          <Beginner>{difficylty}</Beginner>
        </span>
      );
    }
    if (difficylty === 'Intermediário') {
      return (
        <span>
          <Intermediary>{difficylty}</Intermediary>
        </span>
      );
    }

    return (
      <span>
        <Advanced>{difficylty}</Advanced>
      </span>
    );
  };

  const handleChangeProgramName = (event) => {
    setProgramName(event.target.value);
  };

  const handleOpenNotification = (e) => {
    e.stopPropagation();
    notification.onTrue();
  };

  const handleNotificationPdf = (event) => {
    setNotificationPdf(event.target.value);
  };

  const handleConfirmNotification = () => {
    view.onTrue();
    notification.onFalse();
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

  const handleCloneProgram = useCallback(async () => {
    try {
      const payload = Object.assign({}, program);
      delete payload.id;
      payload.name = `[COPY]${payload.name}`;
      payload.active = false;
      const newTrainings = payload.trainings.map((obj) => {
        const newTraining = {
          ...obj,
          name: obj.name,
          datePublished: null,
          published: false,
        };
        delete newTraining.id;
        return { ...newTraining };
      });
      payload.trainings = [...newTrainings];
      onCloneProgram(payload);
    } catch (error) {
      console.error(error);
    }
  }, []);

  const handleCloseDeleteProgram = () => {
    deleteProgram.onFalse();
    setProgramName(null);
  };

  return (
    <>
      <Stack>
        <ListItem sx={{ padding: '2px 8px' }} active={program.active} type={program?.type}>
          <BasecInfoColumn1>
            <BasecInfoTitle>{program.name}</BasecInfoTitle>
            <BasecInfoSubTitle>{program.goal}</BasecInfoSubTitle>
            <BasecInfoSubTitle>{renderreferenceMonth(program.referenceMonth)}</BasecInfoSubTitle>
          </BasecInfoColumn1>
          {(!program?.type || program.type === 1) && (
            <BasecInfoColumn2>
              <BasecInfoTitle>PV: {program.pv}</BasecInfoTitle>
              <BasecInfoSubTitle>Pace: {program.pace}</BasecInfoSubTitle>
            </BasecInfoColumn2>
          )}
          {program?.type === 2 && <Stack flexGrow={1} />}
          <BasecColumnAction>
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
              disabled={loadingAction}
            >
              <Iconify icon="eva:more-vertical-fill" />
            </IconButton>
          </BasecColumnAction>
        </ListItem>
        {program.difficultyLevel && (
          <BaseHeader>{renderDifficultyLevel(program.difficultyLevel)}</BaseHeader>
        )}
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
            onSelectedProgram(program.id);
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
            onSendProgram(program, e);
            popover.onClose();
          }}
        >
          <NearMeIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Enviar
        </MenuItem>
        {program.trainings.length > 0 && program.trainings.some((it) => it.published) && (
          <MenuItem
            onClick={(e) => {
              handleOpenNotification(e);
              popover.onClose();
            }}
          >
            <PrintIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
            Pdf
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            hideProgram.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'warning.main' }}
        >
          <VisibilityOffIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Arquivar
        </MenuItem>

        <MenuItem
          onClick={() => {
            deleteProgram.onTrue();
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
            Tem certeza que deseja copiar o programa<strong> {program.name} </strong>?
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              handleCloneProgram();
              confirm.onFalse();
            }}
          >
            Confirmar
          </Button>
        }
      />

      <ConfirmDialog
        open={hideProgram.value}
        onClose={hideProgram.onFalse}
        title="Ocultar"
        content={
          <>
            <Typography>
              Tem certeza que deseja ocultar o programa<strong> {program.name} </strong>?
            </Typography>
            <Alert variant="filled" severity="warning" sx={{ margin: '15px 0' }}>
              Aviso: esta ação irá ocultar esse programa e todos os treinos cadastrados nele. O
              programa oculto ficará em histórico no qual poderá ser recuperado novamente
            </Alert>
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onHideProgram(program.id);
              hideProgram.onFalse();
            }}
          >
            Confirmar
          </Button>
        }
      />

      <ConfirmDialog
        open={deleteProgram.value}
        onClose={handleCloseDeleteProgram}
        title={`DELERAR ${program.name}`}
        content={
          <>
            <Typography>
              Este programa será excluído definitivamente, juntamente com todos os seus treinos.
            </Typography>
            <Alert variant="filled" severity="error" sx={{ margin: '15px 0' }}>
              Aviso: esta ação não é reversível. Por favor, tenha certeza.
            </Alert>
            <FormControl variant="standard" sx={{ width: '100%' }}>
              <Typography>
                Digite o nome do programa{' '}
                <Box component="span" fontWeight="bold" color="#FF5630">
                  {program.name}
                </Box>{' '}
                para continuar:
              </Typography>
              <BootstrapInput onChange={handleChangeProgramName} />
            </FormControl>
          </>
        }
        action={
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              setProgramName(null);
              onDeleteProgram(program.id);
              deleteProgram.onFalse();
            }}
            disabled={program.name.trim() !== programName?.trim()}
          >
            DELETAR
          </Button>
        }
      />

      <ConfirmDialog
        open={notification.value}
        onClose={notification.onFalse}
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
          onClose={view.onFalse}
          programId={program.id}
          notificationPdf={notificationPdf}
        />
      )}
    </>
  );
}
