import CloseIcon from '@mui/icons-material/Close';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { forwardRef } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';

import HistoryItem from './history-item';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function History({ open, onClose, history, title, refreshList, customerId }) {
  const smDown = useResponsive('down', 'sm');
  const sortedItems = [...history].sort((a, b) => {
    // Converter strings de data em objetos Date de forma explícita
    const dateA = new Date(a.executionDay).getTime();
    const dateB = new Date(b.executionDay).getTime();
    return dateB - dateA; // Ordenar em ordem decrescente
  });
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
          <Typography variant="body1">{title}</Typography>
        </Box>
        {/* <Button variant="outlined" sx={{ mt: 2 }} onClick={workoutView.onTrue}>
          Ver treino
        </Button> */}
        {sortedItems.length > 0 && (
          <>
            {sortedItems.map((item) => (
              <HistoryItem
                historyItem={item}
                key={item.id}
                smDown={smDown}
                workoutInfo={true}
                refreshList={refreshList}
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
