import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import EmptyContent from 'src/components/empty-content/empty-content';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import useFinishedTraining from 'src/hooks/use-finished-training';

import TrainingItem from './training-item';
export default function TrainingList({ handleSelectedTraining, actionType }) {
  const { listByReview, listByReviewStatus, allDone, allDoneStatus } = useFinishedTraining();
  const [listItens, setListItens] = useState(null);
  useEffect(() => {
    if (listByReviewStatus.error) {
      enqueueSnackbar(listByReviewStatus.error, {
        autoHideDuration: 8000,
        variant: 'error',
      });
    }
  }, [listByReviewStatus]);
  useEffect(() => {
    if (allDone.length > 0) {
      setListItens(allDone);
    }
  }, [allDone]);
  useEffect(() => {
    if (listByReview.length > 0) {
      setListItens(listByReview);
    }
  }, [listByReview]);
  return (
    <Stack
      spacing={2}
      component={Paper}
      variant="outlined"
      sx={{
        p: 2.5,
        minWidth: '50%',
        flexShrink: 0,
        borderRadius: 2,
        typography: 'body2',
        borderStyle: 'dashed',
      }}
    >
      <Stack spacing={0.5}></Stack>
      <Scrollbar>
        <>
          {actionType === 'review' && listByReviewStatus.empty && (
            <EmptyContent
              imgUrl="/assets/icons/empty/ic_folder_empty.svg"
              sx={{
                borderRadius: 1.5,
                bgcolor: 'background.default',
              }}
            />
          )}

          {actionType === 'done' && allDoneStatus.empty && (
            <EmptyContent
              imgUrl="/assets/icons/empty/ic_folder_empty.svg"
              sx={{
                borderRadius: 1.5,
                bgcolor: 'background.default',
              }}
            />
          )}
        </>
        {listItens && (
          <Stack spacing={2}>
            {listItens.map((item) => (
              <TrainingItem
                key={item.trainingid}
                item={item}
                handleSelectedTraining={handleSelectedTraining}
              />
            ))}
          </Stack>
        )}
      </Scrollbar>
    </Stack>
  );
}
