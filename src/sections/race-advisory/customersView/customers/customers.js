import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import CardTitle from 'src/sections/programsView/components/card-title';
import { hideScroll } from 'src/theme/css';

import { CustomersList } from './customers-list';

export function Customers({
  customers,
  customersStatus,
  onListCustomers,
  handleEditCustomer,
  handleOpenProgram,
}) {
  useEffect(() => {
    onListCustomers();
  }, []);
  return (
    <Grid xs={12} md={8}>
      <Card sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Scrollbar>
          <CardTitle title="Alunos - Assessoria de Corrida" />
          <CardContent>
            <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
              Novo
            </Button>
            <Card sx={{ backgroundColor: 'rgba(22, 28, 36, 0.8)', mt: 3 }}>
              <CustomersList
                customers={customers}
                customersStatus={customersStatus}
                handleEditCustomer={handleEditCustomer}
                handleOpenProgram={handleOpenProgram}
              />
            </Card>
          </CardContent>
        </Scrollbar>
      </Card>
    </Grid>
  );
}

Customers.propTypes = {
  handleSelectCurrentCustomer: PropTypes.func,
  customers: PropTypes.array,
  customersStatus: PropTypes.object,
  onListCustomers: PropTypes.func,
  handleEditCustomer: PropTypes.func,
  handleOpenProgram: PropTypes.func,
};
