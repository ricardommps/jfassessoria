import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { PDFDownloadLink, PDFViewer } from '@react-pdf/renderer';
import NProgress from 'nprogress';
import { useEffect } from 'react';
import ProgramPdf from 'src/components/program-pdf/program-pdf';
import useProgram from 'src/hooks/use-program';
import { useResponsive } from 'src/hooks/use-responsive';

export default function PreviewPdf({ open, onClose, programId }) {
  const smDown = useResponsive('down', 'sm');
  const { viewPdfStatus, viewPdf, onViewPdf } = useProgram();
  useEffect(() => {
    if (programId) {
      onViewPdf(programId);
    }
  }, [programId]);
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
            <>
              {smDown ? (
                <Stack spacing={2} alignItems="center" pt={1}>
                  <PDFDownloadLink
                    document={<ProgramPdf program={viewPdf} />}
                    fileName={`${viewPdf.name}.pdf`}
                    style={{ textDecoration: 'none' }}
                    prefetch={false}
                  >
                    {({ loading }) => (
                      <Tooltip title="Download">
                        <Button
                          variant="contained"
                          disabled={loading}
                          onClick={() => {
                            NProgress.done();
                            if (!loading) {
                              setTimeout(onClose, 500); // Pequeno delay para garantir que o download iniciou antes de fechar
                            }
                          }}
                        >
                          {loading ? 'Carregando Pdf...' : 'Baixar PDF com os treinos'}
                        </Button>
                      </Tooltip>
                    )}
                  </PDFDownloadLink>
                </Stack>
              ) : (
                <PDFViewer width="100%" height="100%" style={{ border: 'none' }}>
                  <ProgramPdf program={viewPdf} />
                </PDFViewer>
              )}
            </>
          )}
        </Box>
      </Box>
    </Dialog>
  );
}
