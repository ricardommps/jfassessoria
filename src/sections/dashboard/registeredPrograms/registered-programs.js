import { useTheme } from '@emotion/react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import useProgram from 'src/hooks/use-program';
import { useResponsive } from 'src/hooks/use-responsive';

import AllPrograms from '../all-programs/AllPrograms';
import ChartContainer from './chartContainer';

export default function RegisteredPrograms({ ...other }) {
  const smUp = useResponsive('up', 'sm');
  const theme = useTheme();
  const { onListAllChart, allChart, allChartStatus } = useProgram();

  const getDifficultyLevel = (level) => {
    if (allChart) {
      const difficultyLevel = allChart?.filter((program) => program.difficultyLevel === level);
      return difficultyLevel.length;
    }
    return 0;
  };

  const getStatus = (status) => {
    if (allChart) {
      const statusProgram = allChart?.filter((program) => program.active === status);
      return statusProgram.length;
    }
    return 0;
  };

  useEffect(() => {
    onListAllChart();
  }, []);

  return (
    <Card {...other} sx={{ height: '55vh' }}>
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
              PROGRAMAS CADASTRADOS
            </Typography>
          </div>

          {allChartStatus.loading ? (
            <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative', height: '50vh' }}>
              <Box
                sx={{
                  mt: 5,
                  width: 1,
                  height: 320,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress color="error" />
              </Box>
            </Stack>
          ) : (
            <AllPrograms
              chart={{
                colors: [theme.palette.success.main, theme.palette.error.main],
                series: [
                  { label: 'Ativos', value: getStatus(true) },
                  { label: 'Bloqueados', value: getStatus(false) },
                ],
              }}
            />
          )}
        </Stack>

        {/* <Stack
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

          {allChartStatus.loading ? (
            <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative', height: '50vh' }}>
              <Box
                sx={{
                  mt: 5,
                  width: 1,
                  height: 320,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <CircularProgress color="error" />
              </Box>
            </Stack>
          ) : (
            <ChartContainer
              chart={{
                colors: [
                  theme.palette.success.main,
                  theme.palette.warning.main,
                  theme.palette.error.main,
                ],
                series: [
                  { label: 'Iniciante', value: getDifficultyLevel('Iniciante') },
                  { label: 'Intermediário', value: getDifficultyLevel('Intermediário') },
                  { label: ' Avançado', value: getDifficultyLevel('Avançado') },
                ],
              }}
            />
          )}
        </Stack> */}
      </Stack>
    </Card>
  );
}
