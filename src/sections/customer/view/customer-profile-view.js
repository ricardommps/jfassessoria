'use client';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { useCallback, useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import useCustomer from 'src/hooks/use-customer';
import { useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import Anamnese from '../anamnese';
import CustomerForm from '../forms/customer-form';
import SecurityForm from '../forms/security-form';
import Notifications from '../notifications';
import ProfileCover from '../profile/profile-cover';

const TABS = [
  {
    value: 'profile',
    label: 'Perfil',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
  {
    value: 'security',
    label: 'Segurança',
    icon: <Iconify icon="mdi:password" width={24} />,
  },
  {
    value: 'notifications',
    label: 'Notificações',
    icon: <Iconify icon="mdi:add-alert" width={24} />,
  },
  {
    value: 'anamnese',
    label: 'Anamnese',
    icon: <Iconify icon="ri:health-book-fill" width={24} />,
  },
];

export default function CustomerProfileView() {
  const { onCustomerById, customer, onClearCustome, changePasswordSuccess, changePasswordStatus } =
    useCustomer();
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const { id } = params;

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  useEffect(() => {
    if (id) {
      onCustomerById(id);
    }
  }, [id]);

  useEffect(() => {
    onClearCustome();
  }, []);

  useEffect(() => {
    if (changePasswordSuccess) {
      enqueueSnackbar('Senha atualizada com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      onClearCustome();
      setLoading(false);
    }
  }, [changePasswordSuccess]);

  useEffect(() => {
    if (changePasswordStatus.error) {
      enqueueSnackbar('Não foi possivel atualizar a senha, tente novamente', {
        autoHideDuration: 3000,
        variant: 'error',
      });
      onClearCustome();
      setLoading(false);
    }
  }, [changePasswordStatus.error]);

  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Perfil"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Alunos', href: paths.dashboard.customer.root },
          { name: customer?.name },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />
      <Card
        sx={{
          mb: 3,
          height: 240,
        }}
      >
        <ProfileCover name={customer?.name} avatar={customer?.avatar} />
        <Tabs
          value={currentTab}
          onChange={handleChangeTab}
          sx={{
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            [`& .${tabsClasses.flexContainer}`]: {
              pr: { md: 3 },
              justifyContent: {
                sm: 'center',
                md: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
              disabled={loading}
            />
          ))}
        </Tabs>
      </Card>
      {currentTab === 'profile' && (
        <CustomerForm customer={customer} loading={loading} setLoading={setLoading} />
      )}
      {currentTab === 'security' && (
        <SecurityForm customer={customer} loading={loading} setLoading={setLoading} />
      )}
      {currentTab === 'notifications' && (
        <Notifications id={customer.id} loading={loading} setLoading={setLoading} />
      )}
      {currentTab === 'anamnese' && <Anamnese id={customer.id} />}
    </Container>
  );
}
