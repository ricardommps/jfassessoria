import PropTypes from 'prop-types';
import * as React from 'react';

import { StyledDialogTitle } from './styles';

export default function DialogTitle({ children }) {
  return <StyledDialogTitle>{children}</StyledDialogTitle>;
}

DialogTitle.propTypes = {
  children: PropTypes.node,
};
