'use client';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import { useResponsive } from 'src/hooks/use-responsive';
import useTraining from 'src/hooks/use-training';
import { hideScroll } from 'src/theme/css';

import CustomerDesktop from '../customer/desktop/customer-desktop';
import CustomerMobile from '../customer/mobile/customer-mobile';
import CustomerForm from '../customer-form/customer-form';
import Archiveds from '../program/archived/archiveds';
import Program from '../program/program';
import Training from '../training/training';
export default function RaceConsultingView() {
  const mdUp = useResponsive('up', 'md');
  const { programs, onClearPrograms, onClearProgram, archived } = useProgram();
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

  const trainingScrollIntoView = useCallback(() => {
    setTimeout(() => {
      const element = document.getElementById('training');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        trainingScrollIntoView();
      }
    }, 800);
  }, []);

  useEffect(() => {
    if (showTraining) {
      trainingScrollIntoView();
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
        {mdUp && (
          <>
            <CustomerDesktop
              handleOpenNewCustomer={handleOpenNewCustomer}
              customerForm={customerForm}
              setCustomerForm={setCustomerForm}
              programs={programs}
              openArchived={!!archived}
            />
            {!programs && customerForm && (
              <CustomerForm handleCloseNewCustomer={handleCloseNewCustomer} />
            )}
            {programs && <Program />}
            {archived && <Archiveds />}
            {showTraining && <Training />}
          </>
        )}
        {!mdUp && (
          <>
            {!customerForm && !programs && (
              <CustomerMobile
                customerForm={customerForm}
                handleOpenNewCustomer={handleOpenNewCustomer}
                setCustomerForm={setCustomerForm}
              />
            )}
            {customerForm && !programs && (
              <CustomerForm handleCloseNewCustomer={handleCloseNewCustomer} isMobile />
            )}
            {programs && <Program isMobile />}
            {archived && <Archiveds />}
          </>
        )}
      </Stack>
    </Container>
  );
}
