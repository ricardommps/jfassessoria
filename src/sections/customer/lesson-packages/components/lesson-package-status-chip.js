import PropTypes from 'prop-types';
import Label from 'src/components/label';

import {
  LESSON_PACKAGE_STATUS_COLORS,
  LESSON_PACKAGE_STATUS_LABELS,
} from '../utils/lesson-package-options';

export default function LessonPackageStatusChip({ status }) {
  return (
    <Label variant="soft" color={LESSON_PACKAGE_STATUS_COLORS[status] || 'default'}>
      {LESSON_PACKAGE_STATUS_LABELS[status] || status || '-'}
    </Label>
  );
}

LessonPackageStatusChip.propTypes = {
  status: PropTypes.string,
};
