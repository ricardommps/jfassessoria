import PropTypes from 'prop-types';
import * as React from 'react';

import { StyledDialog } from './styles';

export default function CustomizedDialogs({ open, handleClose, children }) {
  return (
    <StyledDialog onClose={handleClose} aria-labelledby="customized-dialog-title" open={open}>
      {children}
    </StyledDialog>
  );
}

CustomizedDialogs.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  children: PropTypes.node,
};
