import PropTypes from 'prop-types';
import * as React from 'react';

import { StyledDialogContent } from './styles';

export default function DialogContent({ children }) {
  return <StyledDialogContent>{children}</StyledDialogContent>;
}

DialogContent.propTypes = {
  children: PropTypes.node,
};
