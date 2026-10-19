import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import EmptyContent from 'src/components/empty-content';
import LoadingProgress from 'src/components/loading-progress';

import LessonPackageCard from './lesson-package-card';

export default function LessonPackagesList({
  customerId,
  packages,
  loading,
  error,
  selectedPackageId,
  onSelectPackage,
}) {
  if (loading) {
    return (
      <Box sx={{ position: 'relative', minHeight: 180 }}>
        <LoadingProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">Não foi possível carregar os pacotes de aulas.</Alert>;
  }

  if (!packages?.length) {
    return (
      <EmptyContent
        title="Nenhum pacote encontrado"
        description="Crie um novo pacote de aulas para este aluno."
        sx={{ py: 6 }}
      />
    );
  }

  return (
    <Grid container spacing={2.5}>
      {packages.map((lessonPackage) => (
        <Grid key={lessonPackage.id} xs={12} md={6}>
          <LessonPackageCard
            customerId={customerId}
            lessonPackage={lessonPackage}
            selected={lessonPackage.id === selectedPackageId}
            onViewSchedule={onSelectPackage}
          />
        </Grid>
      ))}
    </Grid>
  );
}

LessonPackagesList.propTypes = {
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  error: PropTypes.object,
  loading: PropTypes.bool,
  onSelectPackage: PropTypes.func,
  packages: PropTypes.array,
  selectedPackageId: PropTypes.number,
};
