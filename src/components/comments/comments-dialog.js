'use client';

import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { useEffect } from 'react';
import { forwardRef } from 'react';
import { useMarkCommentsAsRead } from 'src/hooks/use-commnts';
import { useResponsive } from 'src/hooks/use-responsive';

import CommentsScreen from './comments-screen';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function CommentsDialog({ open, onClose, comments, onSend }) {
  const smDown = useResponsive('down', 'sm');

  const { mutate: markAsRead } = useMarkCommentsAsRead();

  useEffect(() => {
    if (!open) return;
    const unreadCommentIds = comments.filter((c) => !c.isAdmin && !c.read).map((c) => c.id);
    if (unreadCommentIds.length > 0) {
      markAsRead({ commentIds: unreadCommentIds });
    }
  }, [open, comments, markAsRead]);

  const handleClose = () => {
    onClose();
  };

  if (smDown) {
    return (
      <Dialog fullScreen open={open} onClose={handleClose} TransitionComponent={Transition}>
        <CommentsScreen comments={comments} onSend={onSend} onClose={onClose} />
      </Dialog>
    );
  }

  return (
    <Dialog fullWidth maxWidth="sm" open={open} onClose={handleClose}>
      <CommentsScreen comments={comments} onSend={onSend} onClose={onClose} />
    </Dialog>
  );
}
