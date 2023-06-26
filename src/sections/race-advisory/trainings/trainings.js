import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import { useResponsive } from 'src/hooks/use-responsive';

import TrainingNewEditForm from './training-form';
import TrainingsList from './trainings-list';
export default function Trainings({ openTrainings, onCloseTrainings, currentProgram }) {
  const mdUp = useResponsive('up', 'md');

  const [openFormTraining, setOpenFormTraining] = useState(false);
  const [currentTraining, setCurrentTraining] = useState(null);

  const handleOpenFormTraining = () => {
    setOpenFormTraining(true);
  };

  const handleCloseFormTraining = () => {
    setOpenFormTraining(false);
    setCurrentTraining(null);
  };
  const handleCloseTrainings = () => {
    setOpenFormTraining(false);
    onCloseTrainings();
    setCurrentTraining(null);
  };

  const handleSelectCurrentTraining = (treiningSelected) => {
    setCurrentTraining(treiningSelected);
    setOpenFormTraining(true);
  };
  const renderHead = (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{ py: 2, pr: 1, pl: 2.5 }}
    >
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Treinos
      </Typography>

      <IconButton onClick={handleCloseTrainings}>
        <Iconify icon="mingcute:close-line" />
      </IconButton>
    </Stack>
  );
  return (
    <Drawer
      anchor="right"
      open={openTrainings}
      onClose={handleCloseTrainings}
      slotProps={{
        backdrop: { invisible: true },
      }}
      PaperProps={{
        sx: { width: mdUp ? 380 : '90%' },
      }}
    >
      {renderHead}
      <Stack p={2}>
        {!openFormTraining && (
          <Stack sx={{ width: 'fit-content' }}>
            <Button
              variant="contained"
              startIcon={<Iconify icon="mingcute:add-line" />}
              onClick={handleOpenFormTraining}
            >
              Novo
            </Button>
          </Stack>
        )}
        {!openFormTraining && <TrainingsList onSelectedTraining={handleSelectCurrentTraining} />}
        {openFormTraining && (
          <TrainingNewEditForm
            currentTraining={currentTraining}
            currentProgram={currentProgram}
            onCloseForm={handleCloseFormTraining}
          />
        )}
      </Stack>
    </Drawer>
  );
}

Trainings.propTypes = {
  openTrainings: PropTypes.bool,
  onCloseTrainings: PropTypes.func,
  currentProgram: PropTypes.object,
};
