import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import useProgram from 'src/hooks/use-program';

import ProgramItem from './program-item';
import ProgramSearch from './program-search';

const defaultFilters = {
  name: '',
};

export default function ProgramasList({
  onSelectedProgram,
  cloneProgramStatus,
  handleOpenSend,
  sendProgramStatus,
}) {
  const { programs, onCloneProgram, onDeleteProgram } = useProgram();
  const [filters, setFilters] = useState(defaultFilters);

  const dataFiltered = applyFilter({
    inputData: programs,
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
          {dataFiltered?.map((program) => (
            <ProgramItem
              key={program.id}
              program={program}
              onCloneProgram={onCloneProgram}
              onSelectedProgram={onSelectedProgram}
              onSendProgram={handleOpenSend}
              onDeleteProgram={onDeleteProgram}
              cloneProgramStatus={cloneProgramStatus}
              sendProgramStatus={sendProgramStatus}
            />
          ))}
        </>
      </Grid>
    </Grid>
  );
}

ProgramasList.propTypes = {
  onSelectedProgram: PropTypes.func,
};

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
