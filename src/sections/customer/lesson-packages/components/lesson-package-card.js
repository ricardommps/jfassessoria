import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteIcon from '@mui/icons-material/Delete';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import EventAvailableIcon from '@mui/icons-material/EventAvailable';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { useBoolean } from 'src/hooks/use-boolean';
import {
  useDeleteLessonPackage,
  useUpdateLessonPackageStatus,
} from 'src/hooks/use-lesson-packages';
import { formatCurrency } from 'src/utils/format-number';

import { formatLessonPackageWhatsappMessage } from '../utils/format-lesson-package-whatsapp-message';
import LessonPackageEditDialog from './lesson-package-edit-dialog';
import LessonPackageStatusChip from './lesson-package-status-chip';
import LessonPackageSummary from './lesson-package-summary';

function formatNumber(value) {
  return Number(value || 0);
}

async function copyTextToClipboard(text) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');

  textarea.value = text;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  const copied = document.execCommand('copy');

  document.body.removeChild(textarea);

  if (!copied) {
    throw new Error('Clipboard is unavailable');
  }
}

export default function LessonPackageCard({ customerId, lessonPackage, selected, onViewSchedule }) {
  const popover = usePopover();
  const deleteConfirm = useBoolean();
  const editDialog = useBoolean();
  const [confirmStatus, setConfirmStatus] = useState(null);
  const updateStatus = useUpdateLessonPackageStatus(customerId);
  const deletePackage = useDeleteLessonPackage(customerId);
  const totalLessons = formatNumber(lessonPackage?.totalLessons);
  const paidLessons = formatNumber(lessonPackage?.paidLessons);
  const totalAmount = formatCurrency(Number(lessonPackage?.totalAmount || 0));
  const unitPrice = formatCurrency(Number(lessonPackage?.lessonUnitPrice || 0));

  const statusActions = useMemo(() => {
    const actions = [];

    if (lessonPackage?.status !== 'active') {
      actions.push({
        icon: <PlayCircleOutlineIcon />,
        label: 'Ativar pacote',
        status: 'active',
      });
    }

    if (lessonPackage?.status !== 'paused') {
      actions.push({
        icon: <PauseCircleOutlineIcon />,
        label: 'Pausar pacote',
        status: 'paused',
      });
    }

    if (lessonPackage?.status !== 'finished') {
      actions.push({
        icon: <EventAvailableIcon />,
        label: 'Finalizar pacote',
        status: 'finished',
      });
    }

    return actions;
  }, [lessonPackage?.status]);

  const handleStatusChange = async () => {
    if (!confirmStatus) {
      return;
    }

    try {
      await updateStatus.mutateAsync({
        packageId: lessonPackage.id,
        status: confirmStatus.status,
      });
      enqueueSnackbar('Status do pacote atualizado com sucesso!', {
        variant: 'success',
      });
      setConfirmStatus(null);
    } catch (error) {
      const apiMessage = error?.response?.data?.message;
      const message = Array.isArray(apiMessage)
        ? apiMessage.filter((item) => typeof item === 'string' && item.trim()).join(' ')
        : typeof apiMessage === 'string' && apiMessage.trim();

      enqueueSnackbar(
        message || 'Não foi possível atualizar o status do pacote. Tente novamente.',
        {
          variant: 'error',
        },
      );
    }
  };

  const handleDelete = async () => {
    try {
      await deletePackage.mutateAsync(lessonPackage.id);
      enqueueSnackbar('Pacote excluído com sucesso!', {
        variant: 'success',
      });
      deleteConfirm.onFalse();
    } catch (error) {
      enqueueSnackbar(error?.message || 'Não foi possível excluir o pacote.', {
        variant: 'error',
      });
    }
  };

  const handleCopyForWhatsapp = async () => {
    const message = formatLessonPackageWhatsappMessage(lessonPackage);

    try {
      await copyTextToClipboard(message);
      enqueueSnackbar('Cronograma copiado. Agora é só colar no WhatsApp.', {
        variant: 'success',
      });
    } catch (error) {
      enqueueSnackbar('Não foi possível copiar o cronograma. Tente novamente.', {
        variant: 'error',
      });
    } finally {
      popover.onClose();
    }
  };

  return (
    <>
      <Card
        sx={{
          p: { xs: 2, sm: 2.5 },
          height: 1,
          cursor: 'pointer',
          border: (theme) =>
            selected
              ? `2px solid ${theme.palette.primary.main}`
              : `1px solid ${theme.palette.divider}`,
          boxShadow: (theme) =>
            selected ? theme.customShadows?.primary : theme.customShadows?.card,
        }}
        onClick={() => onViewSchedule?.(lessonPackage.id)}
      >
        <Stack spacing={2} sx={{ height: 1 }}>
          <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.75 }}>
                <Typography variant="h6" noWrap>
                  {lessonPackage?.title || 'Pacote sem titulo'}
                </Typography>
                <LessonPackageStatusChip status={lessonPackage?.status} />
              </Stack>

              {lessonPackage?.description && (
                <Typography variant="body2" color="text.secondary">
                  {lessonPackage.description}
                </Typography>
              )}
            </Box>

            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                popover.onOpen(event);
              }}
            >
              <MoreVertIcon />
            </IconButton>
          </Stack>

          {lessonPackage?.warnings && (
            <Alert
              severity="warning"
              icon={<WarningAmberIcon fontSize="inherit" />}
              sx={{
                whiteSpace: 'pre-line',
                alignItems: 'flex-start',
              }}
            >
              {lessonPackage.warnings}
            </Alert>
          )}

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: 'repeat(2, minmax(0, 1fr))',
                sm: 'repeat(4, minmax(0, 1fr))',
              },
              gap: 1,
              mt: 'auto',
            }}
          >
            <LessonPackageSummary label="Total de aulas" value={totalLessons} />
            <LessonPackageSummary label="Aulas cobradas" value={paidLessons} />
            <LessonPackageSummary label="Valor da aula" value={unitPrice} />
            <LessonPackageSummary label="Valor total" value={totalAmount} />
          </Box>
        </Stack>
      </Card>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 210 }}>
        <MenuItem
          onClick={() => {
            onViewSchedule?.(lessonPackage.id);
            popover.onClose();
          }}
        >
          <EventAvailableIcon />
          Ver aulas
        </MenuItem>

        <MenuItem
          onClick={() => {
            editDialog.onTrue();
            popover.onClose();
          }}
        >
          <EditOutlinedIcon />
          Editar pacote
        </MenuItem>

        <MenuItem onClick={handleCopyForWhatsapp}>
          <ContentCopyIcon />
          Copiar para WhatsApp
        </MenuItem>

        {statusActions.map((action) => (
          <MenuItem
            key={action.status}
            onClick={() => {
              setConfirmStatus(action);
              popover.onClose();
            }}
          >
            {action.icon}
            {action.label}
          </MenuItem>
        ))}

        <MenuItem
          onClick={() => {
            deleteConfirm.onTrue();
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <DeleteIcon />
          Excluir pacote
        </MenuItem>
      </CustomPopover>

      {editDialog.value && (
        <LessonPackageEditDialog
          open
          customerId={customerId}
          lessonPackage={lessonPackage}
          onClose={editDialog.onFalse}
        />
      )}

      <ConfirmDialog
        open={!!confirmStatus}
        onClose={() => setConfirmStatus(null)}
        loading={updateStatus.isPending}
        title={confirmStatus?.label || 'Alterar status'}
        content={
          <Typography variant="body2">
            Deseja alterar o status do pacote "{lessonPackage?.title}"?
          </Typography>
        }
        action={
          <LoadingButton
            variant="contained"
            color="primary"
            loading={updateStatus.isPending}
            onClick={handleStatusChange}
          >
            Confirmar
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={deleteConfirm.value}
        onClose={deleteConfirm.onFalse}
        loading={deletePackage.isPending}
        title="Excluir pacote"
        content={
          <Stack spacing={2}>
            <Typography variant="body2">
              O pacote "{lessonPackage?.title}" e todas as aulas vinculadas serão excluídos.
            </Typography>
            <Alert severity="error">Esta ação não pode ser desfeita.</Alert>
          </Stack>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={deletePackage.isPending}
            onClick={handleDelete}
          >
            Excluir
          </LoadingButton>
        }
      />
    </>
  );
}

LessonPackageCard.propTypes = {
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lessonPackage: PropTypes.object,
  onViewSchedule: PropTypes.func,
  selected: PropTypes.bool,
};
