import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import Label from 'src/components/label';
import useProgram from 'src/hooks/use-program';

import ProgramItem from './program-item';
import ProgramSearch from './program-search';

const TYPE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 1, label: 'Corrida' },
  { value: 2, label: 'Força' },
];

const defaultFilters = {
  name: '',
  type: 'all',
};

export default function ProgramasList({
  onSelectedProgram,
  cloneProgramStatus,
  handleOpenSend,
  sendProgramStatus,
}) {
  const { programs, onCloneProgram, onDeleteProgram, onHideProgram } = useProgram();
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
  });

  const handleFilterType = useCallback(
    (event, newValue) => {
      handleFilters('type', newValue);
    },
    [handleFilters],
  );

  const handleFilterName = useCallback(
    (event, newValue) => {
      handleFilters('name', newValue);
    },
    [handleFilters],
  );

  return (
    <Grid container spacing={2} pt={1}>
      <Grid xs={12} sm={12} md={12}>
        <>
          <Stack>
            {filters && (
              <Tabs
                value={filters.type}
                onChange={handleFilterType}
                sx={{
                  px: 2.5,
                  boxShadow: (theme) => `inset 0 -2px 0 0 ${alpha(theme.palette.grey[500], 0.08)}`,
                }}
              >
                {TYPE_OPTIONS.map((tab) => (
                  <Tab
                    key={tab.value}
                    iconPosition="end"
                    value={tab.value}
                    label={tab.label}
                    icon={
                      <Label
                        variant={
                          ((tab.value === 'all' || tab.value === filters.type) && 'filled') ||
                          'soft'
                        }
                        color={
                          (tab.value === 1 && 'success') || (tab.value === 2 && 'info') || 'default'
                        }
                      >
                        {tab.value === 'all' && programs.length}
                        {tab.value === 1 &&
                          programs.filter((item) => !item?.type || item?.type === 1).length}

                        {tab.value === 2 && programs.filter((item) => item?.type === 2).length}
                      </Label>
                    }
                  />
                ))}
              </Tabs>
            )}
          </Stack>
          <ProgramSearch filters={filters} onFilters={handleFilterName} />
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
              onHideProgram={onHideProgram}
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
  if (filters.type === 1) {
    inputData = inputData.filter((item) => item.type === 1 || !item.type);
  }
  if (filters.type === 2) {
    inputData = inputData.filter((item) => item.type === 2);
  }

  return inputData;
}
