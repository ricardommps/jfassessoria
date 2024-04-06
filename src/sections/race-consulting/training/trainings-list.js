import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useState } from 'react';
import useTraining from 'src/hooks/use-training';

import TrainingItem from './training-item';
import TrainingSearch from './training-search';

const defaultFilters = {
  name: '',
};

export default function TrainingsList({ handleOpenSend, sendTrainingStatus, refreshList }) {
  const { trainings, onTrainingById, onCloneTraining, onDeleteTraining } = useTraining();
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: trainings,
    filters,
  });

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  return (
    <Grid container spacing={2} pt={3}>
      <Grid xs={12} sm={12} md={12}>
        <TrainingSearch filters={filters} onFilters={handleFilters} />
        {dataFiltered?.map((training) => (
          <TrainingItem
            key={training.id}
            training={training}
            onTrainingById={onTrainingById}
            onCloneTraining={onCloneTraining}
            onSendTrainig={handleOpenSend}
            onDeleteTraining={onDeleteTraining}
            sendTrainingStatus={sendTrainingStatus}
            refreshList={refreshList}
          />
        ))}
      </Grid>
    </Grid>
  );
}

function applyFilter({ inputData, filters }) {
  const { name } = filters;
  if (inputData) {
    const stabilizedThis = inputData.map((el, index) => [el, index]);

    inputData = stabilizedThis.map((el) => el[0]);

    if (name) {
      inputData = inputData.filter(
        (item) => item.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
      );
    }
  }

  return inputData;
}
