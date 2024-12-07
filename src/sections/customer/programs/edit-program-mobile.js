import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { forwardRef } from 'react';
import LoadingProgress from 'src/components/loading-progress';

import GymProgramForm from './program-form/gym-program-form';
import RunningProgramForm from './program-form/running-program-form';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function EditProgramMobile({
  open,
  handleClose,
  loading,
  program,
  onUpdateProgram,
  onCreateProgram,
  getFcValue,
  programCreateStatus,
  programType,
  handleSuccessCreateProgram,
}) {
  const type = program?.type || programType;
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            {program?.name ? program?.name : 'Novo programa'}
          </Typography>
        </Toolbar>
      </AppBar>
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
    </Dialog>
  );
}
