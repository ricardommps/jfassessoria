import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import Iconify from 'src/components/iconify/iconify';

export default function ImagePlaceHolder({ handleEditProgram }) {
  return (
    <Stack
      onClick={handleEditProgram}
      alignItems="center"
      justifyContent="center"
      spacing={1}
      className="upload-placeholder"
      sx={{
        top: 0,
        left: 0,
        width: 150,
        height: 1,
        zIndex: 9,
        borderRadius: '16px',
        position: 'absolute',
        color: 'text.disabled',
        opacity: 0,
        bgcolor: '#000',
        cursor: 'pointer',
        transition: (theme) =>
          theme.transitions.create(['opacity'], {
            duration: theme.transitions.duration.shorter,
          }),
        '&:hover': {
          opacity: 0.72,
        },
      }}
    >
      <Iconify icon="solar:camera-add-bold" width={32} sx={{ color: '#fff' }} />
      <Typography variant="caption" sx={{ color: '#fff' }}>
        Editar
      </Typography>
    </Stack>
  );
}

ImagePlaceHolder.propTypes = {
  handleEditProgram: PropTypes.func,
};
