'use client';

import Badge from '@mui/material/Badge';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { varHover } from 'src/components/animate';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import WorkoutView from 'src/components/workout-view';
import { useBoolean } from 'src/hooks/use-boolean';
import useFeedback from 'src/hooks/use-feedback';
import { useResponsive } from 'src/hooks/use-responsive';

import FeedbackItem from './feedback-item';
export default function FeedbackPopover() {
  const pathname = usePathname();
  const smUp = useResponsive('up', 'sm');
  const drawer = useBoolean();
  const [workoutSelected, setWorkoutSelected] = useState(null);

  const { onGetUnreviewedFinished, unreviewedFinished } = useFeedback();

  const [sortedUnreviewedFinished, setSortedUnreviewedFinished] = useState([]);

  const handleWorkoutSelected = (workoutId) => {
    setWorkoutSelected(workoutId);
  };

  const handeCloseWorkoutView = () => {
    setWorkoutSelected(null);
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Feedbacks
      </Typography>

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );
  const refreshList = () => {
    initialize();
  };

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {sortedUnreviewedFinished.map((feedback) => (
          <FeedbackItem
            key={feedback.id}
            feedback={feedback}
            smUp={smUp}
            refreshList={refreshList}
            handleWorkoutSelected={handleWorkoutSelected}
          />
        ))}
      </List>
    </Scrollbar>
  );

  const initialize = useCallback(async () => {
    try {
      onGetUnreviewedFinished();
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [pathname]);

  useEffect(() => {
    if (unreviewedFinished) {
      const sortedItems = [...unreviewedFinished].sort((a, b) => {
        // Converter strings de data em objetos Date de forma explícita
        const dateA = new Date(a.executionDay).getTime();
        const dateB = new Date(b.executionDay).getTime();
        return dateB - dateA; // Ordenar em ordem decrescente
      });
      setSortedUnreviewedFinished(sortedItems);
    }
  }, [unreviewedFinished, setSortedUnreviewedFinished]);
  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={unreviewedFinished.length} color="error" showZero>
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />
        {renderList}
      </Drawer>
      {workoutSelected && (
        <WorkoutView
          open={workoutSelected}
          onClose={handeCloseWorkoutView}
          workoutId={workoutSelected}
        />
      )}
    </>
  );
}
