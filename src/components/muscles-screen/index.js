import CloseIcon from '@mui/icons-material/Close';
import { Box, Chip, Stack } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import { useTheme } from '@mui/material/styles';
import { forwardRef, useMemo } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';
import SvgBodComplet from 'src/svg/BodComplet';
import { getActiveMuscles, getActiveSvgIds } from 'src/utils/getActiveMuscleTags';

const ACTIVE = '#FF4D4F';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function MusclesScreen({ open, onClose, musclesWorked }) {
  const smDown = useResponsive('down', 'sm');
  const theme = useTheme();

  const activeSvgIds = getActiveSvgIds(musclesWorked);
  const activeMuscles = useMemo(() => getActiveMuscles(musclesWorked ?? []), [musclesWorked]);

  const MusclesScreenContent = () => (
    <>
      <DialogTitle sx={{ m: 0, p: 2 }}>Musculaturas trabalhadas</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={onClose}
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
        <Box p={3} sx={{ flex: 1, px: 1 }}>
          <Stack direction="row" spacing={1} flexWrap="wrap">
            {activeMuscles.map((muscle) => (
              <Chip
                key={muscle.id}
                label={muscle.muscle}
                sx={{
                  backgroundColor: muscle.activeColor,
                  color: theme.palette.getContrastText(muscle.activeColor),
                  fontWeight: 500,
                }}
              />
            ))}
          </Stack>
          <Stack>
            <Box sx={{ height: 500 }}>
              <SvgBodComplet width="100%" height="100%" activeIds={activeSvgIds} />
            </Box>
          </Stack>
        </Box>
      </DialogContent>
    </>
  );

  if (smDown) {
    return (
      <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={Transition}>
        <MusclesScreenContent />
      </Dialog>
    );
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={onClose}>
      <MusclesScreenContent />
    </Dialog>
  );
}
