import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import { UploadIllustration } from 'src/assets/illustrations';
import Iconify from 'src/components/iconify';
import Image from 'src/components/image';

export default function PreviewImage({ imgUrl = '', handleClearImage, onClick }) {
  const renderImage = (
    <Image
      alt="file preview"
      src={imgUrl}
      sx={{
        borderRadius: 1,
      }}
    />
  );

  const renderPlaceholder = (
    <Stack
      spacing={3}
      alignItems="center"
      justifyContent="center"
      flexWrap="wrap"
      p={2}
      onClick={onClick}
    >
      <UploadIllustration sx={{ width: 1, maxWidth: 200 }} />
      <Stack spacing={1} sx={{ textAlign: 'center' }}>
        <Typography variant="h6">Clique aqui para selecionar uma imagem</Typography>
      </Stack>
    </Stack>
  );

  const removeImagePreview = imgUrl.length > 0 && (
    <IconButton
      size="small"
      onClick={handleClearImage}
      sx={{
        top: 16,
        right: 16,
        zIndex: 9,
        position: 'absolute',
        color: (theme) => alpha(theme.palette.common.white, 0.8),
        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
        '&:hover': {
          bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
        },
      }}
    >
      <Iconify icon="mingcute:close-line" width={18} />
    </IconButton>
  );
  return (
    <Box sx={{ position: 'relative', width: 'fit-content' }}>
      <Box
        sx={{
          width: 'fit-content',
          outline: 'none',
          borderRadius: 1,
          cursor: 'pointer',
          overflow: 'hidden',
          position: 'relative',
          bgcolor: (theme) => alpha(theme.palette.grey[500], 0.08),
          border: (theme) => `1px dashed ${alpha(theme.palette.grey[500], 0.2)}`,
          transition: (theme) => theme.transitions.create(['opacity', 'padding']),
        }}
      >
        {imgUrl.length > 0 ? renderImage : renderPlaceholder}
      </Box>
      {removeImagePreview}
    </Box>
  );
}
