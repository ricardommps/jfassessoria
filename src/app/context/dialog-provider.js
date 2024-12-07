import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import { createContext, forwardRef, useContext, useState } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// eslint-disable-next-line @typescript-eslint/no-empty-function
const EMPTY_FUNC = () => {};
const DialogContext = createContext([EMPTY_FUNC, EMPTY_FUNC]);
export const useDialog = () => useContext(DialogContext);

function DialogContainer(props) {
  const { children, open, onKill } = props;
  const smDown = useResponsive('down', 'sm');

  const Content = () => (
    <>
      <Box pb={2} sx={{ overflowX: 'hidden' }}>
        {children}
      </Box>
    </>
  );

  if (smDown) {
    return (
      <Dialog
        fullScreen
        open={open}
        TransitionComponent={Transition}
        TransitionProps={{
          onExited: onKill, // Pass the onKill handler here
        }}
      >
        <Content />
      </Dialog>
    );
  }
  return (
    <Dialog
      fullWidth
      maxWidth="sm"
      open={open}
      TransitionProps={{
        onExited: onKill, // Pass the onKill handler here
      }}
    >
      <Content />
    </Dialog>
  );
}

export default function DialogProvider({ children }) {
  const [dialogs, setDialogs] = useState([]);
  const createDialog = (option) => {
    const dialog = { ...option, open: true };
    setDialogs((dialogs) => [...dialogs, dialog]);
  };
  const closeDialog = () => {
    setDialogs((dialogs) => {
      const latestDialog = dialogs.pop();
      if (!latestDialog) return dialogs;
      if (latestDialog.onClose) latestDialog.onClose();
      return [...dialogs].concat({ ...latestDialog, open: false });
    });
  };

  // Atualizamos o contexto para incluir o título dinâmico
  const contextValue = [createDialog, closeDialog];

  return (
    <DialogContext.Provider value={contextValue}>
      {children}
      {dialogs.map((dialog, i) => {
        const { title, ...dialogParams } = dialog; // Extraímos o título do dialog
        const handleKill = () => {
          if (dialog.onExited) dialog.onExited();
          setDialogs((dialogs) => dialogs.slice(0, dialogs.length - 1));
        };

        return (
          <DialogContainer
            key={i}
            onClose={closeDialog}
            onKill={handleKill}
            {...dialogParams}
            title={title} // Passamos o título para o DialogContainer
          />
        );
      })}
    </DialogContext.Provider>
  );
}
