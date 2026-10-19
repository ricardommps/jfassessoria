'use client';

import { useParams } from 'src/routes/hook';

import LessonPackageForm from './forms/lesson-package-form';

export default function LessonPackageCreateView() {
  const params = useParams();
  const { id } = params;

  return <LessonPackageForm customerId={id} />;
}
