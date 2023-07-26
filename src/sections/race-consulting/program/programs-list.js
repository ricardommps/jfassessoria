import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';

import ProgramItem from './program-item';

export default function ProgramasList({
  onSelectedProgram,
  onCloneProgram,
  cloneProgramStatus,
  handleOpenSend,
  sendProgramStatus,
}) {
  return (
    <Grid container spacing={2} pt={3}>
      <Grid xs={12} sm={12} md={12}>
        <ProgramItem
          onSelectedProgram={onSelectedProgram}
          onCloneProgram={onCloneProgram}
          cloneProgramStatus={cloneProgramStatus}
          handleOpenSend={handleOpenSend}
          sendProgramStatus={sendProgramStatus}
        />
      </Grid>
    </Grid>
  );
}

ProgramasList.propTypes = {
  onSelectedProgram: PropTypes.func,
};
