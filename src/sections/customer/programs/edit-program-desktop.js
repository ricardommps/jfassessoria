import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import Typography from '@mui/material/Typography';
import { forwardRef } from 'react';
import LoadingProgress from 'src/components/loading-progress';

import GymProgramForm from './program-form/gym-program-form';
import RunningProgramForm from './program-form/running-program-form';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProgramDesktop({
  loading,
  program,
  onUpdateProgram,
  onCreateProgram,
  getFcValue,
  programCreateStatus,
  programType,
  handleClose,
  handleSuccessCreateProgram,
}) {
  const type = program?.type || programType;
  return (
    <Box>
      <Typography variant="h3">{program?.name ? program?.name : 'Novo programa'}</Typography>
      {loading && <LoadingProgress />}
      {!loading && (
        <>
          {type === 2 && (
            <Box p={2}>
              <GymProgramForm
                program={program}
                onUpdateProgram={onUpdateProgram}
                onCreateProgram={onCreateProgram}
                handleClose={handleClose}
                handleSuccessCreateProgram={handleSuccessCreateProgram}
              />
            </Box>
          )}

          {(!type || type === 1) && (
            <Box p={2}>
              <RunningProgramForm
                program={program}
                onUpdateProgram={onUpdateProgram}
                onCreateProgram={onCreateProgram}
                getFcValue={getFcValue}
                programCreateStatus={programCreateStatus}
                handleClose={handleClose}
                handleSuccessCreateProgram={handleSuccessCreateProgram}
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
}
