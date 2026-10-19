import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import EditCalendarIcon from '@mui/icons-material/EditCalendar';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import Label from 'src/components/label';
import LoadingProgress from 'src/components/loading-progress';
import {
  useCancelLessonPackageClass,
  useFinishLessonPackageClass,
  useLessonPackageClasses,
  useMarkLessonPackageClassPending,
  useUpdateLessonPackageClass,
} from 'src/hooks/use-lesson-packages';
import { formatCurrency } from 'src/utils/format-number';

import LessonPackageCalendar from './lesson-package-calendar';
import LessonPackageStatusChip from './lesson-package-status-chip';
import LessonPackageSummary from './lesson-package-summary';

const CLASS_TYPE_LABELS = {
  regular: 'Regular',
  pending: 'Aula pendente',
  barter: 'Permuta',
};

const CLASS_STATUS_LABELS = {
  scheduled: 'Programada',
  pending: 'Remarcada',
  finished: 'Finalizada',
  canceled: 'Cancelada',
};

const CLASS_STATUS_COLORS = {
  scheduled: 'info',
  pending: 'warning',
  finished: 'success',
  canceled: 'error',
};

const CLASS_TYPE_COLORS = {
  regular: 'info',
  pending: 'warning',
  barter: 'default',
};

function getBorderColorName(lessonClass) {
  if (lessonClass?.type === 'barter') {
    return 'grey';
  }

  if (lessonClass?.status === 'canceled') {
    return 'error';
  }

  if (lessonClass?.status === 'pending') {
    return 'warning';
  }

  if (lessonClass?.status === 'finished') {
    return 'success';
  }

  return 'info';
}

function getBorderColor(theme, lessonClass) {
  const colorName = getBorderColorName(lessonClass);

  return colorName === 'grey' ? theme.palette.grey[500] : theme.palette[colorName]?.main;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  if (value instanceof Date) {
    return value;
  }

  const [date] = String(value).split('T');
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function formatDate(value) {
  const date = parseDate(value);

  if (!date) {
    return '-';
  }

  return format(date, 'dd/MM', { locale: ptBR });
}

function formatDateToApi(value) {
  return value ? format(value, 'yyyy-MM-dd') : null;
}

function isDateOutsideInterval(value, startDate, endDate) {
  if (!value || !isValid(value)) {
    return true;
  }

  if (startDate && value < startDate) {
    return true;
  }

  if (endDate && value > endDate) {
    return true;
  }

  return false;
}

function formatTime(value) {
  if (!value) {
    return 'Sem horário';
  }

  return String(value).slice(0, 5);
}

function sortClasses(classes) {
  return [...(classes || [])].sort((classA, classB) => {
    const dateA = parseDate(classA.scheduledDate)?.getTime() || 0;
    const dateB = parseDate(classB.scheduledDate)?.getTime() || 0;

    if (dateA !== dateB) {
      return dateA - dateB;
    }

    return String(classA.scheduledTime || '').localeCompare(String(classB.scheduledTime || ''));
  });
}

function countBy(classes, field, value) {
  return (classes || []).filter((lessonClass) => lessonClass[field] === value).length;
}

function getClassesInterval(classes) {
  const orderedDates = [...(classes || [])]
    .map((lessonClass) => parseDate(lessonClass.scheduledDate))
    .filter(Boolean)
    .sort((dateA, dateB) => dateA.getTime() - dateB.getTime());

  return {
    start: orderedDates[0] || null,
    end: orderedDates[orderedDates.length - 1] || null,
  };
}

function LessonClassActions({
  customerId,
  packageId,
  lessonClass,
  packageStartDate,
  packageEndDate,
}) {
  const popover = usePopover();
  const [confirmEdit, setConfirmEdit] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [confirmPending, setConfirmPending] = useState(false);
  const [editDate, setEditDate] = useState(parseDate(lessonClass?.scheduledDate));
  const finishClass = useFinishLessonPackageClass(customerId, packageId);
  const updateClass = useUpdateLessonPackageClass(customerId, packageId);
  const cancelClass = useCancelLessonPackageClass(customerId, packageId);
  const markPending = useMarkLessonPackageClassPending(customerId, packageId);
  const isFinished = lessonClass?.status === 'finished';
  const isCanceled = lessonClass?.status === 'canceled';
  const isPending = lessonClass?.status === 'pending' || lessonClass?.type === 'pending';
  const isEditDateInvalid = isDateOutsideInterval(editDate, packageStartDate, packageEndDate);

  const handleFinish = async () => {
    try {
      await finishClass.mutateAsync(lessonClass.id);
      enqueueSnackbar('Aula finalizada com sucesso!', { variant: 'success' });
      setConfirmFinish(false);
    } catch (error) {
      enqueueSnackbar(error?.message || 'Não foi possível finalizar a aula.', {
        variant: 'error',
      });
    }
  };

  const handleEdit = async () => {
    if (isEditDateInvalid) {
      enqueueSnackbar('Selecione uma data dentro do período do pacote.', {
        variant: 'warning',
      });
      return;
    }

    try {
      await updateClass.mutateAsync({
        classId: lessonClass.id,
        payload: {
          scheduledDate: formatDateToApi(editDate),
        },
      });
      enqueueSnackbar('Aula remarcada com sucesso!', { variant: 'success' });
      setConfirmEdit(false);
    } catch (error) {
      enqueueSnackbar(error?.message || 'Não foi possível remarcar a aula.', {
        variant: 'error',
      });
    }
  };

  const handleCancel = async () => {
    try {
      await cancelClass.mutateAsync(lessonClass.id);
      enqueueSnackbar('Aula cancelada com sucesso!', { variant: 'success' });
      setConfirmCancel(false);
    } catch (error) {
      enqueueSnackbar(error?.message || 'Não foi possível cancelar a aula.', {
        variant: 'error',
      });
    }
  };

  const handleMarkPending = async () => {
    try {
      await markPending.mutateAsync(lessonClass.id);
      enqueueSnackbar('Aula marcada como pendente!', { variant: 'success' });
      setConfirmPending(false);
    } catch (error) {
      enqueueSnackbar(error?.message || 'Não foi possível marcar a aula como pendente.', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <IconButton size="small" onClick={popover.onOpen}>
        <MoreVertIcon fontSize="small" />
      </IconButton>

      <CustomPopover open={popover.open} onClose={popover.onClose} sx={{ width: 180 }}>
        <MenuItem
          onClick={() => {
            setEditDate(parseDate(lessonClass?.scheduledDate));
            setConfirmEdit(true);
            popover.onClose();
          }}
        >
          <EditCalendarIcon />
          Editar aula
        </MenuItem>

        <MenuItem
          disabled={isFinished}
          onClick={() => {
            setConfirmFinish(true);
            popover.onClose();
          }}
        >
          <CheckCircleOutlineIcon />
          Finalizar aula
        </MenuItem>

        <MenuItem
          disabled={isPending}
          onClick={() => {
            setConfirmPending(true);
            popover.onClose();
          }}
        >
          <PendingActionsIcon />
          Aula pendente
        </MenuItem>

        <MenuItem
          disabled={isCanceled}
          onClick={() => {
            setConfirmCancel(true);
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <CancelOutlinedIcon />
          Cancelar aula
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirmEdit}
        onClose={() => setConfirmEdit(false)}
        loading={updateClass.isPending}
        title="Editar aula"
        content={
          <Stack spacing={2}>
            <Typography variant="body2">
              Selecione a nova data da aula. A data precisa estar dentro do período do pacote.
            </Typography>

            <DatePicker
              label="Nova data"
              value={editDate}
              onChange={(newValue) => setEditDate(newValue)}
              minDate={packageStartDate}
              maxDate={packageEndDate}
              format="dd/MM/yyyy"
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText:
                    packageStartDate && packageEndDate
                      ? `Período: ${formatDate(packageStartDate)} até ${formatDate(packageEndDate)}`
                      : undefined,
                },
              }}
            />
          </Stack>
        }
        action={
          <LoadingButton
            variant="contained"
            loading={updateClass.isPending}
            disabled={isEditDateInvalid}
            onClick={handleEdit}
          >
            Salvar
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={confirmFinish}
        onClose={() => setConfirmFinish(false)}
        loading={finishClass.isPending}
        title="Finalizar aula"
        content={
          <Typography variant="body2">
            Deseja finalizar a aula do dia {formatDate(lessonClass.scheduledDate)}?
          </Typography>
        }
        action={
          <LoadingButton
            variant="contained"
            color="success"
            loading={finishClass.isPending}
            onClick={handleFinish}
          >
            Finalizar
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={confirmPending}
        onClose={() => setConfirmPending(false)}
        loading={markPending.isPending}
        title="Aula pendente"
        content={
          <Typography variant="body2">
            Deseja marcar a aula do dia {formatDate(lessonClass.scheduledDate)} como pendente para
            remarcar/descontar?
          </Typography>
        }
        action={
          <LoadingButton
            variant="contained"
            color="warning"
            loading={markPending.isPending}
            onClick={handleMarkPending}
          >
            Marcar pendente
          </LoadingButton>
        }
      />

      <ConfirmDialog
        open={confirmCancel}
        onClose={() => setConfirmCancel(false)}
        loading={cancelClass.isPending}
        title="Cancelar aula"
        content={
          <Typography variant="body2">
            Deseja cancelar a aula do dia {formatDate(lessonClass.scheduledDate)}?
          </Typography>
        }
        action={
          <LoadingButton
            variant="contained"
            color="error"
            loading={cancelClass.isPending}
            onClick={handleCancel}
          >
            Cancelar aula
          </LoadingButton>
        }
      />
    </>
  );
}

LessonClassActions.propTypes = {
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lessonClass: PropTypes.object,
  packageEndDate: PropTypes.instanceOf(Date),
  packageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  packageStartDate: PropTypes.instanceOf(Date),
};

export default function LessonPackageSchedule({ lessonPackage }) {
  const theme = useTheme();
  const {
    data: classes = [],
    isLoading,
    error,
  } = useLessonPackageClasses(lessonPackage?.id, !!lessonPackage?.id);

  const orderedClasses = useMemo(() => sortClasses(classes), [classes]);
  const packageInterval = useMemo(() => getClassesInterval(orderedClasses), [orderedClasses]);
  const summary = useMemo(
    () => ({
      regular: countBy(classes, 'type', 'regular'),
      barter: countBy(classes, 'type', 'barter'),
      pending: countBy(classes, 'type', 'pending'),
      finished: countBy(classes, 'status', 'finished'),
    }),
    [classes],
  );

  if (!lessonPackage) {
    return null;
  }

  return (
    <Card sx={{ mt: 3, p: { xs: 2, md: 3 } }}>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          alignItems={{ xs: 'flex-start', md: 'center' }}
          justifyContent="space-between"
          spacing={2}
        >
          <Stack spacing={0.75}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Typography variant="h6">{lessonPackage.title}</Typography>
              <LessonPackageStatusChip status={lessonPackage.status} />
            </Stack>

            <Typography variant="body2" color="text.secondary">
              Cronograma de aulas e calendário do pacote selecionado.
            </Typography>
          </Stack>

          <Typography variant="subtitle2">
            {formatCurrency(Number(lessonPackage.totalAmount || 0))}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: 'repeat(2, minmax(0, 1fr))',
              md: 'repeat(5, minmax(0, 1fr))',
            },
            gap: 1,
          }}
        >
          <LessonPackageSummary label="Total" value={lessonPackage.totalLessons || 0} />
          <LessonPackageSummary label="Cobradas" value={lessonPackage.paidLessons || 0} />
          <LessonPackageSummary label="Regulares" value={summary.regular} />
          <LessonPackageSummary label="Permutas" value={summary.barter} />
          <LessonPackageSummary label="Finalizadas" value={summary.finished} />
        </Box>

        <Divider />

        {isLoading && (
          <Box sx={{ position: 'relative', minHeight: 220 }}>
            <LoadingProgress />
          </Box>
        )}

        {error && <Alert severity="error">Não foi possível carregar o cronograma de aulas.</Alert>}

        {!isLoading && !error && (
          <Grid container spacing={2.5}>
            <Grid xs={12} md={8}>
              <Card
                variant="outlined"
                sx={{
                  p: { xs: 1.5, md: 2 },
                  height: 1,
                  bgcolor: (theme) => alpha(theme.palette.background.neutral, 0.22),
                }}
              >
                <Stack spacing={1.5}>
                  <Typography variant="subtitle1">Cronograma de aulas</Typography>

                  {!orderedClasses.length && (
                    <Alert severity="info">Nenhuma aula cadastrada neste pacote.</Alert>
                  )}

                  {!!orderedClasses.length && (
                    <TableContainer
                      sx={{
                        borderRadius: 1.5,
                        border: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                        overflowX: 'auto',
                      }}
                    >
                      <Table size="small" sx={{ minWidth: 680 }}>
                        <TableHead>
                          <TableRow
                            sx={{
                              bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                              '& th': {
                                borderBottom: `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
                                color: 'text.secondary',
                                fontWeight: 700,
                              },
                            }}
                          >
                            <TableCell>Data</TableCell>
                            <TableCell>Horário</TableCell>
                            <TableCell>Tipo de aula</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Ações</TableCell>
                          </TableRow>
                        </TableHead>

                        <TableBody>
                          {orderedClasses.map((lessonClass) => {
                            const classColor = getBorderColor(theme, lessonClass);

                            return (
                              <TableRow
                                key={lessonClass.id}
                                sx={{
                                  borderLeft: `4px solid ${classColor}`,
                                  bgcolor: alpha(classColor, 0.035),
                                  '& td': {
                                    borderBottom: `1px solid ${alpha(
                                      theme.palette.grey[500],
                                      0.12,
                                    )}`,
                                  },
                                }}
                              >
                                <TableCell>
                                  <Typography variant="subtitle2">
                                    {formatDate(lessonClass.scheduledDate)}
                                  </Typography>
                                  {lessonClass.notes && (
                                    <Typography variant="caption" color="text.secondary">
                                      {lessonClass.notes}
                                    </Typography>
                                  )}
                                </TableCell>

                                <TableCell>
                                  <Typography variant="body2">
                                    {formatTime(lessonClass.scheduledTime)}
                                  </Typography>
                                </TableCell>

                                <TableCell>
                                  <Label variant="soft" color={CLASS_TYPE_COLORS[lessonClass.type]}>
                                    {CLASS_TYPE_LABELS[lessonClass.type] || lessonClass.type}
                                  </Label>
                                </TableCell>

                                <TableCell>
                                  <Label
                                    variant="soft"
                                    color={CLASS_STATUS_COLORS[lessonClass.status] || 'default'}
                                  >
                                    {CLASS_STATUS_LABELS[lessonClass.status] || lessonClass.status}
                                  </Label>
                                </TableCell>

                                <TableCell align="center">
                                  <LessonClassActions
                                    customerId={lessonPackage.customerId}
                                    packageId={lessonPackage.id}
                                    lessonClass={lessonClass}
                                    packageStartDate={packageInterval.start}
                                    packageEndDate={packageInterval.end}
                                  />
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </Stack>
              </Card>
            </Grid>

            <Grid xs={12} md={4}>
              <LessonPackageCalendar classes={orderedClasses} />
            </Grid>
          </Grid>
        )}
      </Stack>
    </Card>
  );
}

LessonPackageSchedule.propTypes = {
  lessonPackage: PropTypes.object,
};
