import { ButtonBase, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';

import Iconify from '../iconify/iconify';

export default function ButtonAction({ title, icon, ...other }) {
  return (
    <ButtonBase {...other}>
      <Stack direction="column" alignItems="center" gap={1}>
        <Iconify icon={icon} width={20} />
        <Typography variant="subtitle2" sx={{ fontSize: '12px', fontWeight: 800 }}>
          {title}
        </Typography>
      </Stack>
    </ButtonBase>
  );
}

ButtonAction.propTypes = {
  title: PropTypes.string,
  icon: PropTypes.string,
};
