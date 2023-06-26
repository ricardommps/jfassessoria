import { CardHeader, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

export default function CardTitle({ title, subTitle }) {
  const renderItem = () => {
    return (
      <Stack>
        <Typography variant="h3">{title}</Typography>
        {subTitle && (
          <Typography variant="h6" component="div">
            {subTitle}
          </Typography>
        )}
      </Stack>
    );
  };
  return <CardHeader title={renderItem()} sx={{ mb: 2 }} />;
}

CardTitle.propTypes = {
  title: PropTypes.string,
  subTitle: PropTypes.string,
};
