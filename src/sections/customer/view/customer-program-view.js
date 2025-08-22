'use client';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Tab from '@mui/material/Tab';
import Tabs, { tabsClasses } from '@mui/material/Tabs';
import { useCallback, useEffect, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import LoadingProgress from 'src/components/loading-progress';
import useCustomer from 'src/hooks/use-customer';
import { useParams } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import ProfileCover from '../profile/profile-cover';
import ProgramsList from '../programs/programs-list';

const TABS = [
  {
    value: 'programs',
    label: 'Programas',
    icon: <Iconify icon="material-symbols:assignment" width={24} />,
  },
];

export default function CustomerProgramView() {
  const params = useParams();
  const { id } = params;
  const { onCustomerById, customer, onClearCustome } = useCustomer();
  const [loading, setLoading] = useState(false);

  const [currentTab, setCurrentTab] = useState('programs');

  const handleChangeTab = useCallback((event, newValue) => {
    setCurrentTab(newValue);
  }, []);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      await onCustomerById(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [id]);

  useEffect(() => {
    onClearCustome();
  }, []);
  return (
    <Container maxWidth={'lg'}>
      <CustomBreadcrumbs
        heading="Perfil"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Alunos', href: paths.dashboard.customer.root },
          { name: 'Perfil', href: paths.dashboard.customer.profile(id) },
          { name: 'Programas' },
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
        <ProfileCover name={`Programas / Treinos -  ${customer?.name}`} avatar={customer?.avatar} />
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
        {loading && <LoadingProgress />}
      </Card>
      {currentTab === 'programs' && <ProgramsList id={id} />}
    </Container>
  );
}
