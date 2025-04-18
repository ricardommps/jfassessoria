import InputAdornment from '@mui/material/InputAdornment';
// @mui
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
// components
import Iconify from 'src/components/iconify';

// ----------------------------------------------------------------------

export default function TableToolbar({ filters, onFilters }) {
  const handleFilterName = useCallback(
    (event) => {
      onFilters('name', event.target.value);
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
        }}
      >
        <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
          <TextField
            variant="standard"
            fullWidth
            value={filters.name}
            onChange={handleFilterName}
            placeholder="Buscar..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
          />
        </Stack>
      </Stack>
    </>
  );
}

TableToolbar.propTypes = {
  filters: PropTypes.object,
  onFilters: PropTypes.func,
};
