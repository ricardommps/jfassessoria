import { Font, Link, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useMemo } from 'react';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        h4: { fontSize: 11, fontWeight: 700, color: '#0084B4' },
        subtitle1: { fontSize: 10, fontWeight: 400 },
        subtitle2: { fontSize: 10, fontWeight: 500 },
        row: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end', // Alinha tudo à direita
          marginBottom: 20,
          gap: 3,
        },
        gridContainer: {
          flexDirection: 'column',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          marginTop: 4,
          alignSelf: 'flex-end', // Mantém o container alinhado à direita
          gap: 3,
        },
        link: { fontSize: 10, color: 'blue', textDecoration: 'underline' },
      }),
    [],
  );

export default function WorkoutSingleItem({ media, exerciseInfo }) {
  const styles = useStyles();
  const exerciseInfoById = exerciseInfo?.find((item) => item.id === media.id);
  return (
    <View style={styles.row}>
      <Text style={styles.h4}>{media.title}</Text>
      {exerciseInfoById?.method && exerciseInfoById?.method?.length > 0 && (
        <View style={styles.gridContainer}>
          <Text style={styles.subtitle1}>MÉTODO:</Text>
          <Text style={styles.subtitle2}>{exerciseInfoById?.method || 'N/A'}</Text>
        </View>
      )}

      {exerciseInfoById?.reps && exerciseInfoById?.reps?.length > 0 && (
        <View style={styles.gridContainer}>
          <Text style={styles.subtitle1}>RANGE DE REPETIÇÕES:</Text>
          <Text style={styles.subtitle2}>{exerciseInfoById?.reps || 'N/A'}</Text>
        </View>
      )}

      {(typeof exerciseInfoById?.reset === 'number' ||
        (typeof exerciseInfoById?.reset === 'string' && exerciseInfoById.reset.trim() !== '')) && (
        <View style={styles.gridContainer}>
          <Text style={styles.subtitle1}>INTERVALO DE RECUPERAÇÃO:</Text>
          <Text style={styles.subtitle2}>{String(exerciseInfoById.reset)}</Text>
        </View>
      )}

      {(typeof exerciseInfoById?.rir === 'number' ||
        (typeof exerciseInfoById?.rir === 'string' && exerciseInfoById.rir.trim() !== '')) && (
        <View style={styles.gridContainer}>
          <Text style={styles.subtitle1}>REPETIÇÂO DE RESERVA:</Text>
          <Text style={styles.subtitle2}>{String(exerciseInfoById.rir)}</Text>
        </View>
      )}

      {(typeof exerciseInfoById?.cadence === 'number' ||
        (typeof exerciseInfoById?.cadence === 'string' &&
          exerciseInfoById.cadence.trim() !== '')) && (
        <View style={styles.gridContainer}>
          <Text style={styles.subtitle1}>CADÊNCIA / VEL. DE MOV.:</Text>
          <Text style={styles.subtitle2}>{String(exerciseInfoById.cadence)}</Text>
        </View>
      )}

      {(typeof exerciseInfoById?.comments === 'number' ||
        (typeof exerciseInfoById?.comments === 'string' &&
          exerciseInfoById.comments.trim() !== '')) && (
        <View style={styles.gridContainer}>
          <Text style={styles.subtitle1}>OBSERVAÇÕES:</Text>
          <Text style={styles.subtitle2}>{String(exerciseInfoById.comments)}</Text>
        </View>
      )}
      <View style={styles.gridContainer}>
        <Link src={media.videoUrl} style={styles.link}>
          Link do vídeo demonstrativo
        </Link>
      </View>
    </View>
  );
}
