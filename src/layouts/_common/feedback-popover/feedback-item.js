'use client';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import { useTheme } from '@mui/material/styles';
import { useCallback } from 'react';
import { WorkoutDetails } from 'src/components/feedback/WorkoutDetails';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCreateFeedback } from 'src/hooks/use-finished';

export default function FeedbackItem({ feedback, refreshList, handleWorkoutSelected }) {
  const theme = useTheme();
  const { createFeedback, isCreatingFeedback } = useCreateFeedback();

  const feedbackForm = useBoolean();

  const handleSubmitFeedback = useCallback(
    async (data, commentId) => {
      try {
        const payload = {
          ...data,
          ...(commentId && { commentId }),
        };
        await createFeedback({
          customerId: feedback?.customer?.id,
          finishedId: feedback?.id,
          payload: payload,
        });

        feedbackForm.onFalse();
        refreshList();
      } catch (error) {
        console.error('Erro ao criar feedback:', error);
      }
    },
    [createFeedback, feedback, feedbackForm, refreshList],
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
          loading={isCreatingFeedback}
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
