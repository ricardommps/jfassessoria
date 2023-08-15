import Grid from '@mui/material/Unstable_Grid2';
import PropTypes from 'prop-types';
import useProgram from 'src/hooks/use-program';

import ProgramItem from './program-item';

export default function ProgramasList({
  onSelectedProgram,
  cloneProgramStatus,
  handleOpenSend,
  sendProgramStatus,
}) {
  const { programs, onCloneProgram, onDeleteProgram } = useProgram();
  return (
    <Grid container spacing={2} pt={3}>
      <Grid xs={12} sm={12} md={12}>
        {programs?.map((program) => (
          <ProgramItem
            key={program.id}
            program={program}
            onCloneProgram={onCloneProgram}
            onSelectedProgram={onSelectedProgram}
            onSendProgram={handleOpenSend}
            onDeleteProgram={onDeleteProgram}
            cloneProgramStatus={cloneProgramStatus}
            sendProgramStatus={sendProgramStatus}
          />
        ))}
      </Grid>
    </Grid>
  );
}

ProgramasList.propTypes = {
  onSelectedProgram: PropTypes.func,
};
