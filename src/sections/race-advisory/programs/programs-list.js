import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';

import ProgramItem from './program-item';
export default function ProgramsList({ onOpenTrainings }) {
  return (
    <Grid container spacing={2} pt={3}>
      <Grid xs={12} sm={12} md={12}>
        <ProgramItem onOpenTrainings={onOpenTrainings} />
      </Grid>
    </Grid>
  );
}

ProgramsList.propTypes = {
  programs: PropTypes.array,
  onOpenTrainings: PropTypes.func,
};
