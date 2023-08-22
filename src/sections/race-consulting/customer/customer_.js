import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useSettingsContext } from 'src/components/settings';
import { useBoolean } from 'src/hooks/use-boolean';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import { useResponsive } from 'src/hooks/use-responsive';
import useTraining from 'src/hooks/use-training';

import Payment from '../payment/payment';
import { CustomersList } from './desktop/customer-list';
import CustomerCard from './mobile/customer-card';

export default function Customer({
  handleOpenNewCustomer,
  customerForm,
  setCustomerForm,
  programs,
}) {
  const settings = useSettingsContext();
  const mdUp = useResponsive('up', 'md');
  const openPayment = useBoolean();
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
        return '87vw';
      }
      return '77vw';
    }
    return '50vw';
  };

  return (
    <>
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
                {mdUp && (
                  <CustomersList
                    customers={customers}
                    handleOpenProgram={handleOpenProgram}
                    handleOpenCustomer={handleOpenCustomer}
                    openPayment={openPayment}
                  />
                )}
                {!mdUp && <CustomerCard customers={customers} />}
              </Card>
            </Scrollbar>
          </Stack>
        </Stack>
      </Paper>
      <Payment open={openPayment.value} onClose={openPayment.onFalse} />
    </>
  );
}
