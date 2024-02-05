import Box from '@mui/material/Box';
export default function MediaThumbnail() {
  return (
    <Box
      component="img"
      src={'http://img.youtube.com/vi/2glJKuLyRhE/0.jpg'}
      sx={{
        width: 120,
        height: 120,
        flexShrink: 0,
        objectFit: 'cover',
      }}
    />
  );
}
