'use client';

// @mui
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect } from 'react';
import { useSettingsContext } from 'src/components/settings';
import useCustomer from 'src/hooks/use-customer';

import Birthday from '../birthday';
import ListUsers from '../list-users/list-users';
import RegisteredPrograms from '../registeredPrograms/registered-programs';
import UsersActive from '../users-active';

const CUSTOMER_TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'expiresDate', label: 'Expiração' },
  { id: 'type', label: 'Tipo' },
  { id: 'status', label: 'Status' },
];

export default function DashboardView() {
  const settings = useSettingsContext();
  const theme = useTheme();

  const { onListCustomers, customersStatus, customers } = useCustomer();

  const getActiveCustomers = () => {
    const isActive = customers.filter((customer) => customer.active);
    return isActive.length;
  };

  const getBlockedCustomers = () => {
    const isABlocked = customers.filter((customer) => !customer.active);
    return isABlocked.length;
  };

  useEffect(() => {
    onListCustomers();
  }, []);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Grid xs={12} md={4}>
          <Birthday />
        </Grid>
        <Grid xs={12} md={4}>
          {customersStatus.loading ? (
            <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
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
            <UsersActive
              title="ALUNOS CADASTRADOS"
              chart={{
                colors: [theme.palette.success.main, theme.palette.error.main],
                series: [
                  { label: 'Ativos', value: getActiveCustomers() },
                  { label: 'Bloqueados', value: getBlockedCustomers() },
                ],
              }}
            />
          )}
        </Grid>

        <Grid xs={12} md={4}>
          <RegisteredPrograms />
        </Grid>
        <Grid xs={12} md={12}>
          <ListUsers title="Alunos" tableData={customers} tableLabels={CUSTOMER_TABLE_HEAD} />
        </Grid>
      </Grid>
    </Container>
  );
}
