'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import { useEffect } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import useCustomer from 'src/hooks/use-customer';
import { paths } from 'src/routes/paths';

import CustomerList from '../customer-list';
export default function CustomerListView() {
  const { customers, onListCustomers } = useCustomer();
  useEffect(() => {
    onListCustomers();
  }, []);

  return (
    <>
      <Container maxWidth={'lg'}>
        <CustomBreadcrumbs
          heading="Alunos"
          links={[
            { name: 'Home', href: paths.dashboard.root },
            { name: 'Alunos', href: paths.dashboard.customer.root },
            { name: 'Listas' },
          ]}
          action={
            <Button variant="contained" startIcon={<Iconify icon="mingcute:add-line" />}>
              Novo
            </Button>
          }
          sx={{
            mb: { xs: 3, md: 5 },
          }}
        />
        <Card>
          <CustomerList />
        </Card>
      </Container>
    </>
  );
}
