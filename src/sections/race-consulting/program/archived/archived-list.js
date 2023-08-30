import Grid from '@mui/material/Unstable_Grid2';
import { useCallback, useState } from 'react';
import useProgram from 'src/hooks/use-program';

import ProgramSearch from '../program-search';
import ArchivedItem from './archived-item';

const defaultFilters = {
  name: '',
};

export default function ArchivedList({ handleOpenSend }) {
  const { archived, archivedStatus, onShowProgram, onDeleteProgram } = useProgram();
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: archived,
    filters,
  });

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);
  return (
    <Grid container spacing={2} pt={1}>
      <Grid xs={12} sm={12} md={12}>
        <>
          <ProgramSearch filters={filters} onFilters={handleFilters} />
          {dataFiltered?.map((item) => (
            <ArchivedItem
              key={item.id}
              archived={item}
              archivedStatus={archivedStatus}
              onShowProgram={onShowProgram}
              onDeleteProgram={onDeleteProgram}
              onSendProgram={handleOpenSend}
            />
          ))}
        </>
      </Grid>
    </Grid>
  );
}

function applyFilter({ inputData, filters }) {
  const { name } = filters;

  const stabilizedThis = inputData.map((el, index) => [el, index]);

  inputData = stabilizedThis.map((el) => el[0]);

  if (name) {
    inputData = inputData.filter(
      (customer) => customer.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }
  return inputData;
}
