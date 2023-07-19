'use client';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
// components
import { useSettingsContext } from 'src/components/settings';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';

import Trainings from '../trainings/trainings';
import CustomerNewEditForm from './customers/customer-form';
import { Customers } from './customers/customers';
import Program from './program/program';

// ----------------------------------------------------------------------

export default function CustomersRaceView() {
  const settings = useSettingsContext();
  const {
    customers,
    customersStatus,
    customerCreate,
    onCreateCustomer,
    onListCustomers,
    customer,
    customerStatus,
    onCustomerById,
    onClearCustome,
    onUpdateCustomer,
    updateCustomerSuccess,
  } = useCustomer();
  const { onClearProgram } = useProgram();

  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [currentProgram] = useState(null);
  const [openTrainings, setOpenTrainings] = useState(false);
  const [openProgram, setOpenProgram] = useState(false);

  const handleEditCustomer = (customer) => {
    setCurrentCustomer(customer);
    onClearProgram();
    setOpenProgram(false);
    onCustomerById(customer?.id);
  };

  const handleOpenProgram = (customer) => {
    onClearProgram();
    setCurrentCustomer(customer);
    setOpenProgram(true);
  };

  const handleCancel = () => {
    onClearCustome();
    setCurrentCustomer(null);
  };

  const handleCloseTrainings = () => {
    setOpenTrainings(false);
  };

  useEffect(() => {
    if (customerCreate) {
      onListCustomers();
      enqueueSnackbar('Create success!', { autoHideDuration: 3000, variant: 'success' });
    }
  }, [customerCreate]);

  useEffect(() => {
    if (updateCustomerSuccess) {
      onListCustomers();
      enqueueSnackbar('Update success!', { autoHideDuration: 3000, variant: 'success' });
      handleCancel();
    }
  }, [updateCustomerSuccess]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      <Grid container spacing={3}>
        <Customers
          customers={customers}
          customersStatus={customersStatus}
          onListCustomers={onListCustomers}
          handleEditCustomer={handleEditCustomer}
          handleOpenProgram={handleOpenProgram}
        />
        {!openProgram && (
          <CustomerNewEditForm
            onCreateCustomer={onCreateCustomer}
            customer={customer}
            loading={customerStatus?.loading}
            onCancel={handleCancel}
            setCurrentCustomer={setCurrentCustomer}
            onUpdateCustomer={onUpdateCustomer}
          />
        )}
        {openProgram && (
          <Program
            customerId={currentCustomer?.id}
            birthDate={currentCustomer.birthDate}
            customerName={currentCustomer.name}
          />
        )}
      </Grid>
      <Trainings
        openTrainings={openTrainings}
        onCloseTrainings={handleCloseTrainings}
        currentProgram={currentProgram}
      />
    </Container>
  );
}
