'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { useState } from 'react';
// components
import { useSettingsContext } from 'src/components/settings';

import { Actions } from '../actions-card/actions-card';
import Trainings from '../trainings/trainings';
import { Customers } from './customers/customers';

// ----------------------------------------------------------------------

export default function CustomersRaceView() {
  const settings = useSettingsContext();

  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [action, setAction] = useState(null);
  const [openFormProgram, setOpenFormProgram] = useState(false);
  const [openTrainings, setOpenTrainings] = useState(false);

  const handleSelectCurrentCustomer = (customer, actionSelected) => {
    setCurrentCustomer(customer);
    setAction(actionSelected);
  };

  const handleOpenFormProgram = () => {
    setOpenFormProgram(true);
  };

  const handleCloseFormProgram = () => {
    setOpenFormProgram(false);
  };

  const handleOpenTrainings = (program) => {
    setOpenFormProgram(true);
    setCurrentProgram(program);
    setOpenTrainings(true);
  };

  const handleGoBackTrainings = () => {
    setOpenTrainings(true);
  };

  const handleCloseTrainings = () => {
    setOpenTrainings(false);
  };

  const handleSelectCurrentProgram = (program) => {
    setCurrentProgram(program);
  };

  const handleCancelFormProgram = () => {
    setCurrentProgram(null);
    setOpenTrainings(false);
    setOpenFormProgram(false);
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Customers handleSelectCurrentCustomer={handleSelectCurrentCustomer} />
        <Actions
          currentCustomer={currentCustomer}
          currentProgram={currentProgram}
          action={action}
          openForm={openFormProgram}
          onOpenForm={handleOpenFormProgram}
          onCloseForm={handleCloseFormProgram}
          onOpenTrainings={handleOpenTrainings}
          onCloseTrainings={handleCloseTrainings}
          onSelectProgram={handleSelectCurrentProgram}
          openTrainings={openTrainings}
          onCancel={handleCancelFormProgram}
          handleGoBackTrainings={handleGoBackTrainings}
        />
      </Grid>
      <Trainings
        openTrainings={openTrainings}
        onCloseTrainings={handleCloseTrainings}
        currentProgram={currentProgram}
      />
    </Container>
  );
}
