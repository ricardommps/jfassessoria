import DeleteIcon from '@mui/icons-material/Delete';
import NearMeIcon from '@mui/icons-material/NearMe';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify/iconify';
import { useBoolean } from 'src/hooks/use-boolean';

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
  ListItem,
} from '../styles';
export default function ArchivedItem({
  archived,
  archivedStatus,
  onShowProgram,
  onDeleteProgram,
  onSendProgram,
}) {
  const popover = usePopover();
  const showProgram = useBoolean();
  const deleteProgram = useBoolean();

  const [programName, setProgramName] = useState('');

  const loadingAction = archivedStatus.loading;
  const renderreferenceMonth = (referenceMonth) => {
    if (referenceMonth) {
      return format(new Date(referenceMonth), 'MMMM/yyyy', { locale: ptBR });
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

  const handleCloseDeleteProgram = () => {
    deleteProgram.onFalse();
    setProgramName(null);
  };

  const handleChangeProgramName = (event) => {
    setProgramName(event.target.value);
  };

  return (
    <>
      <Stack>
        <ListItem sx={{ padding: '2px 8px' }} active={archived.active}>
          <BasecInfoColumn1>
            <BasecInfoTitle>{archived.name}</BasecInfoTitle>
            <BasecInfoTitle>{archived.customername}</BasecInfoTitle>
            <BasecInfoSubTitle>{archived.goal}</BasecInfoSubTitle>
            <BasecInfoSubTitle>{renderreferenceMonth(archived.referenceMonth)}</BasecInfoSubTitle>
          </BasecInfoColumn1>
          <BasecInfoColumn2>
            <BasecInfoTitle>PV: {archived.pv}</BasecInfoTitle>
            <BasecInfoSubTitle>Pace: {archived.pace}</BasecInfoSubTitle>
          </BasecInfoColumn2>
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
        {archived.difficultyLevel && (
          <BaseHeader>{renderDifficultyLevel(archived.difficultyLevel)}</BaseHeader>
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
            showProgram.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'warning.main' }}
        >
          <VisibilityIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Restaurar
        </MenuItem>
        <MenuItem
          onClick={(e) => {
            onSendProgram(archived, e);
            popover.onClose();
          }}
        >
          <NearMeIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Enviar
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
        open={showProgram.value}
        onClose={showProgram.onFalse}
        title="Ocultar"
        content={
          <>
            <Typography>
              Tem certeza que deseja restaurar o programa<strong> {archived.name} </strong>, para o
              aluno(a) , <strong>{archived.customername}</strong>?
            </Typography>
          </>
        }
        action={
          <Button
            variant="contained"
            color="success"
            onClick={() => {
              onShowProgram(archived.id);
              showProgram.onFalse();
            }}
          >
            Confirmar
          </Button>
        }
      />
      <ConfirmDialog
        open={deleteProgram.value}
        onClose={handleCloseDeleteProgram}
        title={`DELERAR ${archived.name}`}
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
                  {archived.name}
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
              onDeleteProgram(archived.id);
              deleteProgram.onFalse();
            }}
            disabled={archived.name.trim() !== programName?.trim()}
          >
            DELETAR
          </Button>
        }
      />
    </>
  );
}
