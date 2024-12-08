import Box from '@mui/material/Box';
import { useCallback, useEffect, useState } from 'react';
import LoadingProgress from 'src/components/loading-progress';
import useProgram from 'src/hooks/use-program';
import { useResponsive } from 'src/hooks/use-responsive';

import EditProgramDesktop from './edit-program-desktop';
import EditProgramMobile from './edit-program-mobile';
export default function EditProgram({
  open,
  id,
  handleCloseEditProgram,
  handleSuccessCreateProgram,
}) {
  const {
    onProgramById,
    program,
    onUpdateProgram,
    onCreateProgram,
    getFcValue,
    programCreateStatus,
  } = useProgram();
  const smDown = useResponsive('down', 'sm');
  const [loading, setLoading] = useState(false);

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      await onProgramById(id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      initialize();
    }
  }, [id, initialize]);
  if (smDown) {
    return (
      <EditProgramMobile
        open={open}
        handleClose={handleCloseEditProgram}
        loading={loading}
        program={program}
        onUpdateProgram={onUpdateProgram}
        onCreateProgram={onCreateProgram}
        getFcValue={getFcValue}
        programCreateStatus={programCreateStatus}
        handleSuccessCreateProgram={handleSuccessCreateProgram}
      />
    );
  }
  return (
    <Box>
      {loading && <LoadingProgress />}
      {!loading && (
        <EditProgramDesktop
          open={open}
          handleClose={handleCloseEditProgram}
          loading={loading}
          program={program}
          onUpdateProgram={onUpdateProgram}
          onCreateProgram={onCreateProgram}
          getFcValue={getFcValue}
          programCreateStatus={programCreateStatus}
          handleSuccessCreateProgram={handleSuccessCreateProgram}
        />
      )}
    </Box>
  );
}
