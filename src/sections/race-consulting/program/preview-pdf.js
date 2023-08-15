import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import { PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import { useUpdateEffect } from 'react-use';
import useProgram from 'src/hooks/use-program';
import { extrapolation } from 'src/utils/extrapolation';

import ProgramPdf from './program-pdf';
export default function PreviewPdf({ open, onClose, programId, notificationPdf }) {
  const { viewPdfStatus, viewPdf, onViewPdf } = useProgram();
  useEffect(() => {
    onViewPdf(programId);
  }, []);

  const [currentExtrapolation, setCurrentExtrapolation] = useState(null);

  const getExtrapolationByPv = () => {
    const resultValue = extrapolation[viewPdf.pv];
    setCurrentExtrapolation(resultValue);
  };

  useUpdateEffect(() => {
    if (viewPdf) {
      getExtrapolationByPv();
    }
  }, [viewPdf]);
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
          {viewPdf && !viewPdfStatus.loading && currentExtrapolation && (
            <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
              <ProgramPdf
                program={viewPdf}
                notificationPdf={notificationPdf}
                currentExtrapolation={currentExtrapolation}
              />
            </PDFViewer>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
