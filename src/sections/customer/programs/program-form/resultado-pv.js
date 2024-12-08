import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { m } from 'framer-motion';
import PropTypes from 'prop-types';
import { paceFormater } from 'src/utils/format-number';

import { StyledDialogActions } from './styles';

export function ResultadoPv({ open, onClose, vla, paceVla, vlan, paceVlan, pace, VO2, fc }) {
  return (
    <Dialog fullWidth maxWidth="xs" open={open} onClose={onClose}>
      <DialogTitle sx={{ p: (theme) => theme.spacing(3, 3, 2, 3) }}> Resultado PV </DialogTitle>
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
            <Stack direction="row" sx={{ textAlign: 'left', justifyContent: 'left', width: '50%' }}>
              <ListItemText
                primary={'Pace: '}
                primaryTypographyProps={{
                  typography: 'subtitle1',
                }}
                sx={{ flex: 'none' }}
              />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                {paceFormater(pace)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0}>
              <ListItemText
                primary={'V02máx: '}
                primaryTypographyProps={{
                  typography: 'subtitle1',
                }}
                sx={{ flex: 'none' }}
              />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                {VO2}
              </Typography>
            </Stack>
          </Stack>
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
            <Stack direction="row" sx={{ textAlign: 'left', justifyContent: 'left', width: '50%' }}>
              <ListItemText
                primary={'Vla: '}
                primaryTypographyProps={{
                  typography: 'subtitle1',
                }}
                sx={{ flex: 'none' }}
              />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                {vla} km/h
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0}>
              <ListItemText
                primary={'Pace - Vla: '}
                primaryTypographyProps={{
                  typography: 'subtitle1',
                }}
                sx={{ flex: 'none' }}
              />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                {paceFormater(paceVla)}
              </Typography>
            </Stack>
          </Stack>
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
            <Stack direction="row" sx={{ textAlign: 'left', justifyContent: 'left', width: '50%' }}>
              <ListItemText
                primary={'Vlan: '}
                primaryTypographyProps={{
                  typography: 'subtitle1',
                }}
                sx={{ flex: 'none' }}
              />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                {vlan} km/h
              </Typography>
            </Stack>
            <Stack direction="row" spacing={0}>
              <ListItemText
                primary={'Pace - Vlan: '}
                primaryTypographyProps={{
                  typography: 'subtitle1',
                }}
                sx={{ flex: 'none' }}
              />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                {paceFormater(paceVlan)}
              </Typography>
            </Stack>
          </Stack>
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
            <Stack direction="row" sx={{ textAlign: 'left', justifyContent: 'left', width: '50%' }}>
              <ListItemText
                primary={'FCM: '}
                primaryTypographyProps={{
                  typography: 'subtitle1',
                }}
                sx={{ flex: 'none' }}
              />
              <Typography variant="subtitle2" sx={{ ml: 1 }}>
                {fc}
              </Typography>
            </Stack>
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
    </Dialog>
  );
}

ResultadoPv.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  vla: PropTypes.string,
  paceVla: PropTypes.string,
  vlan: PropTypes.string,
  paceVlan: PropTypes.string,
  pace: PropTypes.string,
  VO2: PropTypes.string,
  fc: PropTypes.number,
};
