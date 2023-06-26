// @mui
import { styled, useTheme } from '@mui/material/styles';
import PropTypes from 'prop-types';
// components
import Chart, { useChart } from 'src/components/chart';
// utils
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

const CHART_HEIGHT = 300;

const LEGEND_HEIGHT = 50;

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

export default function ChartContainer({ chart }) {
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
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
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
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <StyledChart dir="ltr" type="pie" series={chartSeries} options={chartOptions} height={200} />
  );
}

ChartContainer.propTypes = {
  chart: PropTypes.object,
};
