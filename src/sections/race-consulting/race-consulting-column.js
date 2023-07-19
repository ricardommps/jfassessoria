import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';
export default function RaceConsultingColumn({ width }) {
  return (
    <Paper
      sx={{
        px: 2,
        borderRadius: 2,
        bgcolor: 'background.neutral',
      }}
    >
      <Stack>
        <Stack spacing={2} sx={{ width: width, py: 3 }}></Stack>
      </Stack>
    </Paper>
  );
}

RaceConsultingColumn.propTypes = {
  width: PropTypes.string,
};
