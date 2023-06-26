'use client';

// @mui
import ForwardIcon from '@mui/icons-material/Forward';
import { Button, Stack } from '@mui/material';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Grid from '@mui/material/Unstable_Grid2';
import { useEffect, useState } from 'react';
// components
import { useSettingsContext } from 'src/components/settings';
import { useResponsive } from 'src/hooks/use-responsive';

import Programs from './programs/programs';
import { TopperMenu } from './trainings/styles';
import Trainings from './trainings/trainings';
import Workouts from './workouts/workouts';

// ----------------------------------------------------------------------

export default function ProgramsView() {
  const mdUp = useResponsive('up', 'md');
  const settings = useSettingsContext();
  const [openPrograms, setOpenPrograms] = useState(false);
  const [currentProgram, setCurrentProgram] = useState(null);
  const [openFormTraining, setOpenFormTraining] = useState(false);
  const [openFormWorkouts, setOpenFormWorkouts] = useState(false);
  const [currentTraining, setCurrentTraining] = useState(null);
  const [currentWorkout, setCurrentWorkout] = useState(null);

  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      name: 'Editar o programa',
      id: 1,
    },
    {
      name: 'Editar o treino',
      id: 2,
    },
    {
      name: 'Exercícios',
      id: 3,
    },
  ];

  const handleOpenPrograms = () => {
    setOpenPrograms(true);
  };

  const handleClosePrograms = () => {
    setOpenPrograms(false);
    setCurrentProgram(null);
    setOpenFormTraining(false);
    setOpenFormWorkouts(false);
    setCurrentTraining(null);
    setCurrentWorkout(null);
  };

  const handleOpenFormTraining = () => {
    setOpenFormTraining(true);
  };

  const handleCloseFormTraining = () => {
    setOpenFormTraining(false);
    setOpenFormWorkouts(false);
    setCurrentTraining(null);
  };

  const handleCloseFormWorkout = () => {
    setOpenFormWorkouts(false);
    setCurrentWorkout(null);
  };

  const handleOpenFormWorkouts = () => {
    setOpenFormWorkouts(true);
  };

  useEffect(() => {
    if (currentProgram) {
      setOpenPrograms(true);
      setActiveStep(2);
    }
  }, [currentProgram]);

  useEffect(() => {
    if (currentTraining) {
      setOpenFormTraining(true);
      setActiveStep(3);
    }
  }, [currentTraining]);

  useEffect(() => {
    if (currentWorkout) {
      setOpenFormWorkouts(true);
      setActiveStep(3);
    }
  }, [currentWorkout]);

  const renderCardMobile = (card) => {
    switch (card) {
      case 1:
        return <RenderPrograms />;
      case 2:
        return <RenderTraining />;
      case 3:
        return <RenderWorkouts />;
      default:
        return <RenderPrograms />;
    }
  };
  const RenderPrograms = () => {
    return (
      <Programs
        open={openPrograms}
        onGoBack={handleClosePrograms}
        onOpen={handleOpenPrograms}
        currentProgram={currentProgram}
        setCurrentProgram={setCurrentProgram}
      />
    );
  };

  const RenderTraining = () => {
    return (
      <Trainings
        open={Boolean(currentProgram)}
        currentProgram={currentProgram}
        currentTraining={currentTraining}
        onOpen={handleOpenFormTraining}
        onClose={handleCloseFormTraining}
        openForm={openFormTraining}
        setCurrentTraining={setCurrentTraining}
      />
    );
  };

  const RenderWorkouts = () => {
    return (
      <Workouts
        open={Boolean(currentTraining)}
        currentTraining={currentTraining}
        currentWorkout={currentWorkout}
        openForm={openFormWorkouts}
        setCurrentWorkout={setCurrentWorkout}
        onOpen={handleOpenFormWorkouts}
        onClose={handleCloseFormWorkout}
      />
    );
  };
  const toPrev = () => {
    const result = steps.findIndex((step) => step.id === activeStep);
    const labelButton = result === 0 ? steps[result].name : steps[result - 1].name;
    if (result > 0) {
      return (
        <Button variant="outlined" onClick={() => setActiveStep(activeStep - 1)}>
          {labelButton}
        </Button>
      );
    }
  };

  const toNext = () => {
    const result = steps.findIndex((step) => step.id === activeStep);
    if (currentTraining && activeStep < 3) {
      return (
        <Stack sx={{ float: 'right', display: 'block', marginRight: 2 }}>
          <Button variant="outlined" onClick={() => setActiveStep(activeStep + 1)}>
            {result === steps.length - 1 ? steps[result].name : steps[result + 1].name}
          </Button>
        </Stack>
      );
    }
  };

  return (
    <Container maxWidth={settings.themeStretch ? false : 'xl'}>
      {!mdUp && currentProgram && activeStep > 0 && (
        <Grid container spacing={3}>
          <TopperMenu>
            <Stack>
              <IconButton
                aria-label="delete"
                sx={{ marginLeft: 2, rotate: '180deg' }}
                onClick={handleClosePrograms}
              >
                <ForwardIcon />
              </IconButton>
            </Stack>
            <Stack sx={{ float: 'left', display: 'block', flex: 1 }}>{toPrev()}</Stack>
            {toNext()}
          </TopperMenu>
        </Grid>
      )}
      <Grid container spacing={3}>
        {mdUp ? (
          <>
            <RenderPrograms />
            <RenderTraining />
            <RenderWorkouts />
          </>
        ) : (
          <>{renderCardMobile(activeStep)}</>
        )}
      </Grid>
    </Container>
  );
}
