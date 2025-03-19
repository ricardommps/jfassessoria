import { Text, View } from '@react-pdf/renderer';
import { useCallback, useEffect, useState } from 'react';

import WorkoutViewItemPdf from './workoutViewItemPdf';

const STRETCH_TAGS = ['Alongamento ativo', 'Alongamento passivo', 'Alongamentos'];
const HEATING_TAGS = ['Aquecimento'];
export default function WorkoutViewPdf({ workout }) {
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
      const FILTER_TAGS = [...STRETCH_TAGS, ...HEATING_TAGS];
      if (heatingOrder?.length > 0) {
        const filteredMedias = medias
          .filter((media) => !heatingOrder.includes(media.id)) // Remove mídias com IDs no array excluir
          .filter((media) => {
            const hasStretchOrHeating = media.tags.some(
              (tag) => STRETCH_TAGS.includes(tag) || HEATING_TAGS.includes(tag),
            );
            return !hasStretchOrHeating || media.tags.length > 1; // Mantém se tiver outras tags além dessas
          });
        setMedias(filteredMedias);
      } else {
        const filteredMedias = medias.filter((media) =>
          media.tags.some((tag) => !FILTER_TAGS.includes(tag)),
        );
        setMedias(filteredMedias);
      }
    }
  }, [workout]);

  useEffect(() => {
    handleFilterMedias();
  }, [workout, handleFilterMedias]);

  return (
    <>
      <View style={{ paddingBottom: 10 }}>
        <WorkoutSection
          title="Aquecimento"
          description={workout?.heating}
          medias={mediasHeating}
          mediaOrder={workout?.heatingOrder}
          exerciseInfo={workout?.exerciseInfo}
        />
      </View>
      <View style={{ paddingBottom: 10 }}>
        <WorkoutSection
          title=" Alongamentos ativos e educativos de corrida"
          medias={mediasStretches}
          mediaOrder={workout?.stretchesOrder}
          exerciseInfo={workout?.exerciseInfo}
        />
      </View>
      <View style={{ paddingBottom: 10 }}>
        <WorkoutSection
          title={workout.running ? 'Descrição' : 'Parte principal'}
          description={workout?.description}
          medias={medias}
          mediaOrder={workout?.mediaOrder}
          exerciseInfo={workout?.exerciseInfo}
          isWorkoutLoad={true}
        />
      </View>
    </>
  );
}

function WorkoutSection({ title, description, medias, mediaOrder, exerciseInfo, isWorkoutLoad }) {
  if (!description && (!medias || medias.length === 0 || !mediaOrder?.length)) return null;
  return (
    <>
      <Text style={{ fontWeight: 'bold', fontSize: 14, fontFamily: 'Roboto', marginBottom: 15 }}>
        {title}
      </Text>
      {medias && medias.length > 0 && (
        <WorkoutViewItemPdf
          medias={medias}
          mediaOrder={mediaOrder}
          exerciseInfo={exerciseInfo}
          isWorkoutLoad={isWorkoutLoad}
        />
      )}
    </>
  );
}
