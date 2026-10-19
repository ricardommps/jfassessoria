import AddIcon from '@mui/icons-material/Add';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import RepeatIcon from '@mui/icons-material/Repeat';
import ScheduleIcon from '@mui/icons-material/Schedule';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { format, isValid } from 'date-fns';
import PropTypes from 'prop-types';
import { forwardRef, useMemo, useState } from 'react';

import LessonPackageClassRow from './lesson-package-class-row';

const CLASS_TYPES = {
  regular: {
    label: 'Aula regular',
    description: 'Aulas cobradas no valor total do pacote.',
    marker: 'R',
    color: 'info.main',
    buttonColor: 'primary',
    chipColor: 'primary',
    icon: <AddIcon />,
  },
  barter: {
    label: 'Permuta',
    description: 'Contam no cronograma, mas não entram no valor total.',
    marker: 'P',
    color: 'grey.600',
    buttonColor: 'inherit',
    chipColor: 'default',
    icon: <RepeatIcon />,
  },
  pending: {
    label: 'Aula pendente',
    description: 'Aulas disponíveis para remarcar ou descontar.',
    marker: 'A',
    color: 'warning.main',
    buttonColor: 'warning',
    chipColor: 'warning',
    icon: <ScheduleIcon />,
  },
};

function formatDateToApi(value) {
  return value ? format(value, 'yyyy-MM-dd') : '';
}

function sortClasses(classes) {
  return [...classes].sort((classA, classB) => {
    const dateCompare = String(classA.scheduledDate).localeCompare(String(classB.scheduledDate));

    if (dateCompare !== 0) {
      return dateCompare;
    }

    return String(classA.scheduledTime || '').localeCompare(String(classB.scheduledTime || ''));
  });
}

const LessonPackagePickerDay = forwardRef(function LessonPackagePickerDay(
  { classesByDate = {}, day, outsideCurrentMonth, ...other },
  ref,
) {
  const dayClasses = classesByDate[formatDateToApi(day)] || [];
  const types = [...new Set(dayClasses.map((lessonClass) => lessonClass.type))];
  const tooltipText = dayClasses
    .map((lessonClass) => CLASS_TYPES[lessonClass.type]?.label || lessonClass.type)
    .join(', ');

  return (
    <Tooltip title={tooltipText} disableHoverListener={!tooltipText}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <PickersDay ref={ref} day={day} outsideCurrentMonth={outsideCurrentMonth} {...other} />

        {!!types.length && !outsideCurrentMonth && (
          <Stack
            direction="row"
            spacing={0.25}
            sx={{
              position: 'absolute',
              bottom: -1,
              left: '50%',
              transform: 'translateX(-50%)',
              pointerEvents: 'none',
            }}
          >
            {types.slice(0, 3).map((type) => (
              <Box
                key={type}
                sx={{
                  width: 10,
                  height: 10,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  bgcolor: CLASS_TYPES[type]?.color || 'grey.500',
                  color: 'common.white',
                  fontSize: 6,
                  fontWeight: 800,
                  lineHeight: 1,
                }}
              >
                {CLASS_TYPES[type]?.marker || '?'}
              </Box>
            ))}
          </Stack>
        )}
      </Box>
    </Tooltip>
  );
});

LessonPackagePickerDay.propTypes = {
  classesByDate: PropTypes.object,
  day: PropTypes.instanceOf(Date),
  outsideCurrentMonth: PropTypes.bool,
};

function LessonPackageClassSection({
  active,
  config,
  count,
  disabled,
  showStatus,
  editor,
  lessonClasses,
  onAdd,
  onRemove,
  title,
}) {
  return (
    <Card
      variant="outlined"
      sx={{
        overflow: 'hidden',
        borderColor: active ? config.color : 'divider',
        bgcolor: active ? 'background.neutral' : 'background.paper',
      }}
    >
      <Stack spacing={2} sx={{ p: { xs: 2, md: 2.5 } }}>
        <Stack direction="row" alignItems="center" spacing={1.5}>
          <Box
            sx={{
              width: 42,
              height: 42,
              display: 'grid',
              placeItems: 'center',
              borderRadius: '50%',
              bgcolor: config.color,
              color: 'common.white',
            }}
          >
            {config.icon}
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">{title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {config.description}
            </Typography>
          </Box>

          {count !== undefined && <Chip size="small" color="warning" label={count} />}
        </Stack>

        <TableContainer
          sx={{
            border: (theme) => `1px solid ${theme.palette.divider}`,
            borderRadius: 1.5,
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: 'background.neutral' }}>
                <TableCell width={56}>#</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Horário</TableCell>
                <TableCell>Tipo</TableCell>
                {showStatus && <TableCell>Status</TableCell>}
                <TableCell align="right">Ação</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!lessonClasses.length && (
                <TableRow>
                  <TableCell colSpan={showStatus ? 6 : 5}>
                    <Typography variant="body2" color="text.secondary">
                      Nenhuma aula adicionada.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}

              {lessonClasses.map((lessonClass, index) => (
                <LessonPackageClassRow
                  key={`${lessonClass.scheduledDate}-${lessonClass.scheduledTime || 'none'}-${
                    lessonClass.type
                  }-${index}`}
                  lessonClass={lessonClass}
                  onRemove={onRemove}
                  sequence={index + 1}
                  disabled={disabled}
                  showStatus={showStatus}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {editor}

        <Button
          variant={active ? 'contained' : 'outlined'}
          color={config.buttonColor}
          startIcon={config.icon}
          onClick={onAdd}
          disabled={disabled}
          sx={{ alignSelf: 'flex-start' }}
        >
          Adicionar {config.label.toLowerCase()}
        </Button>
      </Stack>
    </Card>
  );
}

LessonPackageClassSection.propTypes = {
  disabled: PropTypes.bool,
  showStatus: PropTypes.bool,
  active: PropTypes.bool,
  config: PropTypes.object,
  count: PropTypes.number,
  editor: PropTypes.node,
  lessonClasses: PropTypes.array,
  onAdd: PropTypes.func,
  onRemove: PropTypes.func,
  title: PropTypes.string,
};

export default function LessonPackageClassesBuilder({
  classes,
  disabled = false,
  showStatus = false,
  error,
  hasPendingClassesError,
  isLoadingPendingClasses,
  onChange,
  pendingClassesCount,
}) {
  const [scheduledDate, setScheduledDate] = useState(null);
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedType, setSelectedType] = useState(null);
  const [notes, setNotes] = useState('');
  const [draftError, setDraftError] = useState('');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const orderedClasses = useMemo(() => sortClasses(classes), [classes]);
  const regularClasses = useMemo(
    () => orderedClasses.filter((lessonClass) => lessonClass.type === 'regular'),
    [orderedClasses],
  );
  const barterClasses = useMemo(
    () => orderedClasses.filter((lessonClass) => lessonClass.type === 'barter'),
    [orderedClasses],
  );
  const pendingClasses = useMemo(
    () => orderedClasses.filter((lessonClass) => lessonClass.type === 'pending'),
    [orderedClasses],
  );
  const classesByDate = useMemo(
    () =>
      classes.reduce((accumulator, lessonClass) => {
        const key = lessonClass.scheduledDate;

        accumulator[key] = [...(accumulator[key] || []), lessonClass];
        return accumulator;
      }, {}),
    [classes],
  );

  const handleStartClass = (type) => {
    if (disabled) return;
    setSelectedType(type);
    setScheduledDate(null);
    setDraftError('');
    setIsCalendarOpen(true);
  };

  const handleAddClass = () => {
    if (disabled) return;
    if (!selectedType) {
      setDraftError('Escolha se deseja adicionar uma aula regular, permuta ou pendente.');
      return;
    }

    if (!scheduledDate || !isValid(scheduledDate)) {
      setDraftError('Selecione a data da aula no calendário.');
      return;
    }

    const nextClasses = sortClasses([
      ...classes,
      {
        scheduledDate: formatDateToApi(scheduledDate),
        scheduledTime: scheduledTime || undefined,
        type: selectedType,
        notes: notes || undefined,
      },
    ]);

    onChange(nextClasses);
    setScheduledDate(null);
    setScheduledTime('');
    setSelectedType(null);
    setNotes('');
    setDraftError('');
  };

  const handleRemoveClass = (classToRemove) => {
    if (disabled || (classToRemove.id && classToRemove.status !== 'scheduled')) return;
    onChange(classes.filter((lessonClass) => lessonClass !== classToRemove));
  };

  const selectedTypeConfig = selectedType ? CLASS_TYPES[selectedType] : null;
  const classEditor = selectedTypeConfig && (
    <Box
      sx={{
        p: { xs: 2, md: 2.5 },
        border: (theme) => `1px solid ${theme.palette.divider}`,
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Chip
            size="small"
            color={selectedTypeConfig.chipColor}
            label={selectedTypeConfig.label}
          />
          <Typography variant="body2" color="text.secondary">
            Selecione a data e preencha os detalhes opcionais.
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gap: 2,
            gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          }}
        >
          <DatePicker
            label="Data da aula"
            disabled={disabled}
            value={scheduledDate}
            open={isCalendarOpen}
            onOpen={() => setIsCalendarOpen(true)}
            onClose={() => setIsCalendarOpen(false)}
            onChange={(newValue) => {
              setScheduledDate(newValue);
              setDraftError('');
            }}
            format="dd/MM/yyyy"
            slots={{ day: LessonPackagePickerDay }}
            slotProps={{
              day: { classesByDate },
              textField: {
                fullWidth: true,
              },
            }}
          />

          <TextField
            fullWidth
            label="Horário"
            disabled={disabled}
            type="time"
            value={scheduledTime}
            onChange={(event) => setScheduledTime(event.target.value)}
            InputLabelProps={{ shrink: true }}
          />
        </Box>

        <TextField
          fullWidth
          label="Observação da aula"
          disabled={disabled}
          inputProps={{ maxLength: 500 }}
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          multiline
          minRows={2}
        />

        <Stack direction={{ xs: 'column-reverse', sm: 'row' }} spacing={1.5}>
          <Button
            color="inherit"
            disabled={disabled}
            onClick={() => {
              setSelectedType(null);
              setScheduledDate(null);
              setDraftError('');
            }}
          >
            Cancelar
          </Button>

          <Button
            variant="soft"
            color={selectedTypeConfig.buttonColor}
            startIcon={<CalendarMonthIcon />}
            onClick={handleAddClass}
            disabled={disabled}
          >
            Confirmar {selectedTypeConfig.label.toLowerCase()}
          </Button>
        </Stack>
      </Stack>
    </Box>
  );

  return (
    <Card variant="outlined" sx={{ p: { xs: 2, md: 3 } }}>
      <Stack spacing={2.5}>
        <Stack spacing={0.5}>
          <Typography variant="h6">Cronograma de aulas</Typography>
          <Typography variant="body2" color="text.secondary">
            Escolha o tipo de aula e depois selecione a data no calendário. Dias já reservados
            exibem o tipo de aula adicionado.
          </Typography>
        </Stack>

        {(error || draftError) && <Alert severity="warning">{draftError || error}</Alert>}

        {isLoadingPendingClasses && (
          <Typography variant="caption" color="text.secondary">
            Consultando aulas pendentes do aluno...
          </Typography>
        )}

        {hasPendingClassesError && (
          <Alert severity="warning">
            Não foi possível consultar as aulas pendentes do aluno. Tente atualizar a página antes
            de criar o pacote.
          </Alert>
        )}

        {!isLoadingPendingClasses && pendingClassesCount > 0 && (
          <Alert severity="info">
            Este aluno tem {pendingClassesCount} aula{pendingClassesCount > 1 ? 's' : ''} pendente
            {pendingClassesCount > 1 ? 's' : ''} para remarcar ou descontar.
          </Alert>
        )}

        <Stack spacing={2.5}>
          <LessonPackageClassSection
            active={selectedType === 'regular'}
            config={CLASS_TYPES.regular}
            editor={selectedType === 'regular' ? classEditor : null}
            lessonClasses={regularClasses}
            title="Aulas regulares"
            onAdd={() => handleStartClass('regular')}
            onRemove={handleRemoveClass}
            disabled={disabled}
            showStatus={showStatus}
          />

          <LessonPackageClassSection
            active={selectedType === 'barter'}
            config={CLASS_TYPES.barter}
            editor={selectedType === 'barter' ? classEditor : null}
            lessonClasses={barterClasses}
            title="Aulas permuta"
            onAdd={() => handleStartClass('barter')}
            onRemove={handleRemoveClass}
            disabled={disabled}
            showStatus={showStatus}
          />

          {(pendingClassesCount > 0 || pendingClasses.length > 0) && (
            <LessonPackageClassSection
              active={selectedType === 'pending'}
              config={CLASS_TYPES.pending}
              count={pendingClassesCount}
              editor={selectedType === 'pending' ? classEditor : null}
              lessonClasses={pendingClasses}
              title="Aulas pendentes"
              onAdd={() => handleStartClass('pending')}
              onRemove={handleRemoveClass}
              disabled={disabled}
              showStatus={showStatus}
            />
          )}
        </Stack>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {Object.entries(CLASS_TYPES).map(([type, config]) => (
            <Stack key={type} direction="row" spacing={0.75} alignItems="center">
              <Box
                sx={{
                  width: 14,
                  height: 14,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: '50%',
                  bgcolor: config.color,
                  color: 'common.white',
                  fontSize: 8,
                  fontWeight: 800,
                }}
              >
                {config.marker}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {config.label}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </Stack>
    </Card>
  );
}

LessonPackageClassesBuilder.propTypes = {
  disabled: PropTypes.bool,
  showStatus: PropTypes.bool,
  classes: PropTypes.array,
  error: PropTypes.string,
  hasPendingClassesError: PropTypes.bool,
  isLoadingPendingClasses: PropTypes.bool,
  onChange: PropTypes.func,
  pendingClassesCount: PropTypes.number,
};
