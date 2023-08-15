import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';

import CustomerCard from './customer-card';

export default function CustomerMobile({ handleOpenNewCustomer, setCustomerForm }) {
  const { customers, onListCustomers } = useCustomer();
  const { cloneProgramSuccess } = useProgram();

  useEffect(() => {
    onListCustomers();
  }, []);

  useEffect(() => {
    if (cloneProgramSuccess) {
      onListCustomers();
    }
  }, [cloneProgramSuccess]);

  return (
    <Paper
      sx={{
        px: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack>
        <Stack p={2}>
          <Typography variant="h3">Alunos</Typography>
        </Stack>
        <Stack spacing={2} sx={{ width: '84vw', py: 3, height: '75vh' }}>
          <Scrollbar>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenNewCustomer}
            >
              Novo
            </Button>
            <Card sx={{ backgroundColor: 'rgba(22, 28, 36, 0.8)', mt: 3 }}>
              <CustomerCard customers={customers} setCustomerForm={setCustomerForm} />
            </Card>
          </Scrollbar>
        </Stack>
      </Stack>
    </Paper>
  );
}
