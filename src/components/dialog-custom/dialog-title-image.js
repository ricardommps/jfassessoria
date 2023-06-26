import PropTypes from 'prop-types';
import * as React from 'react';

import { TitleImage } from './styles';

export default function DialogTitleImage({ children }) {
  return <TitleImage>{children}</TitleImage>;
}

DialogTitleImage.propTypes = {
  children: PropTypes.node,
};
