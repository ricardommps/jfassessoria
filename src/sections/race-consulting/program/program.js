import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useBoolean } from 'src/hooks/use-boolean';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';

import ProgramForm from '../program-form/program-form';
import ProgramasList from './programs-list';
import SendProgram from './send-program/send-program';
export default function Program() {
  const { customer, onListCustomers } = useCustomer();
  const confirm = useBoolean();
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
    onClearPrograms,
  } = useProgram();

  const { onShowTraining, onListTrainings, onClearTrainings } = useTraining();

  const [newProduct, setNewProduct] = useState(false);
  const [openSend, setOpenSend] = useState({
    open: false,
    program: null,
  });
  const [customersIdSelected, setCustomersIdSelected] = useState([]);
  const [action, setAction] = useState({
    title: null,
    message: null,
    program: null,
  });

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
    confirm.onTrue();
    setAction({
      title: 'Enviar',
      message: 'Tem certeza que deseja enviar esse programa para outros alunos?',
      program: openSend.program,
    });
  }, []);

  const onConfirmSendProgram = () => {
    confirm.onFalse();
    setAction(null);
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
  };

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
      program: null,
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

  const handleCloseProgram = () => {
    onClearPrograms();
    handleClear();
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
          ? 'Programa enviado com sucesso!'
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
          <Stack p={2} direction="row">
            <Stack direction="column" flexGrow={'1'}>
              <Typography variant="h3">Programas de Corrida</Typography>
              <Typography variant="h6" component="div">
                {customer?.name}
              </Typography>
            </Stack>
            <Stack pt={2}>
              <IconButton aria-label="close" onClick={handleCloseProgram}>
                <CloseIcon />
              </IconButton>
            </Stack>
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
          customersIdSelected={customersIdSelected}
        />
      )}
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title={action?.title}
        content={action?.message}
        action={
          <Button variant="contained" color="error" onClick={onConfirmSendProgram}>
            Confirmar
          </Button>
        }
      />
    </>
  );
}
