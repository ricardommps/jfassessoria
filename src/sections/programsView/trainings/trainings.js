import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify/iconify';
import { hideScroll } from 'src/theme/css';

import CardTitle from '../components/card-title';
import GoBackButton from '../components/go-back-button';
import TrainingNewEditForm from './training-form';
import { TrainingsList } from './trainings-list/trainings-list';

export default function Trainings({
  open,
  currentProgram,
  currentTraining,
  onOpen,
  onClose,
  openForm,
  setCurrentTraining,
  ...other
}) {
  const program_id = currentProgram?.id;
  return (
    <Grid xs={12} md={4}>
      <Card {...other} sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Backdrop open={!open} sx={{ position: 'absolute' }}>
          <div />
        </Backdrop>
        {openForm ? (
          <GoBackButton
            onClick={onClose}
            title={currentTraining ? 'Editar Treino' : 'Novo Treino'}
          />
        ) : (
          <CardTitle title="Treinos" />
        )}
        <CardContent>
          {openForm ? (
            <TrainingNewEditForm
              currentTraining={currentTraining}
              onClose={onClose}
              program_id={program_id}
            />
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                disabled={!open}
                onClick={onOpen}
              >
                Novo
              </Button>
              {open && <TrainingsList setCurrentTrainingEdit={setCurrentTraining} />}
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

Trainings.propTypes = {
  open: PropTypes.bool,
  currentProgram: PropTypes.object,
  currentTraining: PropTypes.object,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  openForm: PropTypes.bool,
  setCurrentTraining: PropTypes.func,
};
