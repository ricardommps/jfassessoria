import { Font, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useMemo } from 'react';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        container: {
          alignItems: 'flex-end',
          alignSelf: 'flex-end',
        },
        header: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 3,
        },
        indexBox: {
          backgroundColor: '#1976d2',
          paddingHorizontal: 8,
          borderRadius: 20, // Aumente o valor para garantir um círculo
          height: 24, // Aumente um pouco a altura
          width: 24, // Defina uma largura igual à altura para formar um círculo
          justifyContent: 'center',
          alignItems: 'center',
          marginRight: 5,
        },
        indexText: {
          color: '#fff',
          fontSize: 12,
        },
        title: {
          fontSize: 11,
          fontWeight: 700,
          color: '#0084B4',
        },
        section: {
          flexDirection: 'column',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          marginTop: 4,
          alignSelf: 'flex-end', // Mantém o container alinhado à direita
          gap: 3,
          marginBottom: 4,
        },
        subtitle1: { fontSize: 10, fontWeight: 400, textTransform: 'uppercase' },
        subtitle2: { fontSize: 10, fontWeight: 500 },
      }),
    [],
  );

export default function WorkoutItemGroup({ media, exerciseInfo, index }) {
  const styles = useStyles();
  const exerciseInfoById = exerciseInfo?.filter((item) => item.id === media.id)[0];
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.indexBox}>
          <Text style={styles.indexText}>{index}</Text>
        </View>
        <Text style={styles.title}>{media.title}</Text>
      </View>
      <View>
        {exerciseInfoById?.method && (
          <View style={styles.section}>
            <Text style={styles.subtitle1}>MÉTODO:</Text>
            <Text style={styles.subtitle2}>{exerciseInfoById.method}</Text>
          </View>
        )}
        {exerciseInfoById?.reps && (
          <View style={styles.section}>
            <Text style={styles.subtitle1}>RANGE DE REPETIÇÕES:</Text>
            <Text style={styles.subtitle2}>{exerciseInfoById.reps}</Text>
          </View>
        )}
        {exerciseInfoById?.reset > 0 && (
          <View style={styles.section}>
            <Text style={styles.subtitle1}>INTERVALO DE RECUPERAÇÃO:</Text>
            <Text style={styles.subtitle2}>{exerciseInfoById.reset}</Text>
          </View>
        )}
        {exerciseInfoById?.rir && (
          <View style={styles.section}>
            <Text style={styles.subtitle1}>REP. DE RESERVA:</Text>
            <Text style={styles.subtitle2}>{exerciseInfoById.rir}</Text>
          </View>
        )}
        {exerciseInfoById?.cadence && (
          <View style={styles.section}>
            <Text style={styles.subtitle1}>CADÊNCIA / VEL. DE MOV.:</Text>
            <Text style={styles.subtitle2}>{exerciseInfoById.cadence}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
