'use client';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
// @mui
import Chart, { useChart } from 'src/components/chart';

// components

// ----------------------------------------------------------------------

export default function PHMetrics({ chart, ...other }) {
  const { colors, categories, series, options } = chart;

  const chartOptions = useChart({
    colors,
    legend: {
      position: 'top',
      horizontalAlign: 'right',
    },
    xaxis: {
      categories,
    },
    ...options,
  });

  return (
    <>
      <Card {...other}>
        {series.map((item) => (
          <Box key={item.year} sx={{ mt: 3, mx: 3 }}>
            <Chart
              dir="ltr"
              type="area"
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
