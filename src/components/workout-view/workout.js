import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React, { useCallback, useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import Scrollbar from 'src/components/scrollbar';

import WorkoutList from './workout-list';

const Workout = React.memo(({ workout }) => {
  const STRETCH_TAGS = ['Alongamento ativo', 'Alongamento passivo', 'Alongamentos'];
  const HEATING_TAGS = ['Aquecimento'];
  const EXCLUDED_TAGS = [...STRETCH_TAGS, ...HEATING_TAGS];
  const [mediasStretches, setMediasStretches] = useState([]);
  const [mediasHeating, setMediasHeating] = useState([]);
  const [medias, setMedias] = useState([]);

  const handleFilterMedias = useCallback(() => {
    if (!workout) return;

    const { medias, stretchesOrder, heatingOrder, mediaOrder } = workout;

    if (stretchesOrder?.length && medias?.length) {
      setMediasStretches(
        medias.filter((item) => item.tags.some((tag) => STRETCH_TAGS.includes(tag))),
      );
    }

    if (heatingOrder?.length && medias?.length) {
      setMediasHeating(
        medias.filter((item) => item.tags.some((tag) => HEATING_TAGS.includes(tag))),
      );
    }

    if (mediaOrder?.length && medias?.length) {
      setMedias(medias.filter((item) => !item.tags.some((tag) => EXCLUDED_TAGS.includes(tag))));
    }
  }, [workout]);

  useEffect(() => {
    handleFilterMedias();
  }, [workout, handleFilterMedias]);
  return (
    <>
      <CardHeader title={workout?.name} subheader={workout?.subtitle} sx={{ pt: 0 }} />
      <CardContent sx={{ padding: 2 }}>
        <Stack spacing={2}>
          <WorkoutSection
            title="Aquecimento"
            description={workout?.heating}
            medias={mediasHeating}
            mediaOrder={workout?.heatingOrder}
            exerciseInfo={workout?.exerciseInfo}
          />
          <WorkoutSection
            title=" Alongamentos ativos e educativos de corrida"
            medias={mediasStretches}
            mediaOrder={workout?.stretchesOrder}
            exerciseInfo={workout?.exerciseInfo}
          />

          <WorkoutSection
            title={workout?.running ? 'Descrição' : 'Parte principal'}
            description={workout?.description}
            medias={medias}
            mediaOrder={workout?.mediaOrder}
            exerciseInfo={workout?.exerciseInfo}
            isWorkoutLoad={true}
          />
          {workout?.recovery && (
            <>
              <Divider sx={{ borderStyle: 'dashed' }} />
              <Stack maxHeight={'20vh'} p={2}>
                <Typography align="center" fontWeight="bold" variant="h5">
                  Desaquecimento
                </Typography>
                <Scrollbar>
                  <Typography sx={{ whiteSpace: 'pre-line' }}>{workout?.recovery}</Typography>
                </Scrollbar>
              </Stack>
            </>
          )}
        </Stack>
      </CardContent>
    </>
  );
});

const WorkoutSection = React.memo(
  ({ title, description, medias, mediaOrder, exerciseInfo, isWorkoutLoad }) => {
    if (!description && (!medias || medias.length === 0 || !mediaOrder?.length)) return null;

    return (
      <Accordion defaultExpanded elevation={0} sx={{ '&:before': { display: 'none' } }}>
        <AccordionSummary expandIcon={<Iconify icon="eva:arrow-ios-downward-fill" />}>
          <Typography variant="subtitle1">{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {description && (
            <Stack p={2}>
              <Scrollbar>
                <Typography sx={{ whiteSpace: 'pre-line' }}>{description}</Typography>
              </Scrollbar>
            </Stack>
          )}
          {medias && medias.length > 0 && (
            <WorkoutList
              medias={medias}
              mediaOrder={mediaOrder}
              exerciseInfo={exerciseInfo}
              isWorkoutLoad={isWorkoutLoad}
            />
          )}
        </AccordionDetails>
      </Accordion>
    );
  },
);

export default Workout;
