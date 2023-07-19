import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Unstable_Grid2';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import useProgram from 'src/hooks/use-program';
import CardTitle from 'src/sections/programsView/components/card-title';
import { hideScroll } from 'src/theme/css';

import ListPrograms from './list-program';
import ProgramNewEditForm from './program-form';

export default function Program({ customerId, birthDate, customerName }) {
  const {
    programsStatus,
    onListPrograms,
    onCreateProgram,
    programCreate,
    onClearProgram,
    program,
    programStatus,
    onProgramById,
    updateProgramSuccess,
    onUpdateProgram,
  } = useProgram();
  const [openForm, setOpenForm] = useState(false);
  const [programId, setProgramId] = useState(null);

  const handleOpenForm = () => {
    setOpenForm(true);
  };

  const handleCancel = () => {
    onClearProgram();
    setOpenForm(false);
    setProgramId(null);
  };

  const handleSelectedProgram = (id) => {
    if (id) {
      setProgramId(id);
      onClearProgram();
      setOpenForm(true);
      onProgramById(id);
    }
  };

  useEffect(() => {
    if (customerId) {
      onListPrograms(customerId);
    }
  }, [customerId]);

  useEffect(() => {
    if (programCreate) {
      setOpenForm(false);
      onListPrograms(customerId);
      enqueueSnackbar('Programa criado com sucesso!', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleCancel();
    }
  }, [programCreate]);

  useEffect(() => {
    if (updateProgramSuccess) {
      setOpenForm(false);
      onListPrograms(customerId);
      onClearProgram();
      enqueueSnackbar('Update success!', { autoHideDuration: 3000, variant: 'success' });
      handleCancel();
    }
  }, [updateProgramSuccess]);
  return (
    <Grid xs={12} md={4}>
      <Card sx={{ height: 'calc(100vh - 150px)', ...hideScroll.y }}>
        <Scrollbar>
          <CardTitle title="Programas de corrida" subTitle={customerName} />
          <CardContent>
            {programsStatus?.loading && (
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
            )}
            {!programsStatus?.loading && (
              <Stack>
                <Box>
                  {!openForm && (
                    <>
                      <Button
                        variant="contained"
                        startIcon={<Iconify icon="mingcute:add-line" />}
                        onClick={handleOpenForm}
                      >
                        Novo
                      </Button>
                      <ListPrograms onSelectedProgram={handleSelectedProgram} />
                    </>
                  )}
                  {openForm && (
                    <ProgramNewEditForm
                      program={program}
                      birthDate={birthDate}
                      customerId={customerId}
                      onCreateProgram={onCreateProgram}
                      onCancel={handleCancel}
                      loading={programStatus.loading}
                      onUpdateProgram={onUpdateProgram}
                      programId={programId}
                    />
                  )}
                </Box>
              </Stack>
            )}
          </CardContent>
        </Scrollbar>
      </Card>
    </Grid>
  );
}

Program.propTypes = {
  customerId: PropTypes.number,
  birthDate: PropTypes.string,
  customerName: PropTypes.string,
};
