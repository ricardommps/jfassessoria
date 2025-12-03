import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import TrainingMetrics from './TrainingMetrics';
// Funções auxiliares para formatação de data
const formatDate = (date, format) => {
  const d = new Date(date);
  if (format === 'DD/MM') {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    return `${day}/${month}`;
  }
  return date;
};

const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const startOfWeek = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  return new Date(d.setDate(diff));
};

const endOfWeek = (date) => {
  const start = startOfWeek(date);
  return addDays(start, 6);
};

const isBetween = (date, start, end) => {
  const d = new Date(date);
  return d >= start && d <= end;
};

export default function TrimpStackedBarChart({ data }) {
  const [weekOffset, setWeekOffset] = useState(0);

  const today = new Date();
  const weekStart = startOfWeek(addDays(today, weekOffset * 7));
  const weekEnd = endOfWeek(weekStart);

  const filteredData = data.filter((item) =>
    isBetween(new Date(item.executionDay), weekStart, weekEnd),
  );

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    const day = addDays(weekStart, i);
    weekDays.push(day.toISOString().split('T')[0]);
  }

  const grouped = {};
  weekDays.forEach((day) => {
    grouped[day] = { running: 0, nonRunning: 0 };
  });

  filteredData.forEach((item) => {
    const day = new Date(item.executionDay).toISOString().split('T')[0];
    if (grouped[day]) {
      if (item.running) {
        grouped[day].running += item.trimp;
      } else {
        grouped[day].nonRunning += item.trimp;
      }
    }
  });

  const chartData = weekDays.map((day) => ({
    day,
    label: formatDate(day, 'DD/MM'),
    Corrida: grouped[day].running,
    Força: grouped[day].nonRunning,
  }));

  const dailyTrimpValues = chartData.map((d) => d.Corrida + d.Força);

  const hasPrevWeek = useMemo(() => {
    const prevStart = startOfWeek(addDays(weekStart, -7));
    const prevEnd = endOfWeek(prevStart);
    return data.some((d) => isBetween(new Date(d.executionDay), prevStart, prevEnd));
  }, [data, weekOffset]);

  const hasNextWeek = useMemo(() => {
    const nextWeekStart = startOfWeek(addDays(weekStart, 7));
    const currentWeekStart = startOfWeek(today);
    return nextWeekStart <= currentWeekStart;
  }, [weekOffset]);

  return (
    <Box sx={{ p: 2 }}>
      <Paper
        sx={{
          p: 2,
          bgcolor: '#1a1a1a',
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <IconButton
            disabled={!hasPrevWeek}
            onClick={() => setWeekOffset((prev) => prev - 1)}
            sx={{
              color: 'white',
              opacity: hasPrevWeek ? 1 : 0.2,
            }}
          >
            <ChevronLeft />
          </IconButton>

          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {chartData[0]?.label ?? '--'} - {chartData[6]?.label ?? '--'}
          </Typography>

          <IconButton
            disabled={!hasNextWeek}
            onClick={() => setWeekOffset((prev) => prev + 1)}
            sx={{
              color: 'white',
              opacity: hasNextWeek ? 1 : 0.2,
            }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -10, bottom: 5 }}
            barSize={45}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="label" stroke="#999" style={{ fontSize: '12px' }} />
            <YAxis stroke="#999" style={{ fontSize: '12px' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} iconType="square" />
            <Bar dataKey="Força" stackId="a" fill="#f55858" />
            <Bar dataKey="Corrida" stackId="a" fill="#fc1c1c" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <TrainingMetrics values={dailyTrimpValues} />
    </Box>
  );
}
