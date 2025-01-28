import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Unstable_Grid2';
import { m } from 'framer-motion';
import { forwardRef } from 'react';
import { useResponsive } from 'src/hooks/use-responsive';

export const StyledDialogActions = styled('div')(() => ({
  justifyContent: 'center',
  margin: '20px 0 0',
  padding: '8px 0',
  display: 'flex',
  flexWrap: 'wrap',
  minHeight: '52px',
  alignItems: 'center',
}));

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function ProgramInfo({ open, onClose, program }) {
  const smDown = useResponsive('down', 'sm');
  const Content = () => (
    <>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}>
        {' '}
        Informações do programa{' '}
      </DialogTitle>
      <DialogContent>
        <>
          <Stack
            component={m.div}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              py: 1,
              px: 1.5,
              borderRadius: 1,
            }}
          >
            {program && (
              <Stack spacing={2}>
                <ListItemText
                  primary={'Nome'}
                  secondary={program.name}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{ component: 'span' }}
                />
                {program.goal && (
                  <ListItemText
                    primary={'Objetivo'}
                    secondary={program.goal || '-'}
                    primaryTypographyProps={{ typography: 'body2' }}
                    secondaryTypographyProps={{ component: 'span' }}
                  />
                )}
                <ListItemText
                  primary={'Informações adicionais'}
                  secondary={program.additionalInformation || '-'}
                  primaryTypographyProps={{ typography: 'body2' }}
                  secondaryTypographyProps={{ component: 'span' }}
                />
                {(!program.type || program.type === 1) && (
                  <Box>
                    <Grid container spacing={2}>
                      <Grid item xs={12} sm={6}>
                        <ListItemText
                          primary="Pico de Velocidade(PV)"
                          secondary={program.pv || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ListItemText
                          primary="FCM"
                          secondary={program.fcmValue || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ListItemText
                          primary="Nível Vla"
                          secondary={program.vlaLevel || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ListItemText
                          primary="Nível Vlan"
                          secondary={program.vlanLevel || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <ListItemText
                          primary="Pace do PV"
                          secondary={program.pace || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ListItemText
                          primary="Vla(km/h)"
                          secondary={program.vla || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ListItemText
                          primary="Pace - Vla"
                          secondary={program.paceVla || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ListItemText
                          primary="Vlan(km/h)"
                          secondary={program.vlan || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <ListItemText
                          primary="Pace - Vlan"
                          secondary={program.paceVlan || '-'}
                          primaryTypographyProps={{ typography: 'body2' }}
                          secondaryTypographyProps={{ component: 'span' }}
                          sx={{ width: ' inherit' }}
                        />
                      </Grid>
                    </Grid>
                  </Box>
                )}
              </Stack>
            )}
          </Stack>
        </>
      </DialogContent>
      <StyledDialogActions>
        <Button
          color="inherit"
          variant="outlined"
          sx={{ mb: 1, minWidth: '45%', marginLeft: '8px' }}
          onClick={onClose}
        >
          Fechar
        </Button>
      </StyledDialogActions>
    </>
  );
  if (smDown) {
    return (
      <Dialog fullScreen open={open} TransitionComponent={Transition}>
        <Content />
      </Dialog>
    );
  }
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <Content />
    </Dialog>
  );
}
