import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';

import { CustomersList } from './customer-list';

export default function CustomerDesktop({
  handleOpenNewCustomer,
  customerForm,
  setCustomerForm,
  programs,
}) {
  const settings = useSettingsContext();
  const { customers, onListCustomers, onCustomerById } = useCustomer();
  const { onListPrograms, onClearPrograms, onClearProgram, cloneProgramSuccess } = useProgram();
  const { onShowTraining, onClearTrainings } = useTraining();

  const isNavMini = settings.themeLayout === 'mini';

  const handleOpenProgram = (customerId) => {
    onCustomerById(customerId);
    onListPrograms(customerId);
    setCustomerForm(false);
  };

  const handleOpenCustomer = (id) => {
    onCustomerById(id);
    onClearPrograms();
    onClearProgram();
    onShowTraining(false);
    onClearTrainings();
    setCustomerForm(true);
  };

  useEffect(() => {
    onListCustomers();
  }, []);

  useEffect(() => {
    if (cloneProgramSuccess) {
      onListCustomers();
    }
  }, [cloneProgramSuccess]);

  const getWidth = () => {
    if (customerForm || programs) {
      if (isNavMini) {
        return '60vw';
      }
      return '50vw';
    }

    if (!customerForm || !programs) {
      if (isNavMini) {
        return '84vw';
      }
      return '77vw';
    }
    return '50vw';
  };

  return (
    <Paper
      sx={{
        px: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack sx={{ position: 'relative' }}>
        <Backdrop
          sx={{ position: 'absolute', zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={!!programs}
        >
          <div />
        </Backdrop>
        <Stack p={2}>
          <Typography variant="h3">Alunos</Typography>
        </Stack>
        <Stack spacing={2} sx={{ width: getWidth(), py: 3, height: '67vh' }}>
          <Scrollbar>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenNewCustomer}
            >
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