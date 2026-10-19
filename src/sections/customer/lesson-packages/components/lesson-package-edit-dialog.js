import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { RHFSelect, RHFTextField } from 'src/components/hook-form';
import {
  useCustomerPendingLessonPackageClasses,
  useUpdateLessonPackage,
} from 'src/hooks/use-lesson-packages';
import { formatCurrency } from 'src/utils/format-number';
import * as Yup from 'yup';

import LessonPackageClassesBuilder from '../forms/lesson-package-classes-builder';
import { LESSON_PACKAGE_STATUS_LABELS } from '../utils/lesson-package-options';

const EditPackageSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .required('Informe o título do pacote.')
    .max(120, 'Use até 120 caracteres.'),
  description: Yup.string().max(1000, 'Use até 1000 caracteres.'),
  warnings: Yup.string().max(1000, 'Use até 1000 caracteres.'),
  lessonUnitPrice: Yup.number()
    .typeError('Informe o valor da aula.')
    .min(0.01, 'O valor da aula deve ser de pelo menos R$ 0,01.')
    .required('Informe o valor da aula.'),
  status: Yup.string()
    .oneOf(Object.keys(LESSON_PACKAGE_STATUS_LABELS), 'Selecione um status válido.')
    .required('Informe o status do pacote.'),
});

function getErrorMessage(error) {
  const apiMessage = error?.response?.data?.message;
  const message = Array.isArray(apiMessage)
    ? apiMessage.filter((item) => typeof item === 'string' && item.trim()).join(' ')
    : typeof apiMessage === 'string' && apiMessage.trim();

  return message || 'Não foi possível editar o pacote. Tente novamente.';
}

export default function LessonPackageEditDialog({ open, onClose, customerId, lessonPackage }) {
  const updatePackage = useUpdateLessonPackage(customerId);
  const [originalClasses] = useState(() =>
    (lessonPackage.classes || []).map((lessonClass) => ({
      ...lessonClass,
      scheduledDate: String(lessonClass.scheduledDate).split('T')[0],
    })),
  );
  const [classes, setClasses] = useState(originalClasses);
  const {
    data: pendingClasses = [],
    isLoading: isLoadingPendingClasses,
    isError: hasPendingClassesError,
  } = useCustomerPendingLessonPackageClasses(customerId);
  const methods = useForm({
    resolver: yupResolver(EditPackageSchema),
    defaultValues: {
      title: lessonPackage.title || '',
      description: lessonPackage.description || '',
      warnings: lessonPackage.warnings || '',
      lessonUnitPrice: Number(lessonPackage.lessonUnitPrice || 0),
      status: lessonPackage.status,
    },
  });
  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;
  const isSaving = isSubmitting || updatePackage.isPending;
  const totalAmount =
    Number(watch('lessonUnitPrice') || 0) *
    classes.filter((lessonClass) => lessonClass.type === 'regular').length;

  const onSubmit = handleSubmit(async (values) => {
    const retainedIds = new Set(
      classes.filter((lessonClass) => lessonClass.id).map((lessonClass) => lessonClass.id),
    );
    const removeClassIds = originalClasses
      .filter((lessonClass) => !retainedIds.has(lessonClass.id))
      .map((lessonClass) => lessonClass.id);
    const addClasses = classes
      .filter((lessonClass) => !lessonClass.id)
      .map((lessonClass) => ({
        scheduledDate: lessonClass.scheduledDate,
        scheduledTime: lessonClass.scheduledTime,
        type: lessonClass.type,
        notes: lessonClass.notes,
      }));

    try {
      await updatePackage.mutateAsync({
        packageId: lessonPackage.id,
        payload: {
          title: values.title,
          description: values.description,
          warnings: values.warnings,
          lessonUnitPrice: Number(values.lessonUnitPrice),
          status: values.status,
          ...(addClasses.length > 0 && { addClasses }),
          ...(removeClassIds.length > 0 && { removeClassIds }),
        },
      });
      enqueueSnackbar('Pacote atualizado com sucesso!', { variant: 'success' });
      onClose();
    } catch (error) {
      enqueueSnackbar(getErrorMessage(error), { variant: 'error' });
    }
  });

  return (
    <FormProvider {...methods}>
      <Dialog
        fullWidth
        maxWidth="lg"
        open={open}
        onClose={isSaving ? undefined : onClose}
        aria-labelledby="edit-lesson-package-title"
        PaperProps={{ component: 'form', onSubmit }}
      >
        <DialogTitle id="edit-lesson-package-title">Editar pacote</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <RHFTextField
              name="title"
              label="Título do pacote"
              disabled={isSaving}
              inputProps={{ maxLength: 120 }}
            />
            <RHFTextField
              name="description"
              label="Descrição"
              multiline
              minRows={2}
              disabled={isSaving}
              inputProps={{ maxLength: 1000 }}
            />
            <RHFTextField
              name="warnings"
              label="Avisos"
              multiline
              minRows={3}
              disabled={isSaving}
              inputProps={{ maxLength: 1000 }}
            />
            <RHFTextField
              name="lessonUnitPrice"
              label="Valor da aula"
              type="number"
              disabled={isSaving}
              inputProps={{ min: 0.01, step: 0.01 }}
            />
            <Typography variant="body2" color="text.secondary">
              Valor total: {formatCurrency(totalAmount)} (apenas aulas regulares).
            </Typography>
            <RHFSelect name="status" label="Status" disabled={isSaving}>
              {Object.entries(LESSON_PACKAGE_STATUS_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </RHFSelect>
            <Alert severity="info">
              Adicione aulas ao cronograma ou exclua aulas programadas. Aulas com outros status são
              preservadas. As alterações serão aplicadas ao salvar o pacote.
            </Alert>
            <LessonPackageClassesBuilder
              classes={classes}
              onChange={setClasses}
              disabled={isSaving}
              showStatus
              pendingClassesCount={pendingClasses.length}
              hasPendingClassesError={hasPendingClassesError}
              isLoadingPendingClasses={isLoadingPendingClasses}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button
            type="button"
            variant="outlined"
            color="inherit"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancelar
          </Button>
          <LoadingButton type="submit" variant="contained" loading={isSaving}>
            Salvar alterações
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
}

LessonPackageEditDialog.propTypes = {
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  lessonPackage: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
};
