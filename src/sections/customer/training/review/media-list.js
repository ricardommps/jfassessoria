import Stack from '@mui/material/Stack';

import MediaItem from './media-item';
export default function MediasList({ medias, mediaOrder, exerciseInfo }) {
  return (
    <>
      <Stack>
        {[...medias]
          .sort((a, b) => [...mediaOrder].indexOf(a.id) - mediaOrder.indexOf(b.id))
          .map((media) => (
            <MediaItem media={media} key={media.id} exerciseInfo={exerciseInfo} />
          ))}
      </Stack>
    </>
  );
}
