import Grid from '@mui/material/Unstable_Grid2';
import useTraining from 'src/hooks/use-training';

import TrainingItem from './training-item';

export default function TrainingsList({ programId, handleOpenSend, sendTrainingStatus }) {
  const { trainings, onTrainingById, onCloneTraining, onDeleteTraining } = useTraining();
  return (
    <Grid container spacing={2} pt={3}>
      <Grid xs={12} sm={12} md={12}>
        {trainings?.map((training) => (
          <TrainingItem
            key={training.id}
            training={training}
            onTrainingById={onTrainingById}
            programId={programId}
            onCloneTraining={onCloneTraining}
            onSendTrainig={handleOpenSend}
            onDeleteTraining={onDeleteTraining}
            sendTrainingStatus={sendTrainingStatus}
          />
        ))}
      </Grid>
    </Grid>
  );
}
