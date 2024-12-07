'use client';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { useCallback, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import { paths } from 'src/routes/paths';

import CustomerForm from '../forms/customer-form';
import ProfileCover from '../profile/profile-cover';

const TABS = [
  {
    value: 'profile',
    label: 'Perfil',
    icon: <Iconify icon="solar:user-id-bold" width={24} />,
  },
];

export default function CustomerNewProfileView() {
  const [loading, setLoading] = useState(false);

  const [currentTab, setCurrentTab] = useState('profile');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Perfil"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Alunos', href: paths.dashboard.customer.root },
          { name: 'Novo Aluno' },
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
        <ProfileCover name={'Novo Aluno'} />
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
      {currentTab === 'profile' && <CustomerForm loading={loading} setLoading={setLoading} />}
    </Container>
  );
}
