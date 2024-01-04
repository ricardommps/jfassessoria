import { useTheme } from '@emotion/react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useEffect, useState } from 'react';
import { useTablePvContext } from 'src/components/drawer-table-pv';
import Iconify from 'src/components/iconify/iconify';
import useFinishedTraining from 'src/hooks/use-finished-training';
import { getModuleName } from 'src/utils/training-modules';

import FeedBackForm from './feedback-form';
import FinishedForm from './finished-form';
export default function ReviewForm({ training, handleCloseForm }) {
  const theme = useTheme();
  const tablePv = useTablePvContext();
  const { updateFinishedTraining } = useFinishedTraining();
  const [editForm, showEditForm] = useState(false);

  const handleEditForm = useCallback(() => {
    showEditForm((prev) => !prev);
  }, []);

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
      showEditForm(false);
    }
  }, [updateFinishedTraining]);
  return (
    <>
      {training?.unrealized && <> {renderUnrealized}</>}

      <Stack>
        <Typography sx={{ fontSize: 'smaller', color: '#777', marginBottom: 2 }}>
          Registrar feedback do treino
        </Typography>
      </Stack>
      <Stack>
        <Button variant="outlined" sx={{ width: 'fit-content' }} onClick={tablePv.onToggle}>
          {!tablePv.open ? 'Exibir tabela Pv' : 'Ocultas tabela Pv'}
        </Button>
      </Stack>
      <Grid container spacing={6} pt={2}>
        <Grid xs={12} md={12}>
          <>
            <Accordion
              square={true}
              sx={{
                border: `2px solid ${theme.palette.info.main}`,
                borderRadius: '6px',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Detalhes do treino</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  <Typography variant="subtitle1" component="div">
                    {`Móludo: ${getModuleName(training?.trainingname)}`}
                  </Typography>
                  <TextField
                    id="description"
                    label="Descrição"
                    multiline
                    rows={6}
                    disabled
                    value={training?.tariningdesc}
                  />
                  <Divider />
                  {(training?.trainingname === 'FORCA' || training?.unrealized) && (
                    <>
                      <TextField
                        id="comments"
                        label="Observações do aluno"
                        multiline
                        rows={6}
                        disabled
                        value={training?.comments}
                      />
                      <Divider />
                    </>
                  )}
                  {(training?.trainingname !== 'FORCA' || training?.unrealized) && (
                    <Box>
                      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="h6" sx={{ color: 'text.disabled', flexGrow: 1 }}>
                          Métricas do aluno
                        </Typography>

                        <IconButton onClick={handleEditForm} disabled={editForm}>
                          <Iconify icon="solar:pen-bold" />
                        </IconButton>
                      </Stack>
                      <FinishedForm
                        training={training}
                        editForm={editForm}
                        onCancel={handleEditForm}
                      />
                    </Box>
                  )}
                </Stack>
              </AccordionDetails>
            </Accordion>
            <Divider sx={{ paddingTop: 2 }} />
            <Box pt={2}>
              <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
                <Typography variant="subtitle1" component="div">
                  Feedback do aluno
                </Typography>
              </Stack>
              <FeedBackForm
                training={training}
                finishedTrainingId={training.finishedid}
                trainingname={training.trainingname}
                handleCloseForm={handleCloseForm}
              />
            </Box>
          </>
        </Grid>
      </Grid>
    </>
  );
}
