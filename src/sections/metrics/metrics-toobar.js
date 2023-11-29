import { Button } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useCallback } from 'react';
import { trainingModules } from 'src/utils/training-modules';
export default function MetricsToolbar({
  filters,
  onFilters,
  disabledFind,
  handleClearFilter,
  handleSubmit,
  typeMetrics,
}) {
  const handleFilterModule = useCallback(
    (event) => {
      onFilters('module', event.target.value);
    },
    [onFilters],
  );

  const handleFilterStartDate = useCallback(
    (newValue) => {
      onFilters('startDate', newValue);
    },
    [onFilters],
  );

  const handleFilterEndDate = useCallback(
    (newValue) => {
      onFilters('endDate', newValue);
    },
    [onFilters],
  );

  return (
    <>
      <Stack
        spacing={2}
        alignItems={{ xs: 'flex-end', md: 'center' }}
        direction={{
          xs: 'column',
          md: 'row',
        }}
        sx={{
          p: 2.5,
          pr: { xs: 2.5, md: 1 },
        }}
      >
        {typeMetrics === 1 && (
          <FormControl
            sx={{
              flexShrink: 0,
              width: { xs: 1, md: 180 },
            }}
          >
            <InputLabel>Módulo</InputLabel>
            <Select
              value={filters.module || ''}
              onChange={handleFilterModule}
              input={<OutlinedInput label="Modulo" />}
              sx={{ textTransform: 'capitalize' }}
            >
              {trainingModules
                .filter((value) => value.metrics)
                .map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        )}

        <DatePicker
          label="Start date"
          value={filters.startDate}
          onChange={handleFilterStartDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />

        <DatePicker
          label="End date"
          value={filters.endDate}
          onChange={handleFilterEndDate}
          slotProps={{ textField: { fullWidth: true } }}
          sx={{
            maxWidth: { md: 180 },
          }}
        />
        <Button variant="contained" size="large" disabled={disabledFind} onClick={handleSubmit}>
          Buscar
        </Button>
        <Button variant="contained" size="large" color={'error'} onClick={handleClearFilter}>
          Limpar
        </Button>
      </Stack>
    </>
  );
}
