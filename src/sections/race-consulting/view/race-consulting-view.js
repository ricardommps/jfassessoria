'use client';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect } from 'react';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';
import { hideScroll } from 'src/theme/css';

import Customer from '../customer/customer';
import CustomerForm from '../customer-form/customer-form';
import Program from '../program/program';
import Training from '../training/training';
export default function RaceConsultingView() {
  const { programs } = useProgram();
  const { showTraining } = useTraining();
  useEffect(() => {
    if (showTraining) {
      setTimeout(() => {
        const element = document.getElementById('training');
        element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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
        <Customer />
        {!programs && <CustomerForm />}
        {programs && <Program />}
        {showTraining && <Training />}
      </Stack>
    </Container>
  );
}
