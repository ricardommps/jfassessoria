import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CloseIcon from '@mui/icons-material/Close';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useBoolean } from 'src/hooks/use-boolean';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';

import SendProgram from '../send-program/send-program';
import ArchivedList from './archived-list';
export default function Archiveds({ isMobile = false }) {
  const confirm = useBoolean();
  const {
    onClearArchivedPrograms,
    deleteProgram,
    onListArquivedPrograms,
    showProgramSuccess,
    deleteCustomerStatus,
    onSendProgram,
    sendProgramStatus,
    sendProgramSuccess,
    onClearPrograms,
  } = useProgram();
  const { customer, onListCustomersReview } = useCustomer();

  const [customersIdSelected, setCustomersIdSelected] = useState([]);
  const [openSend, setOpenSend] = useState({
    open: false,
    program: null,
  });

  const handleOpenSend = (program, event) => {
    event.stopPropagation();
    setOpenSend({
      open: true,
      program: program,
    });
  };

  const handleCloseSend = () => {
    setCustomersIdSelected([]);
    setOpenSend({
      open: false,
      program: null,
    });
  };

  const handleSelectCustomer = useCallback(
    (inputValue) => {
      const newSelected = customersIdSelected.includes(inputValue)
        ? customersIdSelected.filter((value) => value !== inputValue)
        : [...customersIdSelected, inputValue];

      setCustomersIdSelected(newSelected);
    },
    [customersIdSelected],
  );

  const handleCloseArchived = () => {
    onClearPrograms();
    onClearArchivedPrograms();
    onListCustomersReview();
  };

  const onConfirmSendProgram = () => {
    confirm.onFalse();
    const payload = Object.assign({}, openSend.program);
    delete payload.id;
    delete payload.customerId;
    delete payload.customer;
    payload.customersId = [...customersIdSelected];
    payload.name = `[SEND-COPY]${payload.name}`;
    payload.hide = false;
    const newTrainings = payload.trainings.map((obj) => {
      const newTraining = { ...obj, name: obj.name };
      delete newTraining.id;
      return { ...newTraining };
    });
    payload.trainings = [...newTrainings];
    onSendProgram(payload);
    setCustomersIdSelected([]);
  };

  useEffect(() => {
    if (deleteProgram) {
      onListArquivedPrograms(customer.id);
      enqueueSnackbar('Programa deletado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
    }
  }, [deleteProgram]);

  useEffect(() => {
    if (showProgramSuccess) {
      onListArquivedPrograms(customer.id);
      enqueueSnackbar('Programa restaurado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
    }
  }, [showProgramSuccess]);

  useEffect(() => {
    if (deleteCustomerStatus?.error) {
      onListArquivedPrograms(customer.id);
      enqueueSnackbar(deleteCustomerStatus.error, {
        autoHideDuration: 3000,
        variant: 'warning',
      });
    }
  }, [deleteCustomerStatus?.error]);

  useEffect(() => {
    if (sendProgramSuccess) {
      onListArquivedPrograms(customer.id);
      handleCloseSend();
      enqueueSnackbar(
        sendProgramSuccess.status === 200
          ? 'Programa enviado com sucesso!'
          : 'Falha ao enviar programa',
        {
          autoHideDuration: 8000,
          variant: sendProgramSuccess.status === 200 ? 'success' : 'error',
        },
      );
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
        {isMobile && (
          <Stack justifyContent={'flex-start'} alignItems={'flex-start'}>
            <Button startIcon={<ArrowCircleLeftIcon />} onClick={handleCloseArchived}>
              Voltar
            </Button>
          </Stack>
        )}
        <Stack>
          <Stack p={2} direction="row">
            <Stack direction="column" flexGrow={'1'}>
              <Typography variant="h3">Programas Arquivados</Typography>
            </Stack>
            {!isMobile && (
              <Stack pt={2}>
                <IconButton aria-label="close" onClick={handleCloseArchived}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            )}
          </Stack>
          <Stack spacing={3}>
            <Scrollbar>
              <ArchivedList handleOpenSend={handleOpenSend} />
            </Scrollbar>
          </Stack>
        </Stack>
      </Paper>
      <ConfirmDialog
        open={confirm.value}
        onClose={confirm.onFalse}
        title="Enviar"
        content="Tem certeza que deseja enviar esse programa para outros alunos?"
        action={
          <Button variant="contained" color="error" onClick={onConfirmSendProgram}>
            Confirmar
          </Button>
        }
      />
      {openSend?.open && (
        <SendProgram
          open={openSend.open}
          onClose={handleCloseSend}
          program={openSend.program}
          onSelectCustomer={handleSelectCustomer}
          handleSendProgram={confirm.onTrue}
          sendProgramStatus={sendProgramStatus}
          customersIdSelected={customersIdSelected}
        />
      )}
    </>
  );
}
