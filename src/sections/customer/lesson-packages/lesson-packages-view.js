'use client';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import Iconify from 'src/components/iconify';
import LoadingProgress from 'src/components/loading-progress';
import useCustomer from 'src/hooks/use-customer';
import { useCustomerLessonPackages } from 'src/hooks/use-lesson-packages';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import ProfileCover from '../profile/profile-cover';
import LessonPackageSchedule from './components/lesson-package-schedule';
import LessonPackagesList from './components/lesson-packages-list';
import LessonPackagesToolbar from './components/lesson-packages-toolbar';

export default function LessonPackagesView() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const { onCustomerById, customer, onClearCustome } = useCustomer();
  const [loading, setLoading] = useState(false);
  const [currentFilter, setCurrentFilter] = useState('all');
  const [selectedPackageId, setSelectedPackageId] = useState(null);
  const {
    data: lessonPackages = [],
    isLoading: isLoadingPackages,
    error: packagesError,
  } = useCustomerLessonPackages(id);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      await onCustomerById(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id, onCustomerById]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  useEffect(() => {
    onClearCustome();
  }, [onClearCustome]);

  const orderedPackages = useMemo(
    () =>
      [...lessonPackages].sort((packageA, packageB) => {
        const dateA = packageA?.createdAt ? new Date(packageA.createdAt).getTime() : 0;
        const dateB = packageB?.createdAt ? new Date(packageB.createdAt).getTime() : 0;

        if (dateA !== dateB) {
          return dateB - dateA;
        }

        return Number(packageB?.id || 0) - Number(packageA?.id || 0);
      }),
    [lessonPackages],
  );

  const filteredPackages = useMemo(() => {
    if (currentFilter === 'all') {
      return orderedPackages;
    }

    return orderedPackages.filter((lessonPackage) => lessonPackage.status === currentFilter);
  }, [currentFilter, orderedPackages]);

  const selectedPackage = useMemo(
    () => filteredPackages.find((lessonPackage) => lessonPackage.id === selectedPackageId) || null,
    [filteredPackages, selectedPackageId],
  );

  useEffect(() => {
    if (!filteredPackages.length) {
      setSelectedPackageId(null);
      return;
    }

    if (!selectedPackageId || !filteredPackages.some((item) => item.id === selectedPackageId)) {
      setSelectedPackageId(filteredPackages[0].id);
    }
  }, [filteredPackages, selectedPackageId]);

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Pacotes de aulas"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Alunos', href: paths.dashboard.customer.root },
          { name: 'Perfil', href: paths.dashboard.customer.profile(id) },
          { name: 'Pacotes de aulas' },
        ]}
        sx={{
          mb: { xs: 3, md: 5 },
        }}
      />

      <Card sx={{ mb: 3, height: 240 }}>
        <ProfileCover
          name={`Pacotes de aulas - ${customer?.name || ''}`}
          avatar={customer?.avatar}
        />
        {loading && <LoadingProgress />}
      </Card>

      <Card sx={{ p: 3 }}>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'flex-start', sm: 'center' }}
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 3 }}
        >
          <Stack spacing={0.5}>
            <Typography variant="h6">Pacotes de aulas</Typography>
            <Typography variant="body2" color="text.secondary">
              Gerencie os pacotes, valores e cronograma de aulas deste aluno.
            </Typography>
          </Stack>

          <Button
            variant="contained"
            startIcon={<Iconify icon="mingcute:add-line" />}
            onClick={() => router.push(paths.dashboard.customer.lessonPackagesNew(id))}
            sx={{ width: { xs: 1, sm: 'auto' } }}
          >
            Novo pacote
          </Button>
        </Stack>

        <LessonPackagesToolbar currentFilter={currentFilter} onChangeFilter={setCurrentFilter} />

        <LessonPackagesList
          customerId={id}
          packages={filteredPackages}
          loading={isLoadingPackages}
          error={packagesError}
          selectedPackageId={selectedPackageId}
          onSelectPackage={setSelectedPackageId}
        />
      </Card>

      <LessonPackageSchedule lessonPackage={selectedPackage} />
    </Container>
  );
}
