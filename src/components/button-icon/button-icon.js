import PropTypes from 'prop-types';

import { Button } from './styles';
export function ButtonIcon({ children, ...other }) {
  return <Button {...other}>{children}</Button>;
}

ButtonIcon.propTypes = {
  children: PropTypes.node,
};
