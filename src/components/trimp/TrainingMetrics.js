import { Alert, Box, Paper, Typography } from '@mui/material';
import React, { useMemo } from 'react';

export default function TrainingMetrics({ values }) {
  const { monotony, strain, alertMessage } = useMemo(() => {
    const sum = values.reduce((acc, n) => acc + n, 0);
    const meanValue = sum / values.length;

    const variance = values.reduce((acc, n) => acc + Math.pow(n - meanValue, 2), 0) / values.length;

    const stdValue = Math.sqrt(variance);

    const monotonyValue = meanValue / (stdValue === 0 ? 1 : stdValue);

    const strainValue = sum * monotonyValue;

    let msg = '';
    if (monotonyValue > 2) {
      msg = '⚠️ Sinal de alerta: risco de overreaching / overtraining!';
    }

    return {
      monotony: monotonyValue,
      strain: strainValue,
      alertMessage: msg,
    };
  }, [values]);

  return (
    <Paper
      sx={{
        p: 2,
        pt: 5.5,
        mt: 2,
        bgcolor: '#1a1a1a',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
        <Typography variant="h6" sx={{ color: 'white' }}>
          Monotonia: {monotony.toFixed(2)}
        </Typography>

        <Typography variant="h6" sx={{ color: 'white' }}>
          Strain: {strain.toFixed(2)}
        </Typography>
      </Box>

      {alertMessage && (
        <Alert
          severity="error"
          sx={{
            mt: 1,
            mb: 2.5,
            bgcolor: 'rgba(211, 47, 47, 0.1)',
            color: '#f44336',
            fontWeight: 'bold',
          }}
        >
          {alertMessage}
        </Alert>
      )}
    </Paper>
  );
}
