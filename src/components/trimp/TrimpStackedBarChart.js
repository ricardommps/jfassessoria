import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { Box, IconButton, Paper, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from 'recharts';

import TrainingMetrics from './TrainingMetrics';

export default function TrimpStackedBarChart({ data }) {
  const [weekOffset, setWeekOffset] = useState(0);

  // ==========================================
  // Helpers
  // ==========================================

  const toYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const addDays = (date, days) => {
    const d = new Date(date);
    d.setDate(d.getDate() + days);
    return d;
  };

  // --- Semana inicia no DOMINGO ---
  const startOfWeekSunday = (date) => {
    const d = new Date(date);
    const day = d.getDay(); // 0 = domingo
    return addDays(d, -day);
  };

  const endOfWeekSunday = (date) => addDays(startOfWeekSunday(date), 6);

  const isBetween = (date, start, end) => date >= start && date <= end;

  const formatDate = (value) => {
    const [y, m, d] = value.split('-');
    return `${d}/${m}`;
  };

  // ==========================================
  // Semana atual com offset
  // ==========================================

  const today = new Date();
  const baseDate = addDays(today, weekOffset * 7);

  const weekStart = startOfWeekSunday(baseDate);
  const weekEnd = endOfWeekSunday(baseDate);

  // ==========================================
  // Filtrar dados da semana
  // ==========================================

  const filteredData = data.filter((item) =>
    isBetween(new Date(item.executionDay), weekStart, weekEnd),
  );

  // ==========================================
  // Criar os 7 dias da semana (DOM → SÁB)
  // ==========================================

  const weekDays = [];
  for (let i = 0; i < 7; i++) {
    weekDays.push(toYMD(addDays(weekStart, i)));
  }

  // ==========================================
  // Agrupamento
  // ==========================================

  const grouped = {};
  weekDays.forEach((day) => {
    grouped[day] = { running: 0, nonRunning: 0 };
  });

  filteredData.forEach((item) => {
    const day = item.executionDay.split(' ')[0];
    if (grouped[day]) {
      if (item.running) grouped[day].running += item.trimp;
      else grouped[day].nonRunning += item.trimp;
    }
  });

  // ==========================================
  // Dados para Recharts
  // ==========================================

  const chartData = weekDays.map((day) => ({
    day,
    label: formatDate(day),
    Corrida: grouped[day].running,
    Força: grouped[day].nonRunning,
  }));

  const dailyTrimpValues = chartData.map((d) => d.Corrida + d.Força);

  // ==========================================
  // Navegação
  // ==========================================

  const hasPrevWeek = useMemo(() => {
    const prevStart = addDays(weekStart, -7);
    const prevEnd = addDays(weekEnd, -7);
    return data.some((d) => isBetween(new Date(d.executionDay), prevStart, prevEnd));
  }, [weekOffset]);

  const hasNextWeek = useMemo(() => {
    const nextWeekStart = addDays(weekStart, 7);
    const currentWeekStart = startOfWeekSunday(today);

    return nextWeekStart <= currentWeekStart;
  }, [weekOffset]);

  // ==========================================
  // Render
  // ==========================================

  return (
    <Box sx={{ p: 2 }}>
      <Paper
        sx={{
          p: 2,
          bgcolor: '#1a1a1a',
          borderRadius: 2,
        }}
      >
        {/* Navegação */}
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
            sx={{ color: 'white', opacity: hasPrevWeek ? 1 : 0.2 }}
          >
            <ChevronLeft />
          </IconButton>

          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {chartData[0]?.label ?? '--'} - {chartData[6]?.label ?? '--'}
          </Typography>

          <IconButton
            disabled={!hasNextWeek}
            onClick={() => setWeekOffset((prev) => prev + 1)}
            sx={{ color: 'white', opacity: hasNextWeek ? 1 : 0.2 }}
          >
            <ChevronRight />
          </IconButton>
        </Box>

        {/* Gráfico */}
        <ResponsiveContainer width="100%" height={350}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 5, left: -10, bottom: 5 }}
            barSize={45}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#333" />
            <XAxis dataKey="label" stroke="#999" style={{ fontSize: 12 }} />
            <YAxis stroke="#999" style={{ fontSize: 12 }} />
            <Legend wrapperStyle={{ paddingTop: 20 }} iconType="square" />
            <Bar dataKey="Força" stackId="a" fill="#f55858" />
            <Bar dataKey="Corrida" stackId="a" fill="#fc1c1c" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      <TrainingMetrics values={dailyTrimpValues} />
    </Box>
  );
}
