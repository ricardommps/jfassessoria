'use client';

import Container from '@mui/material/Container';
import { useEffect } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import { useSettingsContext } from 'src/components/settings';
import useCustomer from 'src/hooks/use-customer';
import { useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import ProgramCreate from '../form/program-create';
export default function ProgramCreateView() {
  const params = useParams();
  const settings = useSettingsContext();
  const { customer, onCustomerById } = useCustomer();
  const { id } = params;

  useEffect(() => {
    if (id) {
      onCustomerById(id);
    }
  }, [id]);

  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading="Novo programa"
        links={[
          { name: 'Alunos', href: paths.dashboard.customersRacing },
          {
            name: 'Programas',
            href: paths.dashboard.program.root(id),
          },
          { name: 'Novo Programa' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {customer && <ProgramCreate customer={customer} />}
    </Container>
  );
}
