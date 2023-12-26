import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import { formatedMetrics, formatedPHMetrics } from 'src/utils/charts';

import PerformaceMetrics from './charts/performance-metrics';
import PHMetrics from './charts/ph-metrics';
export default function ChartView({ open, onClose, chartData, onConfirm, type, ...other }) {
  const [dataItems, setDataItens] = useState(null);

  const dataFormated = () => {
    if (type === 3) {
      setDataItens(formatedPHMetrics(chartData));
    } else {
      setDataItens(formatedMetrics(chartData, type));
    }
  };
  useEffect(() => {
    dataFormated();
  }, []);
  return (
    <Dialog fullWidth maxWidth="md" open={open} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        Gráfico
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 15,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 1, pb: 5, border: 'none' }}>
        <Stack>
          {dataItems && (
            <>
              {type === 3 ? (
                <PHMetrics
                  title="Yearly Sales"
                  subheader="(+43%) than last year"
                  chart={dataItems}
                />
              ) : (
                <PerformaceMetrics title="Métricas de desempenho" chart={dataItems} />
              )}
            </>
          )}
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onClose}>
          Cancelar
        </Button>
        <Button variant="contained" color="success" onClick={onConfirm.onTrue}>
          Gerar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
