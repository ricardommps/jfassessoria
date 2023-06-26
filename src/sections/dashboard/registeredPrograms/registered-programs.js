import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useResponsive } from 'src/hooks/use-responsive';

import ChartContainer from './chartContainer';

export default function RegisteredPrograms({ ...other }) {
  const smUp = useResponsive('up', 'sm');
  return (
    <Card {...other}>
      <CardHeader title="PROGRAMAS CADASTRADOS" sx={{ mb: 1 }} />
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        divider={
          <Divider
            orientation={smUp ? 'vertical' : 'horizontal'}
            flexItem
            sx={{ borderStyle: 'dashed' }}
          />
        }
      >
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={3}
          sx={{ width: 1, py: 5 }}
        >
          <div>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              OBJETIVOS
            </Typography>
          </div>

          <ChartContainer
            chart={{
              series: [
                { label: 'Definição', value: 4 },
                { label: 'Ganhar Massa Muscular', value: 2 },
                { label: 'Condicionamento físico', value: 2 },
              ],
            }}
          />
        </Stack>

        <Stack
          direction="column"
          alignItems="center"
          justifyContent="center"
          spacing={3}
          sx={{ width: 1, py: 5 }}
        >
          <div>
            <Typography variant="body2" sx={{ opacity: 0.72 }}>
              DIFICULDADE
            </Typography>
          </div>

          <ChartContainer
            chart={{
              series: [
                { label: 'Iniciante', value: 5 },
                { label: 'Intermediário', value: 2 },
                { label: ' Avançado', value: 1 },
                { label: ' Expert', value: 0 },
              ],
            }}
          />
        </Stack>
      </Stack>
    </Card>
  );
}
