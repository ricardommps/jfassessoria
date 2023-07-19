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
import useTraining from 'src/hooks/use-training';

import { CustomersList } from './customer-list';

export default function Customer() {
  const { customers, onListCustomers, onCustomerById } = useCustomer();
  const { onListPrograms, onClearPrograms, onClearProgram } = useProgram();
  const { onShowTraining, onClearTrainings } = useTraining();

  const handleOpenProgram = (customerId) => {
    onCustomerById(customerId);
    onListPrograms(customerId);
  };

  const handleOpenCustomer = (id) => {
    onCustomerById(id);
    onClearPrograms();
    onClearProgram();
    onShowTraining(false);
    onClearTrainings();
  };

  useEffect(() => {
    onListCustomers();
  }, []);

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
        <Stack spacing={2} sx={{ width: '60vw', py: 3, height: '67vh' }}>
          <Scrollbar>
            <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
              Novo
            </Button>
            <Card sx={{ backgroundColor: 'rgba(22, 28, 36, 0.8)', mt: 3 }}>
              <CustomersList
                customers={customers}
                handleOpenProgram={handleOpenProgram}
                handleOpenCustomer={handleOpenCustomer}
              />
            </Card>
          </Scrollbar>
        </Stack>
      </Stack>
    </Paper>
  );
}
