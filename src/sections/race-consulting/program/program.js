import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';

import ProgramForm from '../program-form/program-form';
import ProgramasList from './programs-list';
import SendProgram from './send-program/send-program';
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
    cloneProgramSuccess,
    cloneProgramStatus,
    onCloneProgram,
    onSendProgram,
    sendProgramSuccess,
    sendProgramStatus,
  } = useProgram();

  const { onShowTraining, onListTrainings, onClearTrainings } = useTraining();

  const [newProduct, setNewProduct] = useState(false);

  const [openSend, setOpenSend] = useState({
    open: false,
    program: null,
  });

  const [customersIdSelected, setCustomersIdSelected] = useState([]);

  const handleSelectCustomer = useCallback(
    (inputValue) => {
      const newSelected = customersIdSelected.includes(inputValue)
        ? customersIdSelected.filter((value) => value !== inputValue)
        : [...customersIdSelected, inputValue];

      setCustomersIdSelected(newSelected);
    },
    [customersIdSelected],
  );

  const handleSendProgram = useCallback(() => {
    const payload = Object.assign({}, openSend.program);
    delete payload.id;
    delete payload.customerId;
    payload.customersId = [...customersIdSelected];
    payload.name = `[SEND-COPY]${payload.name}`;
    const newTrainings = payload.trainings.map((obj) => {
      const newTraining = { ...obj, name: `[SEND-COPY]${obj.name}` };
      delete newTraining.id;
      return { ...newTraining };
    });
    payload.trainings = [...newTrainings];
    onSendProgram(payload);
  }, [customersIdSelected, openSend]);

  const handleOpenSend = (program, event) => {
    event.stopPropagation();
    setOpenSend({
      open: true,
      program: program,
    });
  };

  const handleCloseSend = () => {
    setOpenSend({
      open: false,
      programName: null,
    });
  };

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
    setOpenSend(null);
    setCustomersIdSelected([]);
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

  useEffect(() => {
    if (cloneProgramSuccess) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomers();
      enqueueSnackbar('Programa clonado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleClear();
    }
  }, [cloneProgramSuccess]);

  useEffect(() => {
    if (sendProgramSuccess) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomers();
      enqueueSnackbar(
        sendProgramSuccess.status === 200
          ? 'Programa clonado com sucesso!'
          : 'Falha ao enviar programa',
        {
          autoHideDuration: 3000,
          variant: sendProgramSuccess.status === 200 ? 'success' : 'error',
        },
      );
      handleClear();
    }
  }, [sendProgramSuccess]);

  return (
    <>
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
                    <ProgramasList
                      onSelectedProgram={onSelectedProgram}
                      onCloneProgram={onCloneProgram}
                      cloneProgramStatus={cloneProgramStatus}
                      sendProgramStatus={sendProgramStatus}
                      handleOpenSend={handleOpenSend}
                    />
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
      {openSend?.open && (
        <SendProgram
          open={openSend.open}
          onClose={handleCloseSend}
          program={openSend.program}
          onSelectCustomer={handleSelectCustomer}
          handleSendProgram={handleSendProgram}
          sendProgramStatus={sendProgramStatus}
        />
      )}
    </>
  );
}
