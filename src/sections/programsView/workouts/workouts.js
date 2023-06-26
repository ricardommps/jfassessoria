import Backdrop from '@mui/material/Backdrop';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import { workoutsData } from 'src/_mock';
import Iconify from 'src/components/iconify/iconify';
import { hideScroll } from 'src/theme/css';

import GoBackButton from '../components/go-back-button';
import { WorkoutNewEditForm } from './workout-form';
import { WorkoutsList } from './workouts-list/workouts-list';

export default function Workouts({
  open,
  currentTraining,
  currentWorkout,
  onOpen,
  setCurrentWorkout,
  openForm,
  onClose,
  ...other
}) {
  const training_id = currentTraining?.id;
  const { workouts } = workoutsData;
  return (
    <Grid xs={12} md={4} disabled>
      <Card {...other} sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Backdrop open={!open} sx={{ position: 'absolute' }}>
          <div />
        </Backdrop>
        {openForm ? (
          <GoBackButton
            onClick={onClose}
            title={currentWorkout ? 'Editar Exercício' : 'Novo Exercício'}
          />
        ) : (
          <CardHeader title="Exercícios" sx={{ mb: 2 }} />
        )}
        <CardContent>
          {openForm ? (
            <WorkoutNewEditForm
              currentWorkout={currentWorkout}
              onClose={onClose}
              training_id={training_id}
            />
          ) : (
            <>
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                disabled={!open}
                onClick={onOpen}
              >
                Adicionar
              </Button>
              {open && training_id && (
                <WorkoutsList workouts={workouts} setCurrentWorkoutEdit={setCurrentWorkout} />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </Grid>
  );
}

Workouts.propTypes = {
  open: PropTypes.bool,
  currentTraining: PropTypes.object,
  currentWorkout: PropTypes.object,
  setCurrentWorkout: PropTypes.func,
  openForm: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
};
