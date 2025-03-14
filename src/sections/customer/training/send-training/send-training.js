import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { forwardRef, useMemo } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';

import { Content } from './content';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function SendTraining({
  open,
  onClose,
  training,
  onSelectProgram,
  handleSendTraining,
  loading,
  programsIdSelected,
  type,
  vs2,
}) {
  const smDown = useResponsive('down', 'sm');
  const MemoizedContent = useMemo(
    () => (
      <Content
        training={training}
        onSelectProgram={onSelectProgram}
        type={type}
        vs2={vs2}
        onClose={onClose}
        handleSendTraining={handleSendTraining}
        loading={loading}
        programsIdSelected={programsIdSelected}
      />
    ),
    [
      training,
      onSelectProgram,
      type,
      vs2,
      onClose,
      handleSendTraining,
      loading,
      programsIdSelected,
    ],
  );

  if (smDown) {
    return (
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        {MemoizedContent}
      </Dialog>
    );
  }
  return (
    <Dialog fullWidth maxWidth="md" open={open}>
      {MemoizedContent}
    </Dialog>
  );
}
