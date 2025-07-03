import CloseIcon from '@mui/icons-material/Close';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Paper from '@mui/material/Paper';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { addDays, format, isValid } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { forwardRef } from 'react';
import { useCallback, useState } from 'react';
import useFinished from 'src/hooks/use-finished';
import { useResponsive } from 'src/hooks/use-responsive';

import LoadingProgress from '../loading-progress';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const formatDate = (value) => {
  const date = new Date(value);
  return isValid(date) ? format(date, 'yyyy-MM-dd') : '';
};

const formatDateBr = (value) => {
  const date = new Date(value);
  return isValid(date) ? format(date, 'dd/MM/yyyy') : '';
};

export default function TrainingVolume({ open, onClose, programId, customerId }) {
  const smDown = useResponsive('down', 'sm');
  const theme = useTheme();
  const { onGetVolume, onClearVolumeState, volume } = useFinished();

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const today = new Date();

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    setError('');
    if (endDate && newValue && newValue >= endDate) setEndDate(null);
  };

  const handleEndDateChange = (newValue) => {
    setError('');
    if (newValue && newValue > today) {
      setError('A data final não pode ser maior que a data atual');
      return;
    }
    if (startDate && newValue && newValue <= startDate) {
      setError('A data final deve ser posterior à data inicial');
      return;
    }
    setEndDate(newValue);
  };

  const handleSubmit = useCallback(async () => {
    try {
      setLoading(true);
      if (!error && startDate && endDate) {
        const startDateFormatted = formatDate(startDate);
        const endDateFormatted = formatDate(endDate);
        await onGetVolume(customerId, programId, startDateFormatted, endDateFormatted);
        setLoading(false);
      }
    } catch (err) {
      setLoading(false);
      setError('Não foi possível executar esta operação. Tente novamente mais tarde.');
    }
  }, [startDate, endDate, programId, error]);

  const handleClear = () => {
    setStartDate(null);
    setEndDate(null);
    setError('');
    onClearVolumeState();
  };

  const handleClose = () => {
    onClearVolumeState();
    onClose();
  };

  const getMinEndDate = () => (startDate ? addDays(startDate, 1) : null);
  const disabledSubmit = !startDate || !endDate;

  const VolumeContent = () => (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>Volume</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>

      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
          <Typography variant="h5" gutterBottom>
            Selecionar Período
          </Typography>
          <Stack direction="column" spacing={3} pt={3}>
            <DatePicker
              label="Data Inicial"
              value={startDate}
              onChange={handleStartDateChange}
              maxDate={today}
              disableFuture
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: 'Selecione a data de início',
                  sx: fieldStyles(theme),
                },
              }}
            />
            <DatePicker
              label="Data Final"
              value={endDate}
              onChange={handleEndDateChange}
              minDate={getMinEndDate()}
              maxDate={today}
              disableFuture
              disabled={!startDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: 'Selecione a data final',
                  sx: fieldStyles(theme),
                },
              }}
            />
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {startDate && endDate && !error && (
            <Alert severity="success" sx={{ mt: 2 }}>
              Período: {formatDateBr(startDate)} até {formatDateBr(endDate)}
              <br />
              {Array.isArray(volume?.data) && <>Total de treinos: {volume.data.length}</>}
            </Alert>
          )}

          <Stack justifyContent="end" direction="row" spacing={3} mt={3}>
            <Button variant="outlined" color="error" onClick={handleClear}>
              Limpar
            </Button>
            <LoadingButton
              variant="contained"
              color="inherit"
              onClick={handleSubmit}
              disabled={disabledSubmit}
              loading={loading}
            >
              Pesquisar
            </LoadingButton>
          </Stack>

          <Box pt={3}>
            {loading ? (
              <LoadingProgress />
            ) : (
              <>
                {!volume?.data?.length ? (
                  <Stack alignItems="center">
                    <Typography variant="subtitle1">Nenhum treino</Typography>
                  </Stack>
                ) : (
                  <>
                    <Stack>
                      <Typography variant="h4">{`${volume?.totalDistanceInKm} km`}</Typography>
                      <Typography>Distância total</Typography>
                    </Stack>
                    <Box pt={3}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        TREINOS DE CORRIDA
                      </Typography>
                      <List>
                        {volume.data.map((item, index) => (
                          <Paper
                            key={index}
                            sx={{ mb: 2, borderRadius: 2, bgcolor: '#1c1c1e', px: 2, py: 1 }}
                          >
                            <ListItem disableGutters sx={{ justifyContent: 'space-between' }}>
                              <Typography variant="body2">
                                {format(new Date(item.executionDay), 'dd/MM/yyyy')}
                              </Typography>
                              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                                {`${item.distanceInKm} km`}
                              </Typography>
                            </ListItem>
                          </Paper>
                        ))}
                      </List>
                    </Box>
                  </>
                )}
              </>
            )}
          </Box>
        </LocalizationProvider>
      </DialogContent>
    </>
  );

  if (smDown) {
    return (
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <VolumeContent />
      </Dialog>
    );
  }
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <VolumeContent />
    </Dialog>
  );
}

const fieldStyles = (theme) => ({
  '& .MuiInputLabel-root': {
    color: theme.palette.text.primary,
    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },
  },
  '& .MuiFormHelperText-root': {
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: theme.palette.grey[300],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.main,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
    },
  },
});
