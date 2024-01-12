import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import TextMaxLine from 'src/components/text-max-line/text-max-line';
import { getModuleName } from 'src/utils/training-modules';

import FinishedForm from './finished-form';
export default function TrainingDetails({ training }) {
  const theme = useTheme();
  const [editForm, showEditForm] = useState(false);

  const handleEditForm = useCallback(() => {
    showEditForm((prev) => !prev);
  }, []);
  const renderDescription = (
    <TextField
      variant="standard"
      id="description"
      label="Descrição"
      multiline
      rows={5}
      disabled
      value={training?.tariningdesc}
      sx={{
        '& .MuiInputBase-input.Mui-disabled': {
          WebkitTextFillColor: theme.palette.text.primary,
        },
      }}
    />
  );

  const renderLink = (
    <TextMaxLine
      asLink
      target="_blank"
      href={training?.link}
      color="primary"
      sx={{ maxWidth: 200 }}
    >
      Link
    </TextMaxLine>
  );

  const renderIntensities = () => {
    const intensities = training.intensities.map((intensities) => JSON.parse(intensities));
    const intensitiesValues = intensities.map((intensities) => intensities.value);
    const noEmptyValues = intensitiesValues.filter((str) => str !== '');
    return (
      <>
        {noEmptyValues.map((item, index) => (
          <Chip label={item} key={`intensities-key-${index}`} />
        ))}
      </>
    );
  };
  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }
  return (
    <Stack
      spacing={2}
      component={Paper}
      variant="outlined"
      sx={{
        p: 2.5,
        minWidth: '50%',
        flexShrink: 0,
        borderRadius: 2,
        typography: 'body2',
        borderStyle: 'dashed',
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="h6">Detalhes do treino</Typography>
      </Stack>
      <Stack spacing={2}>
        <Typography variant="subtitle1" component="div">
          {`Móludo: ${getModuleName(training?.trainingname)}`}
        </Typography>
        {renderDescription}
      </Stack>
      <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Informações do aluno
        </Typography>
        {(training?.trainingname !== 'FORCA' || training?.unrealized) && (
          <IconButton
            onClick={handleEditForm}
            disabled={editForm}
            color={'primary'}
            sx={{
              '&.Mui-disabled': {
                color: theme.palette.text.disabled,
              },
            }}
          >
            <Iconify icon="solar:pen-bold" />
          </IconButton>
        )}
      </Stack>
      <Stack>
        {training?.typetraining && (
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }} color={theme.palette.warning.light}>
            Treino {training?.typetraining}
          </Typography>
        )}

        <Stack pt={2}>
          <TextField
            id="comments"
            label="Observações do aluno"
            multiline
            rows={6}
            disabled
            value={training?.comment || ''}
          />
        </Stack>

        {training?.intensities?.length > 0 && (
          <Stack pt={2}>
            <Typography variant="body2" sx={{ flexGrow: 1 }} color={'text.primary'}>
              Intensidade dos esforços({training?.unitmeasurement})
            </Typography>
            <Box display="grid" gap={2} gridTemplateColumns="repeat(2, 1fr)" sx={{ p: 3 }}>
              {renderIntensities()}
            </Box>
          </Stack>
        )}
        {(training?.trainingname !== 'FORCA' || training?.unrealized) && (
          <>
            {!editForm && (
              <Stack spacing={1.5} direction="column" pt={2}>
                <ListItemText
                  primary={`Distância em metros: ${Number(training?.distance)}`}
                  secondary={`${Number(training?.distance) / 1000} km`}
                  primaryTypographyProps={{
                    typography: 'body2',
                    color: 'text.primary',
                    mb: 0.5,
                  }}
                  secondaryTypographyProps={{
                    typography: 'subtitle2',
                    color: 'text.secondary',
                    component: 'span',
                  }}
                />
                <ListItemText
                  primary={`Tempo total em minutos: ${Number(training?.duration)}`}
                  secondary={toHoursAndMinutes(Number(training?.duration))}
                  primaryTypographyProps={{
                    typography: 'body2',
                    color: 'text.primary',
                    mb: 0.5,
                  }}
                  secondaryTypographyProps={{
                    typography: 'subtitle2',
                    color: 'text.secondary',
                    component: 'span',
                  }}
                />
                {training?.pace && (
                  <ListItemText
                    primary={`Pace médio da sessão: ${training?.pace}`}
                    primaryTypographyProps={{
                      typography: 'body2',
                      color: 'text.primary',
                      mb: 0.5,
                    }}
                    secondaryTypographyProps={{
                      typography: 'subtitle2',
                      color: 'text.secondary',
                      component: 'span',
                    }}
                  />
                )}
                <ListItemText
                  primary={`RPE: ${training?.rpe}`}
                  primaryTypographyProps={{
                    typography: 'body2',
                    color: 'text.primary',
                    mb: 0.5,
                  }}
                  secondaryTypographyProps={{
                    typography: 'subtitle2',
                    color: 'text.secondary',
                    component: 'span',
                  }}
                />
                <ListItemText
                  primary={`Trimp: ${training?.trimp}`}
                  primaryTypographyProps={{
                    typography: 'body2',
                    color: 'text.primary',
                    mb: 0.5,
                  }}
                  secondaryTypographyProps={{
                    typography: 'subtitle2',
                    color: 'text.secondary',
                    component: 'span',
                  }}
                />
                {training?.link && (
                  <ListItemText
                    primary={renderLink}
                    primaryTypographyProps={{
                      typography: 'body2',
                      color: 'text.primary',
                      mb: 0.5,
                    }}
                    secondaryTypographyProps={{
                      typography: 'subtitle2',
                      color: 'text.secondary',
                      component: 'span',
                    }}
                  />
                )}
              </Stack>
            )}
            {editForm && (
              <FinishedForm training={training} editForm={editForm} onCancel={handleEditForm} />
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
