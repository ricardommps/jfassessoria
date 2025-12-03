import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import { forwardRef, useCallback, useEffect, useState } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';
import useTrimp from 'src/hooks/use-trimp';

import LoadingProgress from '../loading-progress';
import TrimpStackedBarChart from './TrimpStackedBarChart';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Trimp({ open, onClose, customerId }) {
  const smDown = useResponsive('down', 'sm');
  const theme = useTheme();

  const { onGetTrimp, onClearTrimpState, trimp } = useTrimp();
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    onClearTrimpState();
    onClose();
  };

  const initialize = useCallback(async () => {
    try {
      setLoading(true);
      if (customerId) {
        await onGetTrimp(customerId);
        return;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [customerId]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const RenderContent = () => (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>TRIMP - carge de treino</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleClose}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme.palette.grey[500],
        }}
      >
        <CloseIcon />
      </IconButton>
      <DialogContent dividers sx={{ pt: 1, pb: 0, border: 'none' }}>
        <Box pt={3}>
          {loading ? (
            <LoadingProgress />
          ) : (
            <>
              <Box>{trimp?.data?.length > 0 && <TrimpStackedBarChart data={trimp?.data} />}</Box>
            </>
          )}
        </Box>
      </DialogContent>
    </>
  );
  if (smDown) {
    return (
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <RenderContent />
      </Dialog>
    );
  }
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <RenderContent />
    </Dialog>
  );
}
