// eslint-disable-next-line simple-import-sort/imports
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import CloseIcon from '@mui/icons-material/Close';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import { ConfirmDialog } from 'src/components/confirm-dialog';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useBoolean } from 'src/hooks/use-boolean';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import useTraining from 'src/hooks/use-training';

import CustomPopover, { usePopover } from 'src/components/custom-popover';
import GymProgramForm from '../program-form/gym-program-form';
import ProgramForm from '../program-form/program-form';
import ProgramasList from './programs-list';
import SendProgram from './send-program/send-program';

export const NEW_OPTIONS = [
  {
    value: 1,
    label: 'Programa de corrida',
  },
  {
    value: 2,
    label: 'Programa de força',
  },
];

export default function Program({ isMobile = false }) {
  const { customer, onListCustomersReview } = useCustomer();
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
    onSendProgram,
    sendProgramSuccess,
    sendProgramStatus,
    onClearPrograms,
    deleteProgram,
    hideProgramSuccess,
    hideProgramStatus,
  } = useProgram();

  const { onShowTraining, onListTrainings, onClearTrainings } = useTraining();
  const popover = usePopover();

  const [newProduct, setNewProduct] = useState(false);
  const [typeProgram, setTypeProgram] = useState(null);
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
      const newTraining = { ...obj, name: obj.name };
      delete newTraining.id;
      newTraining.finished = false;
      return { ...newTraining };
    });
    payload.trainings = [...newTrainings];
    onSendProgram(payload);
    setCustomersIdSelected([]);
  };

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

  const handleChangeType = useCallback((value) => {
    setTypeProgram(value);
    handleNewProduct();
  }, []);

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
    setTypeProgram(null);
  };
  useUpdateEffect(() => {
    if (updateProgramSuccess) {
      onListPrograms(customer.id);
      onListCustomersReview();
      enqueueSnackbar('Programa atualizado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleClear();
    }
  }, [updateProgramSuccess]);

  useUpdateEffect(() => {
    if (programCreate) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomersReview();
      enqueueSnackbar('Programa criado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleClear();
    }
  }, [programCreate]);

  useUpdateEffect(() => {
    if (cloneProgramSuccess) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomersReview();
      enqueueSnackbar('Programa clonado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleClear();
    }
  }, [cloneProgramSuccess]);

  useUpdateEffect(() => {
    if (sendProgramSuccess) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomersReview();
      enqueueSnackbar(
        sendProgramSuccess.status === 200
          ? 'Programa enviado com sucesso!'
          : 'Falha ao enviar programa',
        {
          autoHideDuration: 8000,
          variant: sendProgramSuccess.status === 200 ? 'success' : 'error',
        },
      );
      handleClear();
    }
  }, [sendProgramSuccess]);

  useUpdateEffect(() => {
    if (deleteProgram) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomersReview();
      enqueueSnackbar('Programa deletado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleClear();
    }
  }, [deleteProgram]);

  useUpdateEffect(() => {
    if (hideProgramSuccess) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomersReview();
      enqueueSnackbar('Programa arquivado com sucesso!', {
        autoHideDuration: 8000,
        variant: 'success',
      });
      handleClear();
    }
  }, [hideProgramSuccess]);

  useUpdateEffect(() => {
    if (hideProgramStatus.error) {
      setNewProduct(false);
      onListPrograms(customer.id);
      onListCustomersReview();
      enqueueSnackbar(hideProgramStatus.error, {
        autoHideDuration: 8000,
        variant: 'error',
      });
      handleClear();
    }
  }, [hideProgramStatus.error]);

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
            <Button onClick={handleCloseProgram} startIcon={<ArrowCircleLeftIcon />}>
              Voltar
            </Button>
          </Stack>
        )}
        <Stack>
          <Stack p={2} direction="row">
            <Stack direction="column" flexGrow={'1'}>
              <Typography variant="h3">Programas</Typography>
              <Typography variant="h6" component="div">
                {customer?.name}
              </Typography>
            </Stack>
            {!isMobile && (
              <Stack pt={2}>
                <IconButton aria-label="close" onClick={handleCloseProgram}>
                  <CloseIcon />
                </IconButton>
              </Stack>
            )}
          </Stack>
          <Stack
            spacing={3}
            sx={{ width: !isMobile ? '25vw' : '90vw', py: 1, height: 'calc(100vh - 340px)' }}
          >
            <Scrollbar>
              {!program && !newProduct && (
                <>
                  <Button
                    color="inherit"
                    variant="contained"
                    endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
                    onClick={popover.onOpen}
                    sx={{ textTransform: 'capitalize' }}
                  >
                    Novo
                  </Button>
                  <CustomPopover
                    open={popover.open}
                    onClose={popover.onClose}
                    arrow="top-right"
                    sx={{ width: 'auto' }}
                  >
                    {NEW_OPTIONS.map((option) => (
                      <MenuItem
                        key={option.value}
                        selected={option.value === 0}
                        onClick={() => {
                          popover.onClose();
                          handleChangeType(option.value);
                        }}
                      >
                        {option.label}
                      </MenuItem>
                    ))}
                  </CustomPopover>
                  <Stack
                    spacing={2}
                    sx={{
                      px: 0,
                      py: 2.5,
                      position: 'relative',
                      width: !isMobile ? '24vw' : '83vw',
                    }}
                  >
                    <ProgramasList
                      onSelectedProgram={onSelectedProgram}
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
                  <>
                    {newProduct && (
                      <>
                        {typeProgram === 2 ? (
                          <GymProgramForm handleClear={handleClear} typeProgram={typeProgram} />
                        ) : (
                          <ProgramForm handleClear={handleClear} typeProgram={typeProgram} />
                        )}
                      </>
                    )}
                    {program && !newProduct && (
                      <>
                        {program?.type === 2 && (
                          <GymProgramForm handleClear={handleClear} typeProgram={program.type} />
                        )}
                        {(!program?.type || program.type === 1) && (
                          <ProgramForm handleClear={handleClear} typeProgram={1} />
                        )}
                      </>
                    )}
                  </>
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
