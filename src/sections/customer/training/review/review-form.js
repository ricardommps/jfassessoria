import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import { useTablePvContext } from 'src/components/drawer-table-pv';
import useFinishedTraining from 'src/hooks/use-finished-training';

import FeedBackForm from './feedback-form';
export default function ReviewForm({ trainingReview, handleCloseForm }) {
  const tablePv = useTablePvContext();
  const { updateFinishedTraining } = useFinishedTraining();
  const renderUnrealized = (
    <Stack
      direction="row"
      alignItems="center"
      sx={{
        top: 8,
        right: 8,
        zIndex: 9,
        borderRadius: 1,
        position: 'absolute',
        p: '2px 6px 2px 4px',
        typography: 'subtitle2',
        bgcolor: 'error.main',
      }}
    >
      <Box component="span" sx={{ mr: 0.25, fontSize: '11px' }}>
        Não realizado
      </Box>
    </Stack>
  );

  useEffect(() => {
    if (updateFinishedTraining) {
      enqueueSnackbar('Editado com sucesso', {
        autoHideDuration: 8000,
        variant: 'success',
      });
    }
  }, [updateFinishedTraining]);
  return (
    <>
      {trainingReview?.finished?.unrealized && <> {renderUnrealized}</>}

      <Stack>
        <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
          Registrar feedback do treino
        </Typography>
      </Stack>
      <Stack>
        <Button variant="outlined" sx={{ width: 'fit-content' }} onClick={tablePv.onToggle}>
          {!tablePv.open ? 'Exibir Tabela Pace/Km' : 'Ocultas Tabela Pace/Km'}
        </Button>
      </Stack>
      <Box pt={2}>
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="subtitle1" component="div">
            Feedback do aluno
          </Typography>
        </Stack>
        <FeedBackForm
          trainingReview={trainingReview}
          finishedTrainingId={trainingReview.finished.id}
          trainingname={trainingReview.training.name}
          handleCloseForm={handleCloseForm}
        />
      </Box>
    </>
  );
}
