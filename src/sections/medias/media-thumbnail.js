import Box from '@mui/material/Box';

export default function MediaThumbnail({ thumbnail }) {
  return (
    <Box
      component="img"
      src={thumbnail || 'https://supertreinosapp.com/img/TREINO-BANNER-PADRAO.jpg'}
      sx={{
        width: 120,
        height: 120,
        flexShrink: 0,
        objectFit: 'cover',
      }}
    />
  );
}
