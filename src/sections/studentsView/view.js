'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
// components
import { useSettingsContext } from 'src/components/settings';

import { Actions } from './actions/actions';
import { Students } from './students/students';

// ----------------------------------------------------------------------

export default function StudentsView() {
  const settings = useSettingsContext();
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [action, setAction] = useState(null);

  const handleSelectCurrentCustomer = (customer, actionSelected) => {
    setCurrentCustomer(customer);
    setAction(actionSelected);
  };
  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Students handleSelectCurrentCustomer={handleSelectCurrentCustomer} />
        <Actions currentCustomer={currentCustomer} action={action} />
      </Grid>
    </Container>
  );
}
