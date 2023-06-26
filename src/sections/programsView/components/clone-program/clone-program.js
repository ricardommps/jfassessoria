import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import { useCallback, useState } from 'react';
import { customersData } from 'src/_mock';
import Iconify from 'src/components/iconify/iconify';

import CloneProgramForm from './clone-program-form';

const defaultFilters = {
  name: '',
};

export default function CloneProgram({ open, onClose, program }) {
  const theme = useTheme();
  const [filters, setFilters] = useState(defaultFilters);
  const dataFiltered = applyFilter({
    inputData: customersData.customers,
    filters,
  });

  const handleFilters = useCallback((name, value) => {
    setFilters((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  }, []);

  const handleClose = () => {
    setFilters(defaultFilters);
    onClose();
  };

  return (
    <Dialog
      fullWidth
      maxWidth="xs"
      open={open}
      onClose={handleClose}
      transitionDuration={{
        enter: theme.transitions.duration.shortest,
        exit: theme.transitions.duration.shortest - 80,
      }}
    >
      <DialogTitle>
        <Stack alignItems="center" direction="column">
          <Stack alignItems="center" pb={2}>
            <Iconify icon="eva:people-outline" width={30} />
            <Typography>Selecione alunos para este programa</Typography>
            <Typography sx={{ fontWeight: 800 }}>{program?.name}</Typography>
          </Stack>
          <Stack pb={2}>
            <TextField
              variant="standard"
              placeholder="Buscar"
              onChange={(event) => handleFilters('name', event.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                width: { xs: 1, md: 260 },
              }}
            />
          </Stack>
          <CloneProgramForm customers={dataFiltered} handleClose={handleClose} />
        </Stack>
      </DialogTitle>
    </Dialog>
  );
}

CloneProgram.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  program: PropTypes.object,
};

const applyFilter = ({ inputData, filters }) => {
  const { name } = filters;
  if (name) {
    inputData = inputData.filter(
      (file) => file.name.toLowerCase().indexOf(name.toLowerCase()) !== -1,
    );
  }
  return inputData;
};
