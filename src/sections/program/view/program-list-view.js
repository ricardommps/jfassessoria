'use client';

import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import { RouterLink } from 'src/routes/components';
import { useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import ProgramList from '../program-list';

export default function ProgramListView() {
  const settings = useSettingsContext();

  const { customer, onCustomerById } = useCustomer();
  const { onListPrograms, programs, onListArquivedPrograms, archived } = useProgram();
  const params = useParams();
  const { id } = params;

  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    if (programs && archived) {
      const data = [...programs, ...archived];
      setTableData(data);
    }
  }, [programs, archived]);

  useEffect(() => {
    if (id) {
      onCustomerById(id);
      onListPrograms(id);
      onListArquivedPrograms(id);
    }
  }, [id]);

  const renderTitle = (
    <Stack>
      <Typography variant="h4" gutterBottom>
        Programas
      </Typography>
      {customer && (
        <Typography variant="h6" gutterBottom>
          {customer.name}
        </Typography>
      )}
    </Stack>
  );
  return (
    <Container maxWidth={settings.themeStretch ? false : 'lg'}>
      <CustomBreadcrumbs
        heading={renderTitle}
        links={[
          { name: 'Alunos', href: paths.dashboard.customersRacing },
          {
            name: 'Programas',
            href: paths.dashboard.program.root(id),
          },
          { name: 'Lista' },
        ]}
        action={
          <Button
            component={RouterLink}
            href={paths.dashboard.program.create(id)}
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
          >
            Novo Programa
          </Button>
        }
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      {tableData && <ProgramList tableData={tableData} />}
    </Container>
  );
}
