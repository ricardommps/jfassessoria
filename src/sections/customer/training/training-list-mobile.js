import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { forwardRef } from 'react';
import Iconify from 'src/components/iconify/iconify';
import LoadingProgress from 'src/components/loading-progress';
import { useBoolean } from 'src/hooks/use-boolean';

import CreateTraining from './training-form/create-training';
import TrainingItem from './training-item';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function TrainingListMobile({
  open,
  handleClose,
  loading,
  trainings,
  trainingsStatus,
  refreshList,
  programId,
  type,
}) {
  const create = useBoolean();
  const handleCloseCreate = () => {
    create.onFalse();
  };
  const handleSuccessCreate = () => {
    create.onFalse();
    refreshList();
  };
  return (
    <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Treinos
          </Typography>
        </Toolbar>
      </AppBar>
      {loading && <LoadingProgress />}
      {!loading && (
        <>
          <Box p={2}>
            <Stack
              direction="column"
              spacing={2}
              sx={{
                justifyContent: 'flex-start',
                alignItems: 'flex-end',
              }}
            >
              <Button
                variant="contained"
                startIcon={<Iconify icon="mingcute:add-line" />}
                sx={{ mb: 2, ml: 4 }}
                onClick={create.onTrue}
              >
                Novo
              </Button>
            </Stack>
            <Stack spacing={2}>
              {(!trainingsStatus.loading || !loading) && !trainingsStatus.empty && trainings && (
                <>
                  {trainings?.map((training) => (
                    <TrainingItem
                      key={training.id}
                      training={training}
                      programId={programId}
                      type={type}
                      refreshList={refreshList}
                      handleSuccessCreate={handleSuccessCreate}
                    />
                  ))}
                </>
              )}
            </Stack>
          </Box>
          {create.value && (
            <CreateTraining
              open={create.value}
              programId={programId}
              type={type}
              onClose={handleCloseCreate}
              handleSuccessCreate={handleSuccessCreate}
            />
          )}
        </>
      )}
    </Dialog>
  );
}
