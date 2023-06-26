import { CardHeader, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function CardTitle({ title }) {
  return <CardHeader title={<Typography variant="h3">{title}</Typography>} sx={{ mb: 2 }} />;
}

CardTitle.propTypes = {
  title: PropTypes.string,
};
