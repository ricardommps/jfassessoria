import { Font, StyleSheet, Text, View } from '@react-pdf/renderer';
import { useMemo } from 'react';

import WorkoutItemGroup from './workoutItemGroup';

Font.register({
  family: 'Roboto',
  fonts: [{ src: '/fonts/Roboto-Regular.ttf' }, { src: '/fonts/Roboto-Bold.ttf' }],
});

const useStyles = () =>
  useMemo(
    () =>
      StyleSheet.create({
        title: { color: '#FFAB00', fontSize: 11, fontWeight: 700 },
        h4: { fontSize: 11, fontWeight: 700, color: '#0084B4' },
        subtitle1: { fontSize: 10, fontWeight: 400 },
        subtitle2: { fontSize: 10, fontWeight: 500 },
        row: {
          padding: 10,
          borderRadius: 5,
          borderWidth: 1,
          borderStyle: 'dashed', // Altera para borda tracejada
          borderColor: '#1976d2', // Define a cor azul para a borda
          alignItems: 'flex-end',
          alignSelf: 'flex-end',
          gap: 8,
          marginBottom: 10,
        },
        gridContainer: {
          flexDirection: 'column',
          alignItems: 'flex-end',
          flexWrap: 'wrap',
          marginTop: 4,
          alignSelf: 'flex-end', // Mantém o container alinhado à direita
          gap: 3,
        },
      }),
    [],
  );

export default function WorkoutViewGroup({ media, exerciseInfo }) {
  const handleType = () => {
    let title = '';
    if (media.length === 2) {
      title = 'BISET';
    }

    if (media.length === 3) {
      title = 'TRISET';
    }

    if (media.length > 3) {
      title = 'CIRCUITO';
    }
    //
    return (
      <View>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };
  const styles = useStyles();

  return (
    <View style={styles.row} wrap={false}>
      {handleType()}
      {media.map((subMedia, index) => (
        <WorkoutItemGroup
          key={subMedia.id}
          media={subMedia}
          exerciseInfo={exerciseInfo}
          index={index + 1}
        />
      ))}
    </View>
  );
}
