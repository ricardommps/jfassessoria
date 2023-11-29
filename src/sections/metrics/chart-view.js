import CloseIcon from '@mui/icons-material/Close';
import { Stack } from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';

import PerformaceMetrics from './charts/performance-metrics';
import PHMetrics from './charts/ph-metrics';
export default function ChartView({ open, onClose, chartData, onConfirm, type, ...other }) {
  const [dataItems, setDataItens] = useState(null);

  const formatedMetrics = () => {
    const copycChartData = [...chartData];
    const categories = [];
    const data = [];
    copycChartData.map((item) =>
      categories.push(format(new Date(item.date_published), 'dd/MM/yyyy')),
    );
    copycChartData.map((item) => data.push(type === 1 ? mediaPaces(item.tf_paces) : item.pace));
    const chartItems = {
      categories: [...categories],
      series: [
        {
          data: [
            {
              name: 'Pace',
              data: [...data],
            },
          ],
        },
      ],
    };
    setDataItens(chartItems);
  };

  const formatedPHMetrics = () => {
    const copycChartData = [...chartData];
    const categories = [];
    const dataPace = [];
    const paceVla = [];
    const paceVlan = [];

    copycChartData.map((item) =>
      categories.push(format(new Date(item.reference_month), 'dd/MM/yyyy')),
    );
    copycChartData.map((item) => dataPace.push(item.pace));
    copycChartData.map((item) => paceVla.push(item.pace_vla));
    copycChartData.map((item) => paceVlan.push(item.pace_vlan));
    const chartItems = {
      categories: [...categories],
      series: [
        {
          data: [
            {
              name: 'Pace',
              data: [...dataPace],
            },
            {
              name: 'Pace Vla',
              data: [...paceVla],
            },
            {
              name: 'Pace Vlan',
              data: [...paceVlan],
            },
          ],
        },
      ],
    };
    setDataItens(chartItems);
  };
  const dataFormated = () => {
    if (type === 3) {
      formatedPHMetrics();
    } else {
      formatedMetrics();
    }
  };
  const mediaPaces = (paces) => {
    const soma = paces.reduce((t, n) => Number(n) + Number(t), 0);
    const media = soma / paces.length;
    return Number(media.toFixed(2));
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
