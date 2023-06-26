'use client';

// @mui
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { alpha, useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { _usersDashboard } from 'src/_mock';
// components
import { useSettingsContext } from 'src/components/settings';

import ListUsers from '../list-users/list-users';
import RegisteredPrograms from '../registeredPrograms/registered-programs';
import UsersActive from '../users-active';

// ----------------------------------------------------------------------

export default function DashboardView() {
  const settings = useSettingsContext();
  const theme = useTheme();
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={6}>
          <UsersActive
            title="ALUNOS CADASTRADOS"
            chart={{
              colors: [
                theme.palette.success.main,
                theme.palette.warning.main,
                theme.palette.error.main,
              ],
              series: [
                { label: 'Ativos', value: 10 },
                { label: 'Expirados', value: 3 },
                { label: 'Bloqueados', value: 1 },
              ],
            }}
          />
        </Grid>
        <Grid xs={12} md={6}>
          <RegisteredPrograms />
        </Grid>
        <Grid xs={12} md={8}>
          <ListUsers
            title="Alunos"
            tableData={_usersDashboard}
            tableLabels={[
              { id: 'name', label: 'Nome' },
              { id: 'trainingProgram', label: 'Programa' },
              { id: 'activationDate', label: 'Data de Ativação' },
              { id: 'type', label: 'Tipo' },
              { id: 'status', label: 'Status' },
              { id: '' },
            ]}
          />
        </Grid>
        <Grid xs={12} md={4}>
          <Box
            sx={{
              mt: 5,
              width: 1,
              height: 320,
              borderRadius: 2,
              bgcolor: () => alpha(theme.palette.grey[500], 0.04),
              border: () => `dashed 1px ${theme.palette.divider}`,
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
