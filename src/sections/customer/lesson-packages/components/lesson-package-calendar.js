import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha, useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { addMonths, eachDayOfInterval, endOfMonth, format, getDay, startOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import PropTypes from 'prop-types';
import { useEffect, useMemo, useState } from 'react';

const WEEK_DAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

const TYPE_COLORS = {
  regular: 'info',
  pending: 'warning',
  barter: 'grey',
};

const STATUS_COLORS = {
  canceled: 'error',
  pending: 'warning',
  finished: 'success',
  scheduled: 'info',
};

const STATUS_LABELS = {
  scheduled: 'Programada',
  pending: 'Remarcada',
  finished: 'Finalizada',
  canceled: 'Cancelada',
};

function getBorderColorName(lessonClass) {
  if (lessonClass?.type === 'barter') {
    return TYPE_COLORS.barter;
  }

  if (lessonClass?.status === 'canceled') {
    return STATUS_COLORS.canceled;
  }

  if (lessonClass?.status === 'pending') {
    return STATUS_COLORS.pending;
  }

  if (lessonClass?.status === 'finished') {
    return STATUS_COLORS.finished;
  }

  return TYPE_COLORS.regular;
}

function getMarkerColorName(lessonClass) {
  if (lessonClass?.status === 'canceled') {
    return STATUS_COLORS.canceled;
  }

  if (lessonClass?.status === 'pending') {
    return STATUS_COLORS.pending;
  }

  if (lessonClass?.status === 'finished') {
    return STATUS_COLORS.finished;
  }

  return TYPE_COLORS.regular;
}

function parseDate(value) {
  if (!value) {
    return null;
  }

  const [date] = String(value).split('T');
  const [year, month, day] = date.split('-').map(Number);

  return new Date(year, month - 1, day);
}

function dateKey(value) {
  const date = value instanceof Date ? value : parseDate(value);

  if (!date) {
    return '';
  }

  return format(date, 'yyyy-MM-dd');
}

function getPaletteColor(theme, colorName) {
  return colorName === 'grey' ? theme.palette.grey[500] : theme.palette[colorName]?.main;
}

function getBorderColor(theme, lessonClass) {
  return getPaletteColor(theme, getBorderColorName(lessonClass));
}

function getMarkerColor(theme, lessonClass) {
  return getPaletteColor(theme, getMarkerColorName(lessonClass));
}

export default function LessonPackageCalendar({ classes }) {
  const theme = useTheme();
  const firstClassDate = useMemo(() => {
    const orderedDates = [...(classes || [])]
      .map((lessonClass) => parseDate(lessonClass.scheduledDate))
      .filter(Boolean)
      .sort((dateA, dateB) => dateA.getTime() - dateB.getTime());

    return orderedDates[0] || new Date();
  }, [classes]);
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(firstClassDate));

  useEffect(() => {
    setCurrentMonth(startOfMonth(firstClassDate));
  }, [firstClassDate]);

  const classesByDay = useMemo(
    () =>
      (classes || []).reduce((acc, lessonClass) => {
        const key = dateKey(lessonClass.scheduledDate);

        if (!acc[key]) {
          acc[key] = [];
        }

        acc[key].push(lessonClass);
        return acc;
      }, {}),
    [classes],
  );

  const monthDays = useMemo(
    () =>
      eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
      }),
    [currentMonth],
  );

  const leadingBlankDays = getDay(startOfMonth(currentMonth));

  return (
    <Card
      variant="outlined"
      sx={{
        p: { xs: 1.5, md: 2 },
        height: 1,
        bgcolor: (theme) => alpha(theme.palette.background.neutral, 0.22),
      }}
    >
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography variant="subtitle1">Calendário</Typography>

          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton size="small" onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}>
              <ChevronLeftIcon />
            </IconButton>

            <Typography variant="subtitle2" sx={{ minWidth: 130, textAlign: 'center' }}>
              {format(currentMonth, 'MMMM yyyy', { locale: ptBR })}
            </Typography>

            <IconButton size="small" onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
              <ChevronRightIcon />
            </IconButton>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
            border: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
            borderRadius: 1.5,
            overflow: 'hidden',
          }}
        >
          {WEEK_DAYS.map((weekDay) => (
            <Typography
              key={weekDay}
              variant="caption"
              color="text.secondary"
              align="center"
              sx={{
                py: 1,
                fontWeight: 700,
                bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
                borderBottom: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.16)}`,
              }}
            >
              {weekDay}
            </Typography>
          ))}

          {Array.from({ length: leadingBlankDays }).map((_, index) => (
            <Box
              key={`blank-${index}`}
              sx={{
                minHeight: { xs: 42, sm: 48 },
                borderRight: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.1)}`,
                borderBottom: (theme) => `1px solid ${alpha(theme.palette.grey[500], 0.1)}`,
              }}
            />
          ))}

          {monthDays.map((day) => {
            const dayClasses = classesByDay[dateKey(day)] || [];
            const firstClass = dayClasses[0];
            const borderColor = getBorderColor(theme, firstClass);
            const backgroundColor = dayClasses.length
              ? alpha(borderColor || theme.palette.primary.main, 0.1)
              : 'transparent';

            return (
              <Box
                key={dateKey(day)}
                sx={{
                  minHeight: { xs: 42, sm: 48 },
                  border: `1px solid ${dayClasses.length ? borderColor : 'transparent'}`,
                  borderRightColor: (theme) =>
                    dayClasses.length ? borderColor : alpha(theme.palette.grey[500], 0.1),
                  borderBottomColor: (theme) =>
                    dayClasses.length ? borderColor : alpha(theme.palette.grey[500], 0.1),
                  bgcolor: backgroundColor,
                  p: 0.6,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    fontWeight: dayClasses.length ? 800 : 500,
                    color: dayClasses.length ? 'text.primary' : 'text.secondary',
                    textAlign: 'right',
                  }}
                >
                  {format(day, 'd')}
                </Typography>

                {!!dayClasses.length && (
                  <Stack direction="row" spacing={0.4} sx={{ mt: 0.75, flexWrap: 'wrap' }}>
                    {dayClasses.slice(0, 3).map((lessonClass) => (
                      <Box
                        key={lessonClass.id}
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: '50%',
                          bgcolor: getMarkerColor(theme, lessonClass),
                        }}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            );
          })}
        </Box>

        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
          {Object.entries(STATUS_LABELS).map(([status, label]) => {
            const color =
              getPaletteColor(theme, STATUS_COLORS[status]) || theme.palette.primary.main;

            return (
              <Stack key={status} direction="row" alignItems="center" spacing={0.75}>
                <Box sx={{ width: 9, height: 9, borderRadius: '50%', bgcolor: color }} />
                <Typography variant="caption" color="text.secondary">
                  {label}
                </Typography>
              </Stack>
            );
          })}

          <Stack direction="row" alignItems="center" spacing={0.75}>
            <Box
              sx={{
                width: 10,
                height: 10,
                borderRadius: 0.5,
                border: `1.5px solid ${theme.palette.grey[500]}`,
              }}
            />
            <Typography variant="caption" color="text.secondary">
              Permuta
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </Card>
  );
}

LessonPackageCalendar.propTypes = {
  classes: PropTypes.array,
};
