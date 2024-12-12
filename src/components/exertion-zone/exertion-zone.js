import { TimelineOppositeContent } from '@mui/lab';
import Timeline from '@mui/lab/Timeline';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
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

export default function ExertionZone({ open, onClose, pv, pace, vla, paceVla, vlan, paceVlan }) {
  const smDown = useResponsive('down', 'sm');
  const Content = () => (
    <>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Zona de esforço </DialogTitle>
      <DialogContent sx={{ width: '350px' }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6} textAlign={'right'}>
            <Box pr={4}>
              <Typography variant="caption">Limiar</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box pl={2}>
              <Typography variant="caption">Zona</Typography>
            </Box>
          </Grid>
          <Grid item xs={3}>
            <Box>
              <Typography variant="caption">Dominio de intensidade</Typography>
            </Box>
          </Grid>
        </Grid>
        <Timeline position="alternate">
          <TimelineItem sx={{ minHeight: '100px' }}>
            <TimelineOppositeContent sx={{ width: '130px' }}></TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="primary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ width: '130px' }}>
              <Stack direction="row" spacing={6}>
                <Typography>Z1</Typography>
                <Typography fontWeight={'bold'}>Leve</Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: '100px' }}>
            <TimelineOppositeContent sx={{ width: '130px' }}>
              <Stack direction="row" spacing={6}>
                <Typography>Z2</Typography>
                <Typography fontWeight={'bold'}>Moderado</Typography>
              </Stack>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="info" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ width: '130px' }}>
              <Stack direction="column">
                <Typography variant="subtitle2">Vla: {vla}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Pace Vla: {paceVla}
                </Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: '100px' }}>
            <TimelineOppositeContent sx={{ width: '130px' }}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Vlan: {vlan}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Pace Vlan: {paceVlan}
                </Typography>
              </Stack>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="secondary" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ width: '130px' }}>
              <Stack direction="row" spacing={6}>
                <Typography>Z3</Typography>
                <Typography fontWeight={'bold'}>Pesado</Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: '100px' }}>
            <TimelineOppositeContent sx={{ width: '130px' }}>
              <Stack direction="row" spacing={6}>
                <Typography>Z4</Typography>
                <Typography fontWeight={'bold'}>Severo</Typography>
              </Stack>
            </TimelineOppositeContent>
            <TimelineSeparator>
              <TimelineDot color="warning" />
              <TimelineConnector />
            </TimelineSeparator>
            <TimelineContent sx={{ width: '130px' }}>
              <Stack direction="column" spacing={1}>
                <Typography variant="subtitle2">Pv: {pv}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  Pace Pv: {pace}
                </Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
          <TimelineItem sx={{ minHeight: '100px' }}>
            <TimelineSeparator>
              <TimelineDot color="error" />
            </TimelineSeparator>
            <TimelineContent sx={{ width: '130px' }}>
              <Stack direction="row" spacing={6}>
                <Typography>Z5</Typography>
                <Typography fontWeight={'bold'}>Extremo</Typography>
              </Stack>
            </TimelineContent>
          </TimelineItem>
        </Timeline>
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
