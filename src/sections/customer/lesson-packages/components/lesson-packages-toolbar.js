import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import PropTypes from 'prop-types';

import { LESSON_PACKAGE_FILTER_OPTIONS } from '../utils/lesson-package-options';

export default function LessonPackagesToolbar({ currentFilter, onChangeFilter }) {
  return (
    <Stack
      direction="row"
      spacing={1}
      sx={{
        mb: 3,
        overflowX: 'auto',
        pb: 0.5,
        '&::-webkit-scrollbar': {
          display: 'none',
        },
      }}
    >
      {LESSON_PACKAGE_FILTER_OPTIONS.map((option) => {
        const selected = currentFilter === option.value;

        return (
          <Button
            key={option.value}
            variant={selected ? 'contained' : 'outlined'}
            color={selected ? 'primary' : 'inherit'}
            onClick={() => onChangeFilter(option.value)}
            sx={{
              flexShrink: 0,
              borderRadius: 999,
              px: 2.5,
            }}
          >
            {option.label}
          </Button>
        );
      })}
    </Stack>
  );
}

LessonPackagesToolbar.propTypes = {
  currentFilter: PropTypes.string,
  onChangeFilter: PropTypes.func,
};
