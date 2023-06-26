import PropTypes from 'prop-types';

import { Button } from './styles';
export function ButtonBanner({ children, ...other }) {
  return <Button {...other}>{children}</Button>;
}

ButtonBanner.propTypes = {
  children: PropTypes.node,
};
