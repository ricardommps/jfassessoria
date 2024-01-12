import Box from '@mui/material/Box';

import MediaItem from './media-item';
import { MediaItemSkeleton } from './media-skeleton';

export default function MediaList({ medias, loading }) {
  const renderSkeleton = (
    <>
      {[...Array(16)].map((_, index) => (
        <MediaItemSkeleton key={index} variant="horizontal" />
      ))}
    </>
  );

  const renderList = (
    <>
      {medias.map((media) => (
        <MediaItem key={media.id} media={media} />
      ))}
    </>
  );

  return (
    <>
      <Box
        gap={3}
        display="grid"
        gridTemplateColumns={{
          xs: 'repeat(1, 1fr)',
          md: 'repeat(2, 1fr)',
        }}
      >
        {loading ? renderSkeleton : renderList}
      </Box>
    </>
  );
}
