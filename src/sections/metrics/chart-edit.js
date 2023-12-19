import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { LoadingButton } from '@mui/lab';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import Scrollbar from 'src/components/scrollbar';
import { useBoolean } from 'src/hooks/use-boolean';
import { formatedMetrics, formatedPHMetrics } from 'src/utils/charts';

import PerformaceMetrics from './charts/performance-metrics';
import PHMetrics from './charts/ph-metrics';
export default function ChartEdit({ item, open, onClose, handleEditChart, ...other }) {
  const onDelete = useBoolean();
  const [dataItems, setDataItens] = useState(null);
  const dataFormated = () => {
    if (Number(item.type) === 3) {
      setDataItens(formatedPHMetrics(item.chartData));
    } else {
      setDataItens(formatedMetrics(item.chartData, Number(item.type)));
    }
  };
  useEffect(() => {
    dataFormated();
  }, []);
  return (
    <Drawer
      open={open}
      anchor="right"
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: 460 },
      }}
      {...other}
    >
      <Scrollbar sx={{ height: 1 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ p: 2.5 }}>
          <Typography variant="h6"> {item.title} </Typography>
          <IconButton color={'default'} onClick={onClose}>
            <ArrowCircleLeftIcon />
          </IconButton>
        </Stack>
        <Stack>
          {dataItems && (
            <>
              {Number(item.type === 3) ? (
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
      </Scrollbar>
      <Stack sx={{ p: 2.5 }} spacing={2}>
        {false && (
          <Button fullWidth variant="contained" color="error" onClick={onDelete.onTrue}>
            Deletar
          </Button>
        )}

        <Button fullWidth variant="contained" onClick={() => handleEditChart()}>
          Editar
        </Button>
      </Stack>
      {onDelete.value && (
        <ConfirmDialog
          open={onDelete.value}
          onClose={onDelete.onFalse}
          title={'Deseja DELETAR o gráfico?'}
          content={
            <>
              <Typography>{item.title}</Typography>
            </>
          }
          action={
            <LoadingButton variant="contained" color="success">
              Deletar
            </LoadingButton>
          }
        />
      )}
    </Drawer>
  );
}
