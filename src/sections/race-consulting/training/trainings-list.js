import Grid from '@mui/material/Unstable_Grid2';

import TrainingItem from './training-item';

export default function TrainingsList({ programId, handleOpenSend, sendTrainingStatus }) {
  return (
    <Grid container spacing={2} pt={3}>
      <Grid xs={12} sm={12} md={12}>
        <TrainingItem
          programId={programId}
          handleOpenSend={handleOpenSend}
          sendTrainingStatus={sendTrainingStatus}
        />
      </Grid>
    </Grid>
  );
}
