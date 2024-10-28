'use client';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify';
import { useSettingsContext } from 'src/components/settings';
import useCustomer from 'src/hooks/use-customer';
import useProgram from 'src/hooks/use-program';
import { RouterLink } from 'src/routes/components';
import { useParams, useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';

import ProgramasList from '../program-list';

export default function ProgramListView() {
  const settings = useSettingsContext();
  const router = useRouter();

  const { customer, onCustomerById } = useCustomer();
  const {
    onListPrograms,
    onClearProgram,
    onListArquivedPrograms,
    archived,
    cloneProgramStatus,
    sendProgramStatus,
  } = useProgram();
  const params = useParams();
  const { id } = params;

  const [openSend, setOpenSend] = useState({
    open: false,
    program: null,
  });

  const handleGoBack = useCallback(() => {
    onClearProgram();
    router.back();
  }, []);

  const onSelectedProgram = (id) => {
    if (id) {
      console.log('--onSelectedProgram--', id);
    }
  };

  const handleOpenSend = (program, event) => {
    event.stopPropagation();
    setOpenSend({
      open: true,
      program: program,
    });
  };

  useEffect(() => {
    if (id) {
      onCustomerById(id);
      onListPrograms(id);
      onListArquivedPrograms(id);
    }
  }, [id]);

  return (
    <Container maxWidth={'lg'}>
      <Box sx={{ display: 'flex', flexDirection: 'row', pt: 0, pb: 2 }}>
        <Button
          color="inherit"
          sx={{ mr: 1 }}
          startIcon={<ArrowCircleLeftIcon />}
          onClick={handleGoBack}
        >
          Voltar
        </Button>
      </Box>
      <Stack direction={'row'}>
        <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
          Programas
        </Typography>
        <Button
          component={RouterLink}
          href={paths.dashboard.program.create(id)}
          variant="contained"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Novo
        </Button>
      </Stack>
      <ProgramasList
        onSelectedProgram={onSelectedProgram}
        cloneProgramStatus={cloneProgramStatus}
        sendProgramStatus={sendProgramStatus}
        handleOpenSend={handleOpenSend}
      />
    </Container>
  );
}
