import Box from '@mui/material/Box';
import useProgram from 'src/hooks/use-program';
import { useResponsive } from 'src/hooks/use-responsive';

import EditProgramDesktop from './edit-program-desktop';
import EditProgramMobile from './edit-program-mobile';
export default function CreateProgram({
  open,
  handleCloseEditProgram,
  programType,
  handleSuccessCreateProgram,
}) {
  const { onCreateProgram, getFcValue, programCreateStatus } = useProgram();
  const smDown = useResponsive('down', 'sm');

  if (smDown) {
    return (
      <EditProgramMobile
        open={open}
        onCreateProgram={onCreateProgram}
        getFcValue={getFcValue}
        programCreateStatus={programCreateStatus}
        programType={programType}
        handleClose={handleCloseEditProgram}
        handleSuccessCreateProgram={handleSuccessCreateProgram}
      />
    );
  }
  return (
    <Box>
      <EditProgramDesktop
        onCreateProgram={onCreateProgram}
        getFcValue={getFcValue}
        programCreateStatus={programCreateStatus}
        programType={programType}
        handleClose={handleCloseEditProgram}
        handleSuccessCreateProgram={handleSuccessCreateProgram}
      />
    </Box>
  );
}
