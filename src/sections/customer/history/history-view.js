import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { forwardRef, useMemo } from 'react';
import { useFeedBackHistory } from 'src/hooks/use-finished';
import { useResponsive } from 'src/hooks/use-responsive';
import { getModuleName } from 'src/utils/training-modules';

import HistoryItem from './history-item';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function HistoryView({ open, onClose, id, customerId }) {
  const smDown = useResponsive('down', 'sm');
  const { data, refetch } = useFeedBackHistory(id);

  // Garante que sempre será array SEM recriar referência desnecessária
  const history = useMemo(() => {
    return Array.isArray(data) ? data : [];
  }, [data]);

  const sortedItems = useMemo(() => {
    if (!history.length) return [];

    return [...history].sort((a, b) => {
      return new Date(b.executionDay).getTime() - new Date(a.executionDay).getTime();
    });
  }, [history]);

  const HistoryContent = () => (
    <>
      <AppBar sx={{ position: 'relative' }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={onClose} aria-label="close">
            <CloseIcon />
          </IconButton>
          <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
            Histórico
          </Typography>
        </Toolbar>
      </AppBar>
      <Box p={2} sx={{ overflowX: 'hidden' }}>
        <Box pb={2}>
          <Typography variant="body1">{getModuleName(history[0]?.workout?.title)}</Typography>
        </Box>
        {sortedItems.length > 0 && (
          <>
            {sortedItems.map((item) => (
              <HistoryItem
                historyItem={item}
                key={item.id}
                smDown={smDown}
                workoutInfo={true}
                refreshList={refetch}
                customerId={customerId}
              />
            ))}
          </>
        )}
      </Box>
    </>
  );

  if (smDown) {
    return (
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <HistoryContent />
      </Dialog>
    );
  }
  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <HistoryContent />
    </Dialog>
  );
}
