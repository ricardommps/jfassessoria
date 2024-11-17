import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useCallback, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar';
import TextMaxLine from 'src/components/text-max-line/text-max-line';
import {
  convertMetersToKilometersFormat,
  convertPaceToSpeed,
  convertSecondsToHourMinuteFormat,
} from 'src/utils/convertValues';
import { getModuleName } from 'src/utils/training-modules';

import FinishedForm from './finished-form';
import MediasList from './media-list';
export default function TrainingDetails({ training, finished, program }) {
  const theme = useTheme();
  const [editForm, showEditForm] = useState(false);

  const handleEditForm = useCallback(() => {
    showEditForm((prev) => !prev);
  }, []);

  const renderLink = (
    <TextMaxLine
      asLink
      target="_blank"
      href={finished?.link}
      color="primary"
      sx={{ maxWidth: 200 }}
    >
      Link
    </TextMaxLine>
  );

  const renderIntensities = () => {
    const intensities = finished.intensities.map((intensities) => JSON.parse(intensities));
    const intensitiesValues = intensities.map((intensities) => {
      if (intensities.value) {
        return intensities.value;
      }
      return intensities.intensitie;
    });
    const noEmptyValues = intensitiesValues.filter((str) => str !== '');
    return (
      <Box display="grid" gap={2} gridTemplateColumns="repeat(3, 1fr)" width={'50px'} pt={3}>
        {noEmptyValues.map((item, index) => (
          <Badge badgeContent={index + 1} color="info" key={`intensities-badge-key-${index}`}>
            <Chip
              label={`${item} ${finished.unitmeasurement === 'pace' ? 'min' : 'km/h'}`}
              key={`intensities-key-${index}`}
              sx={{ width: '100px' }}
            />
          </Badge>
        ))}
      </Box>
    );
  };
  function toHoursAndMinutes(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h${minutes > 0 ? ` ${minutes}m` : ''}`;
  }

  const renderDistance = () => {
    if (finished?.distance) {
      return `${Number(finished?.distance) / 1000} km`;
    }
    if (finished?.distanceInMeters) {
      return convertMetersToKilometersFormat(finished?.distanceInMeters);
    }
  };

  const renderTotalTime = () => {
    if (finished?.duration) {
      return toHoursAndMinutes(Number(finished?.duration));
    }
    if (finished?.durationInSeconds) {
      return convertSecondsToHourMinuteFormat(finished?.durationInSeconds);
    }
  };

  const renderPace = () => {
    if (finished?.pace?.length > 0) {
      return finished?.pace;
    }
    if (finished?.paceInSeconds) {
      return convertPaceToSpeed(finished?.paceInSeconds);
    }
  };

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
      <Stack spacing={1}>
        <Typography variant="subtitle1" component="div">
          {getModuleName(training?.name)}
        </Typography>
        {training?.subtitle && (
          <Typography variant="subtitle2" component="div">
            {training?.subtitle}
          </Typography>
        )}
      </Stack>
      {training?.heating && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Stack maxHeight={'20vh'}>
            <Typography align="center" fontWeight={'bold'} variant="h5">
              Aquecimento
            </Typography>
            <Scrollbar>
              <Typography sx={{ whiteSpace: 'pre-line' }}>{training?.heating}</Typography>
            </Scrollbar>
          </Stack>
        </>
      )}
      {(training?.description || training?.medias.length > 0) && (
        <>
          <Divider sx={{ borderStyle: 'dashed' }} />
          <Typography align="center" fontWeight={'bold'} variant="h5">
            {!program.type || program.type === 1 ? 'Descrição' : 'Parte principal'}
          </Typography>

          {training?.description && (
            <Stack maxHeight={'20vh'}>
              <Scrollbar>
                <Typography sx={{ whiteSpace: 'pre-line' }}>{training?.description}</Typography>
              </Scrollbar>
            </Stack>
          )}

          {training?.medias && training?.medias.length > 0 && (
            <Box pt={2}>
              <Stack pt={2}>
                <MediasList
                  mediaOrder={training?.mediaOrder}
                  medias={training?.medias}
                  exerciseInfo={training?.exerciseInfo}
                />
              </Stack>
            </Box>
          )}
          {training?.recovery && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack maxHeight={'20vh'}>
                <Typography align="center" fontWeight={'bold'} variant="h5">
                  Desaquecimento
                </Typography>
                <Scrollbar>
                  <Typography sx={{ whiteSpace: 'pre-line' }} pt={1}>
                    {training?.recovery}
                  </Typography>
                </Scrollbar>
              </Stack>
            </>
          )}
        </>
      )}
      {(!program?.type || program?.type === 1) && (
        <Stack direction="row" alignItems="center" sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Informações do aluno
          </Typography>
          {(training?.name !== 'FORCA' || training?.unrealized) && (
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
      )}

      <Stack>
        {finished?.typetraining && (
          <Typography variant="subtitle1" sx={{ flexGrow: 1 }} color={theme.palette.warning.light}>
            Treino {finished?.typetraining}
          </Typography>
        )}

        <Stack pt={2}>
          <TextField
            id="comments"
            label="Observações do aluno"
            multiline
            rows={6}
            disabled
            value={finished?.comments || ''}
          />
        </Stack>

        {finished?.intensities?.length > 0 && (
          <Stack pt={2}>
            <Typography variant="body2" sx={{ flexGrow: 1 }} color={'text.primary'}>
              Intensidade dos esforços({finished?.unitmeasurement})
            </Typography>
            {renderIntensities()}
          </Stack>
        )}
        {(training?.name !== 'FORCA' || finished?.unrealized) && (
          <>
            {!editForm && (
              <Stack spacing={1.5} direction="column" pt={2}>
                <ListItemText
                  primary={`Distância em metros`}
                  secondary={renderDistance()}
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
                  primary={`Tempo total`}
                  secondary={renderTotalTime()}
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
                {(finished?.pace?.length > 0 || finished?.paceInSeconds > 0) && (
                  <ListItemText
                    primary={`Pace médio da sessão`}
                    secondary={renderPace()}
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
                  primary={`RPE`}
                  secondary={finished?.rpe}
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
                  primary={`Trimp`}
                  secondary={finished?.trimp}
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
                {finished?.link && (
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
              <FinishedForm
                training={training}
                finished={finished}
                program={program}
                editForm={editForm}
                onCancel={handleEditForm}
              />
            )}
          </>
        )}
      </Stack>
    </Stack>
  );
}
