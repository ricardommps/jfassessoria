// @mui
import AppSettingsAltIcon from '@mui/icons-material/AppSettingsAlt';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PrintIcon from '@mui/icons-material/Print';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import format from 'date-fns/format';
import { ptBR } from 'date-fns/locale';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import { usePopover } from 'src/components/custom-popover';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import Iconify from 'src/components/iconify';
import Label from 'src/components/label';
import TextMaxLine from 'src/components/text-max-line';
import { useBoolean } from 'src/hooks/use-boolean';
import useProgram from 'src/hooks/use-program';
import { useResponsive } from 'src/hooks/use-responsive';
import PreviewPdf from 'src/sections/program/preview-pdf';
// components
// utils

export default function ProgramItem({
  program,
  handleOpenEditProgram,
  handleOpenTraining,
  idSelected,
  refreshList,
}) {
  const { onDeleteProgramAsync } = useProgram();
  const popover = usePopover();
  const deleteProgram = useBoolean();
  const viewPdf = useBoolean();

  const [loading, setLoading] = useState(false);

  const renderreferenceMonth = (referenceMonth) => {
    if (referenceMonth) {
      return format(new Date(referenceMonth), 'MMMM/yyyy', { locale: ptBR });
    }

    return '';
  };

  const opacityCard = () => {
    if (idSelected && idSelected !== program.id) {
      return 0.1;
    }

    return 1;
  };

  const handleDelectProgram = useCallback(async () => {
    try {
      setLoading(true);
      await onDeleteProgramAsync(program.id);
      deleteProgram.onFalse();
      refreshList();
      enqueueSnackbar('Programa deletado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Programa ao deletar treino!', {
        autoHideDuration: 8000,
        variant: 'error',
      });
    } finally {
      setLoading(false);
    }
  }, [program.id]);

  const handleCloseDeleteProgram = () => {
    deleteProgram.onFalse();
  };

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
            <Label variant="soft" color={(program.type === 2 && 'info') || 'primary'}>
              {program.type === 2 ? 'Treino de força' : 'Treino de corrida'}
            </Label>
            <Box component="span" sx={{ typography: 'caption', color: 'text.disabled' }}>
              {program?.referenceMonth ? renderreferenceMonth(program.referenceMonth) : '-'}
            </Box>
          </Stack>

          <Stack spacing={1} flexGrow={1}>
            <TextMaxLine variant="subtitle2" line={2}>
              {program?.name || '-'}
            </TextMaxLine>

            <TextMaxLine variant="body2" sx={{ color: 'text.secondary' }}>
              {program?.goal || '-'}
            </TextMaxLine>
          </Stack>

          <Stack direction="row" alignItems="center">
            <IconButton
              color={popover.open ? 'inherit' : 'default'}
              onClick={popover.onOpen}
              disabled={idSelected && idSelected !== program.id}
            >
              <Iconify icon="eva:more-horizontal-fill" />
            </IconButton>
            {(!program?.type || program.type === 1) && (
              <Stack
                spacing={1.5}
                flexGrow={1}
                direction="row"
                justifyContent="flex-end"
                sx={{
                  typography: 'caption',
                  color: 'text.disabled',
                }}
              >
                <Stack direction="row" alignItems="center">
                  PV: {program?.pv || '-'}
                </Stack>

                <Stack direction="row" alignItems="center">
                  Pace: {program?.pace || '-'}
                </Stack>
              </Stack>
            )}
          </Stack>
        </Stack>
      </Stack>
      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        sx={{
          ml: 1.5,
          width: 180,
        }}
      >
        <MenuItem
          onClick={() => {
            handleOpenEditProgram(program);
            popover.onClose();
          }}
        >
          <EditIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Editar programa
        </MenuItem>
        {program.type === 2 && (
          <MenuItem
            onClick={() => {
              viewPdf.onTrue();
              popover.onClose();
            }}
          >
            <Iconify
              icon="ic:baseline-picture-as-pdf"
              sx={{ fontSize: '22px', width: '22px', height: '30px' }}
            />
            Gerar PDF
          </MenuItem>
        )}

        <MenuItem
          onClick={() => {
            handleOpenTraining(program);
            popover.onClose();
          }}
        >
          <AppSettingsAltIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Treinos
        </MenuItem>

        <MenuItem
          onClick={() => {
            deleteProgram.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon sx={{ fontSize: '22px', width: '22px', height: '30px' }} />
          Deletar programa
        </MenuItem>
      </CustomPopover>
      <ConfirmDialog
        open={deleteProgram.value}
        onClose={handleCloseDeleteProgram}
        loading={loading}
        title={`DELERAR ${program.name}`}
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
            onClick={handleDelectProgram}
            loading={loading}
          >
            DELETAR
          </LoadingButton>
        }
      />
      {viewPdf.value && (
        <PreviewPdf open={viewPdf.value} onClose={viewPdf.onFalse} programId={program.id} />
      )}
    </>
  );
}
