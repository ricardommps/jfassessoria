import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import CustomPopover from 'src/components/custom-popover';
import Iconify from 'src/components/iconify/iconify';

export const NEW_OPTIONS = [
  {
    value: 1,
    label: 'Versão 1',
  },
  {
    value: 2,
    label: 'Versão app',
  },
];

export default function TrainingListAction({
  type,
  volume,
  popover,
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
          <Button
            fullWidth
            size="medium"
            color="inherit"
            variant="contained"
            endIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}
            onClick={popover.onOpen}
          >
            Novo treino
          </Button>

          <CustomPopover open={popover.open} onClose={popover.onClose} arrow="top-right">
            {NEW_OPTIONS.map((option) => (
              <MenuItem
                key={option.value}
                selected={option.value === 0}
                onClick={() => {
                  popover.onClose();
                  handleOpenCreateTraining(option.value);
                }}
              >
                {option.label}
              </MenuItem>
            ))}
          </CustomPopover>
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
