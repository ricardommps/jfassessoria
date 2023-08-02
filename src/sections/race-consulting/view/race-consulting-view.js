'use client';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';
import { hideScroll } from 'src/theme/css';

import Customer from '../customer/customer';
import CustomerForm from '../customer-form/customer-form';
import Program from '../program/program';
import Training from '../training/training';
export default function RaceConsultingView() {
  const { programs, onClearPrograms, onClearProgram } = useProgram();
  const { onShowTraining, onClearTrainings, showTraining } = useTraining();
  const { onClearCustome } = useCustomer();
  const [customerForm, setCustomerForm] = useState(false);

  const handleOpenNewCustomer = () => {
    onClearProgram();
    onClearPrograms();
    onClearProgram();
    onShowTraining(false);
    onClearTrainings();
    onClearCustome();
    setCustomerForm(true);
  };

  const handleCloseNewCustomer = () => {
    setCustomerForm(false);
  };

  useEffect(() => {
    if (showTraining) {
      setTimeout(() => {
        const element = document.getElementById('training');
        element.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }, [showTraining]);

  return (
    <Container maxWidth={false} sx={{ height: 1 }}>
      <Typography
        variant="h4"
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      >
        Assessoria de Corrida
      </Typography>
      <Stack
        spacing={3}
        direction="row"
        alignItems="flex-start"
        sx={{
          p: 0.25,
          height: 1,
          overflowY: 'hidden',
          ...hideScroll.x,
        }}
      >
        <Customer
          handleOpenNewCustomer={handleOpenNewCustomer}
          customerForm={customerForm}
          setCustomerForm={setCustomerForm}
          programs={programs}
        />
        {!programs && customerForm && (
          <CustomerForm handleCloseNewCustomer={handleCloseNewCustomer} />
        )}
        {programs && <Program />}
        {showTraining && <Training />}
      </Stack>
    </Container>
  );
}
