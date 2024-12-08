import CloseIcon from '@mui/icons-material/Close';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import useFeedbackTraining from 'src/hooks/use-feedback-training';
import useFinishedTraining from 'src/hooks/use-finished-training';

import Review from './review';
import TrainingList from './training-list';

export function TrainingReview({ open, onClose, customerId, actionType, ...other }) {
  const { onListByReview, listByReviewStatus, onGetListAllDone, onClearTrainingReview } =
    useFinishedTraining();
  const {
    feedbackSave,
    feedbackSaveStatus,
    feedbackUpdateStatus,
    feedbackUpdate,
    onClearFeedback,
  } = useFeedbackTraining();

  const [currentTrainingId, setCurrentTrainingId] = useState(null);

  const handleSelectedTraining = (id) => {
    setCurrentTrainingId(id);
  };

  const handleCloseForm = () => {
    setCurrentTrainingId(null);
    onClearTrainingReview();
  };

  useEffect(() => {
    if (customerId) {
      if (actionType === 'review') {
        onListByReview(customerId);
      }
      if (actionType === 'done') {
        onGetListAllDone(customerId);
      }
    }
  }, [customerId]);

  useEffect(() => {
    if (feedbackSave) {
      enqueueSnackbar('FeedBack registrado com sucesso', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      onListByReview(customerId);
      setCurrentTrainingId(null);
      onClearFeedback();
    }
  }, [feedbackSave]);

  useEffect(() => {
    if (feedbackUpdate) {
      enqueueSnackbar('FeedBack atualizado com sucesso', {
        autoHideDuration: 3000,
        variant: 'success',
      });
      onGetListAllDone(customerId);
      setCurrentTrainingId(null);
      onClearFeedback();
    }
  }, [feedbackUpdate]);

  useEffect(() => {
    if (feedbackSaveStatus.error) {
      enqueueSnackbar('Erro ao registrar feedback', {
        autoHideDuration: 3000,
        variant: 'error',
      });
      onListByReview(customerId);
      setCurrentTrainingId(null);
    }
  }, [feedbackSaveStatus]);

  useEffect(() => {
    if (feedbackUpdateStatus.error) {
      enqueueSnackbar('Erro ao atualizar feedback', {
        autoHideDuration: 3000,
        variant: 'error',
      });
      onListByReview(customerId);
      setCurrentTrainingId(null);
    }
  }, [feedbackUpdateStatus]);

  return (
    <Dialog fullWidth maxWidth="lg" open={open} {...other}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        {actionType === 'review' ? 'Treinos aguardando feedback' : 'Feedbacks concluídos'}
        <IconButton
          aria-label="close"
          onClick={onClose}
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
          {listByReviewStatus.loading && (
            <Stack alignItems={'center'} height={200} justifyContent={'center'}>
              <CircularProgress />
            </Stack>
          )}
          {!listByReviewStatus.loading && (
            <Stack
              spacing={3}
              alignItems={{ md: 'flex-start' }}
              direction={{ xs: 'column-reverse', md: 'row' }}
              sx={{ p: 3 }}
            >
              {!currentTrainingId && (
                <TrainingList
                  handleSelectedTraining={handleSelectedTraining}
                  actionType={actionType}
                />
              )}
              <Review currentTrainingId={currentTrainingId} handleCloseForm={handleCloseForm} />
            </Stack>
          )}
        </Card>
      </DialogContent>
    </Dialog>
  );
}
