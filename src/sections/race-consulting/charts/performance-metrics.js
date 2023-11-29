import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
// @mui
import { useTheme } from '@mui/material/styles';
import Chart, { useChart } from 'src/components/chart';
// components

// components
export default function PerformaceMetrics({ title, subheader, chart, ...other }) {
  const theme = useTheme();
  const {
    colors = [
      [theme.palette.primary.light, theme.palette.primary.main],
      [theme.palette.warning.light, theme.palette.warning.main],
    ],
    categories,
    series,
    options,
  } = chart;

  const chartOptions = useChart({
    colors: colors.map((colr) => colr[1]),
    fill: {
      type: 'gradient',
      gradient: {
        colorStops: colors.map((colr) => [
          { offset: 0, color: colr[0] },
          { offset: 100, color: colr[1] },
        ]),
      },
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  return (
    <>
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        {series.map((item, index) => (
          <Box key={index} sx={{ mt: 3, mx: 3 }}>
            <Chart
              dir="ltr"
              type="line"
              series={item.data}
              options={chartOptions}
              height={364}
              width="100%"
            />
          </Box>
        ))}
      </Card>
    </>
  );
}
