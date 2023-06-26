import { CardContent } from '@mui/material';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import CardTitle from 'src/sections/programsView/components/card-title';
import { hideScroll } from 'src/theme/css';

import Programs from '../programs/programs';

export function Actions({
  currentCustomer,
  currentProgram,
  action,
  onOpenForm,
  onCloseForm,
  openForm,
  onOpenTrainings,
  onCloseTrainings,
  onSelectProgram,
  openTrainings,
  onCancel,
  handleGoBackTrainings,
}) {
  const getTitle = () => {
    switch (action) {
      case 'profile':
        return 'Cadastro de aluno';
      case 'anamnese':
        return 'Anamnese';
      case 'program':
        return 'Programa de Corrida';
      default:
        return 'Cadastro de aluno';
    }
  };
  return (
    <Grid xs={12} md={4} disabled>
      <Card sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Scrollbar>
          <CardTitle title={getTitle()} />
          <CardContent>
            {action === 'program' && (
              <Programs
                currentCustomer={currentCustomer}
                currentProgram={currentProgram}
                onOpenForm={onOpenForm}
                onCloseForm={onCloseForm}
                openForm={openForm}
                onOpenTrainings={onOpenTrainings}
                onCloseTrainings={onCloseTrainings}
                onSelectProgram={onSelectProgram}
                openTrainings={openTrainings}
                onCancel={onCancel}
                handleGoBackTrainings={handleGoBackTrainings}
              />
            )}
          </CardContent>
        </Scrollbar>
      </Card>
    </Grid>
  );
}

Actions.propTypes = {
  action: PropTypes.string,
  currentCustomer: PropTypes.object,
  currentProgram: PropTypes.object,
  onOpenForm: PropTypes.func,
  onCloseForm: PropTypes.func,
  openForm: PropTypes.bool,
  onOpenTrainings: PropTypes.func,
  onCloseTrainings: PropTypes.func,
  onSelectProgram: PropTypes.func,
  openTrainings: PropTypes.bool,
  onCancel: PropTypes.func,
  handleGoBackTrainings: PropTypes.func,
};
