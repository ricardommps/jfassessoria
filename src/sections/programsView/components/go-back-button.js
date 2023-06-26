import { Button, Typography } from '@mui/material';
import PropTypes from 'prop-types'; // @mui
import Iconify from 'src/components/iconify/iconify';

// ----------------------------------------------------------------------

export default function GoBackButton({ onClick, title }) {
  return (
    <Button
      onClick={onClick}
      startIcon={<Iconify icon="eva:arrow-ios-back-fill" width={25} />}
      sx={{ margin: '15px 24px 0px', paddingLeft: 0, fontSize: '1.125rem' }}
    >
      <Typography variant="h3">{title}</Typography>
    </Button>
  );
}

GoBackButton.propTypes = {
  onClick: PropTypes.func,
  title: PropTypes.string,
};
