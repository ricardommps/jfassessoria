import { Draggable } from '@hello-pangea/dnd';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha, styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Iconify from 'src/components/iconify/iconify';
import MediaPlayer from 'src/components/media-player';
import { useBoolean } from 'src/hooks/use-boolean';

import ExerciseInfo from './exercise-info';

const ListItem = styled('div')(() => ({
  backgroundColor: alpha('#333', 0.3),
  padding: 0,
  position: 'relative',
  height: 'auto',
  border: '1px solid #212121',
  borderRadius: '4px',
  overflow: 'hidden',
  boxShadow:
    '0 2px 1px -1px rgba(0,0,0,.2), 0 1px 1px 0 rgba(0,0,0,.14), 0 1px 3px 0 rgba(0,0,0,.12)',
  textAlign: 'left',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'flex-start',
  '& img': {
    float: 'left',
    width: '120px',
    height: 'auto',
    borderRadius: '4px',
  },
}));

const TextColum = styled('div')(() => ({
  float: 'left',
  width: '140px',
  height: 'auto',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  flexGrow: 1,
}));

const Title = styled('div')(() => ({
  height: 'auto',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  fontSize: '16px',
  fontWeight: '600',
  color: '#ddd',
  padding: '2px 2px 0 8px',
}));

const SubTitle = styled('div')(({ bold }) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: '1',
  WebkitBoxOrient: 'vertical',
  fontSize: '14px',
  fontStyle: 'italic',
  color: '#888',
  padding: '5px 36px 0 8px',
  height: 'auto',
  ...(bold && {
    fontWeight: 'bold',
  }),
}));

const Footer = styled('div')(() => ({
  margin: '2px 10px',
  background: '#333',
  borderRadius: '0 0 8px 8px',
  fontSize: '.7rem',
  color: '#999',
  padding: '2px 10px 5px',
  '& span': {
    display: 'block',
    margin: '0 auto',
    textAlign: 'left',
    position: 'relative',
    fontStyle: 'normal',
    padding: '0 0 0 20px',
  },
}));

const addDefaultSrc = (ev) => {
  ev.target.src = 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg';
};

export default function MediaViewItem({ media, index, handleSaveExerciseInfo, exerciseInfo }) {
  const player = useBoolean();
  const info = useBoolean();
  const exerciseInfoById = exerciseInfo?.filter((item) => item.id === media.id)[0];
  return (
    <>
      <Draggable draggableId={media.id.toString()} index={index}>
        {(provided) => (
          <Stack
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            pb={2}
          >
            <ListItem>
              <img
                onError={addDefaultSrc}
                src={media?.thumbnail || 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg'}
                onClick={player.onTrue}
                style={{ cursor: 'pointer' }}
              />
              <TextColum>
                <Stack direction="column">
                  <Title>{media.title}</Title>
                  <SubTitle>{media.instrucctions}</SubTitle>
                </Stack>
              </TextColum>
            </ListItem>
            <Footer>
              <Stack flexDirection={'row'}>
                <Stack>
                  <Typography sx={{ fontSize: '0.75rem' }}>
                    RANGE DE REPETIÇÕES: {exerciseInfoById?.reps || 0}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem' }}>
                    INTERVALO DE RECUPERAÇÃO: {exerciseInfoById?.reset || 0}
                  </Typography>
                  <Typography sx={{ fontSize: '0.75rem' }}>
                    REPETIÇÕES DE RESERVA: {exerciseInfoById?.rir || 0}
                  </Typography>
                </Stack>
                <Box sx={{ flexGrow: 1 }} />
                <Stack justifyContent={'center'}>
                  <IconButton size="small" disableRipple onClick={info.onTrue}>
                    <Iconify icon="material-symbols:edit" />
                  </IconButton>
                </Stack>
              </Stack>
            </Footer>
          </Stack>
        )}
      </Draggable>

      {player.value && (
        <MediaPlayer
          open={player.value}
          onClose={player.onFalse}
          url={media.videoUrl}
          title={media.title}
        />
      )}
      {info.value && (
        <ExerciseInfo
          open={info.value}
          onClose={info.onFalse}
          title={media.title}
          id={media.id}
          onSave={handleSaveExerciseInfo}
          exerciseInfoById={exerciseInfoById}
        />
      )}
    </>
  );
}
