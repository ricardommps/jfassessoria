import { LoadingButton } from '@mui/lab';
import { Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import DialogContent from 'src/components/dialog-custom/dialog-content';
import CustomizedDialogs from 'src/components/dialog-custom/dialog-custom';
import DialogTitle from 'src/components/dialog-custom/dialog-title';

import { StyledDialogActions } from './styles';

export function DialogInfo({ open, handleClose, msg, title }) {
  return (
    <CustomizedDialogs onClose={handleClose} open={open}>
      <DialogTitle>
        <Typography sx={{ fontWeight: 800 }}>{title}</Typography>
      </DialogTitle>
      <DialogContent>{msg}</DialogContent>
      <StyledDialogActions>
        <LoadingButton
          color="info"
          variant="contained"
          sx={{ mb: 1, minWidth: '45%', marginRight: '2%' }}
          onClick={handleClose}
        >
          OK
        </LoadingButton>
        <Button
          color="inherit"
          variant="outlined"
          sx={{ mb: 1, minWidth: '45%', marginLeft: '8px' }}
          onClick={handleClose}
        >
          Cancelar
        </Button>
      </StyledDialogActions>
    </CustomizedDialogs>
  );
}

DialogInfo.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  msg: PropTypes.string,
  title: PropTypes.string,
};
