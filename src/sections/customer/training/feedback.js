import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import { forwardRef, useEffect } from 'react';
import useFeedbackTraining from 'src/hooks/use-feedback-training';
import { useResponsive } from 'src/hooks/use-responsive';

import Review from './review/review';
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function FeedBack({ open, onClose, trainingId }) {
  const smDown = useResponsive('down', 'sm');
  const {
    feedbackSave,
    feedbackSaveStatus,
    feedbackUpdateStatus,
    feedbackUpdate,
    onClearFeedback,
  } = useFeedbackTraining();

  const handleClose = () => {
    onClearFeedback();
    onClose();
  };
  useEffect(() => {
    if (feedbackSave) {
      enqueueSnackbar('FeedBack registrado com sucesso', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleClose();
    }
  }, [feedbackSave]);

  useEffect(() => {
    if (feedbackUpdate) {
      enqueueSnackbar('FeedBack atualizado com sucesso', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      handleClose();
    }
  }, [feedbackUpdate]);

  useEffect(() => {
    if (feedbackSaveStatus.error) {
      enqueueSnackbar('Erro ao registrar feedback', {
        autoHideDuration: 3000,
        variant: 'error',
      });
      handleClose();
    }
  }, [feedbackSaveStatus]);

  useEffect(() => {
    if (feedbackUpdateStatus.error) {
      enqueueSnackbar('Erro ao atualizar feedback', {
        autoHideDuration: 3000,
        variant: 'error',
      });
      handleClose();
    }
  }, [feedbackUpdateStatus]);

  const FeedBackContent = () => (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Feedback
          </Typography>
        </Toolbar>
      </AppBar>
      <Box p={2}>
        <Card>
          <Stack spacing={3} sx={{ p: 3 }}>
            <Review currentTrainingId={trainingId} handleCloseForm={handleClose} type="training" />
          </Stack>
        </Card>
      </Box>
    </>
  );

  if (smDown) {
    return (
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <FeedBackContent />
      </Dialog>
    );
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <FeedBackContent />
    </Dialog>
  );
}
