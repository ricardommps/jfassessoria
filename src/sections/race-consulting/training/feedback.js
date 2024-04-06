import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useEffect } from 'react';
import useFeedbackTraining from 'src/hooks/use-feedback-training';
import Review from 'src/sections/race-consulting/training-review/review';

export default function FeedBack({ open, onClose, trainingId }) {
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
  return (
    <Dialog fullWidth maxWidth="md" open={open}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        Feedback
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 15,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers sx={{ pt: 1, pb: 5, border: 'none' }}>
        <Card>
          <Stack
            spacing={3}
            alignItems={{ md: 'flex-start' }}
            direction={{ xs: 'column-reverse', md: 'row' }}
            sx={{ p: 3 }}
          >
            <Review currentTrainingId={trainingId} handleCloseForm={handleClose} type="training" />
          </Stack>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
