'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useCallback, useState } from 'react';
import { WorkoutDetails } from 'src/components/feedback/WorkoutDetails';
import { useBoolean } from 'src/hooks/use-boolean';
import useWorkout from 'src/hooks/use-workout';

export default function FeedbackItem({ feedback, refreshList, handleWorkoutSelected }) {
  const theme = useTheme();
  const { onReviewWorkout } = useWorkout();

  const feedbackForm = useBoolean();
  const [loading, setLoading] = useState(false);

  const handleSubmitFeedback = useCallback(
    async (data) => {
      try {
        setLoading(true);
        await onReviewWorkout(feedback.customer.id, feedback.id, data);
        feedbackForm.onFalse();
        refreshList();
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    },
    [feedback, refreshList],
  );

  const renderAvatar = (
    <ListItemAvatar>
      <Avatar src={feedback?.customer?.avatar} sx={{ bgcolor: 'background.neutral' }} />
    </ListItemAvatar>
  );

  const renderName = (
    <ListItemText
      disableTypography
      primary={reader(feedback?.customer?.name)}
      secondary={
        <Stack
          direction="row"
          alignItems="center"
          sx={{ typography: 'caption', color: 'text.disabled' }}
          divider={
            <Box
              sx={{
                width: 2,
                height: 2,
                bgcolor: 'currentColor',
                mx: 0.5,
                borderRadius: '50%',
              }}
            />
          }
        >
          {feedback?.customer?.email}
        </Stack>
      }
    />
  );

  return (
    <Stack
      direction="row"
      sx={{
        p: 2.5,
        alignItems: 'flex-start',
        borderBottom: `dashed 1px ${theme.palette.divider}`,
      }}
    >
      {renderAvatar}

      <Stack sx={{ flexGrow: 1 }}>
        {renderName}

        <WorkoutDetails
          itemFeedback={feedback}
          feedBackFormValue={feedbackForm.value}
          loading={loading}
          onSubmit={handleSubmitFeedback}
          onCancelFeedback={feedbackForm.onFalse}
          onOpenFeedback={feedbackForm.onTrue}
          onViewWorkout={() => handleWorkoutSelected(feedback)}
          reader={reader}
        />
      </Stack>
    </Stack>
  );
}

function reader(data) {
  return (
    <Box
      dangerouslySetInnerHTML={{ __html: data }}
      sx={{
        mb: 0.5,
        '& p': { typography: 'body2', m: 0 },
        '& a': { color: 'inherit', textDecoration: 'none' },
        '& strong': { typography: 'subtitle2' },
      }}
    />
  );
}
