// @mui
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import { alpha, styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
// components
import Chart, { useChart } from 'src/components/chart';
// utils
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 240;

const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(() => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

// ----------------------------------------------------------------------

export default function UsersActive({ title, subheader, chart, ...other }) {
  const theme = useTheme();

  const { colors, series, options } = chart;

  const chartSeries = series.map((i) => i.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series.map((i) => i.label),
    stroke: { colors: [theme.palette.background.paper] },
    legend: {
      show: false,
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '90%',
          labels: {
            value: {
              formatter: (value) => fNumber(value),
            },
            total: {
              formatter: (w) => {
                const sum = w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                return fNumber(sum);
              },
            },
          },
        },
      },
    },
    ...options,
  });
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 2 }} />

      <StyledChart
        dir="ltr"
        type="donut"
        series={chartSeries}
        options={chartOptions}
        height={200}
      />

      <Stack spacing={2} sx={{ p: 5 }}>
        {series.map((item) => (
          <Stack
            key={item.label}
            spacing={1}
            direction="row"
            alignItems="center"
            sx={{
              typography: 'subtitle2',
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                bgcolor: alpha(theme.palette.grey[500], 0.16),
                borderRadius: 0.75,
                ...(item.label === 'Ativos' && {
                  bgcolor: colors[0],
                }),
                ...(item.label === 'Expirados' && {
                  bgcolor: colors[1],
                }),
                ...(item.label === 'Bloqueados' && {
                  bgcolor: colors[2],
                }),
              }}
            />
            <Box sx={{ color: 'text.secondary', flexGrow: 1 }}>{item.label}</Box>
            {item.value}
          </Stack>
        ))}
      </Stack>
    </Card>
  );
}

UsersActive.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
};
