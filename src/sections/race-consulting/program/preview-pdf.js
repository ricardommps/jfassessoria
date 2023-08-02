import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { PDFViewer } from '@react-pdf/renderer';
import { useEffect } from 'react';
import useProgram from 'src/hooks/use-program';

import ProgramPdf from './program-pdf';
export default function PreviewPdf({ open, onClose, programId, notificationPdf }) {
  const { viewPdfStatus, viewPdf, onViewPdf } = useProgram();
  useEffect(() => {
    onViewPdf(programId);
  }, []);
  return (
    <Dialog fullScreen open={open}>
      <Box sx={{ height: 1, display: 'flex', flexDirection: 'column' }}>
        <DialogActions
          sx={{
            p: 1.5,
          }}
        >
          <Button color="inherit" variant="contained" onClick={onClose}>
            Fechar
          </Button>
        </DialogActions>
        <Box sx={{ flexGrow: 1, height: 1, overflow: 'hidden' }}>
          {viewPdfStatus.loading && (
            <Box display="flex" justifyContent="center" alignItems="center">
              <CircularProgress />
              <Typography position="absolute" top={100}>
                Gerando PDF...
              </Typography>
            </Box>
          )}
          {viewPdf && !viewPdfStatus.loading && (
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <ProgramPdf program={viewPdf} notificationPdf={notificationPdf} />
            </PDFViewer>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
