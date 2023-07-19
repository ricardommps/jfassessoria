import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';

import ProgramForm from '../program-form/program-form';
import ProgramasList from './programs-list';
export default function Program() {
  const { customer, onListCustomers } = useCustomer();
  const {
    onProgramById,
    programStatus,
    program,
    onListPrograms,
    updateProgramSuccess,
    onClearProgram,
    programCreate,
  } = useProgram();

  const { onShowTraining, onListTrainings, onClearTrainings } = useTraining();

  const [newProduct, setNewProduct] = useState(false);

  const onSelectedProgram = (id) => {
    if (id) {
      onProgramById(id);
      onShowTraining(true);
      onListTrainings(id);
    }
  };

  const handleNewProduct = () => {
    setNewProduct(true);
    onClearProgram();
  };

  const handleClear = () => {
    onClearProgram();
    onShowTraining(false);
    onClearTrainings();
    setNewProduct(false);
  };
  useEffect(() => {
    if (updateProgramSuccess) {
      onListPrograms(customer.id);
      onListCustomers();
      enqueueSnackbar('Update success!', { autoHideDuration: 3000, variant: 'success' });
      handleClear();
    }
  }, [updateProgramSuccess]);

  useEffect(() => {
    if (programCreate) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomers();
      enqueueSnackbar('Programa criado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleClear();
    }
  }, [programCreate]);

  return (
    <Paper
      sx={{
        px: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack>
        <Stack p={2}>
          <Typography variant="h3">Programas de Corrida</Typography>
          <Typography variant="h6" component="div">
            {customer?.name}
          </Typography>
        </Stack>
        <Stack spacing={3} sx={{ width: '25vw', py: 1, height: 'calc(100vh - 340px)' }}>
          <Scrollbar>
            {!program && !newProduct && (
              <>
                <Button
                  variant="contained"
                  startIcon={<Iconify icon="mingcute:add-line" />}
                  sx={{ mb: 2 }}
                  onClick={handleNewProduct}
                >
                  Novo
                </Button>
                <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
                  <ProgramasList onSelectedProgram={onSelectedProgram} />
                </Stack>
              </>
            )}

            {programStatus?.loading && (
              <Stack spacing={2} sx={{ px: 2, py: 2.5, position: 'relative' }}>
                <Box
                  sx={{
                    mt: 5,
                    width: 1,
                    height: 320,
                    borderRadius: 2,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CircularProgress color="error" />
                </Box>
              </Stack>
            )}

            {(program || (!program && newProduct)) && (
              <Stack sx={{ px: 2, py: 2.5, position: 'relative' }}>
                <ProgramForm handleClear={handleClear} />
              </Stack>
            )}
          </Scrollbar>
        </Stack>
      </Stack>
    </Paper>
  );
}
