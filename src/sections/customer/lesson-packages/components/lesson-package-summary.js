import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';

export default function LessonPackageSummary({ label, value }) {
  return (
    <Box
      sx={{
        p: 1.5,
        borderRadius: 1.5,
        bgcolor: 'background.neutral',
        minWidth: 0,
      }}
    >
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary" noWrap>
          {label}
        </Typography>
        <Typography variant="subtitle2" noWrap>
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}

LessonPackageSummary.propTypes = {
  label: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
