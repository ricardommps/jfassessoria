import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

export default function TrainingListAction({
  type,
  volume,
  programInfo,
  handleOpenCreateTraining,
  handleClose,
  handleOpenNotification,
}) {
  return (
    <>
      <Grid container spacing={2} justifyContent="flex-end" sx={{ pb: 3 }}>
        <Grid item xs={6} sm="auto">
          <Button fullWidth variant="contained" onClick={handleClose}>
            Fechar
          </Button>
        </Grid>

        <Grid item xs={6} sm="auto">
          <Button fullWidth variant="contained" onClick={handleOpenNotification}>
            Notificação
          </Button>
        </Grid>

        {type === 1 && (
          <Grid item xs={6} sm="auto">
            <Button fullWidth variant="contained" onClick={volume.onTrue}>
              Volume
            </Button>
          </Grid>
        )}

        <Grid item xs={6} sm="auto">
          <Button fullWidth variant="contained" onClick={() => handleOpenCreateTraining(2)}>
            Novo treino
          </Button>
        </Grid>
      </Grid>
      <Box pb={2}>
        <Alert variant="outlined" severity="info" onClick={programInfo.onTrue}>
          Informações do programa
        </Alert>
      </Box>
    </>
  );
}
