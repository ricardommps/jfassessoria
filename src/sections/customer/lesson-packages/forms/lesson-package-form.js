import { yupResolver } from '@hookform/resolvers/yup';
import { LoadingButton } from '@mui/lab';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Container from '@mui/material/Container';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { enqueueSnackbar } from 'notistack';
import PropTypes from 'prop-types';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';
import FormProvider, { RHFSelect, RHFTextField } from 'src/components/hook-form';
import {
  useCreateLessonPackage,
  useCustomerPendingLessonPackageClasses,
} from 'src/hooks/use-lesson-packages';
import { useRouter } from 'src/routes/hook';
import { paths } from 'src/routes/paths';
import { formatCurrency } from 'src/utils/format-number';
import * as Yup from 'yup';

import LessonPackageClassesBuilder from './lesson-package-classes-builder';

const PACKAGE_STATUS_OPTIONS = [
  { value: 'active', label: 'Ativo' },
  { value: 'paused', label: 'Pausado' },
  { value: 'finished', label: 'Finalizado' },
];

const LessonPackageSchema = Yup.object().shape({
  title: Yup.string().required('Informe o título do pacote.'),
  description: Yup.string().nullable(),
  warnings: Yup.string().nullable(),
  lessonUnitPrice: Yup.number()
    .typeError('Informe o valor da aula.')
    .moreThan(0, 'O valor da aula precisa ser maior que zero.')
    .required('Informe o valor da aula.'),
  status: Yup.string().required('Informe o status do pacote.'),
});

function calculateSummary(classes, lessonUnitPrice) {
  const totalLessons = classes.length;
  const paidLessons = classes.filter((lessonClass) => lessonClass.type === 'regular').length;
  const totalAmount = paidLessons * Number(lessonUnitPrice || 0);

  return {
    totalLessons,
    paidLessons,
    freeLessons: totalLessons - paidLessons,
    totalAmount,
  };
}

function getCreatePackageErrorMessage(error) {
  const message = error?.response?.data?.message;

  if (Array.isArray(message)) {
    return message.filter(Boolean).join(' ') || 'Não foi possível criar o pacote. Tente novamente.';
  }

  if (typeof message === 'string' && message.trim()) {
    return message;
  }

  return 'Não foi possível criar o pacote. Tente novamente.';
}

export default function LessonPackageForm({ customerId }) {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [classesError, setClassesError] = useState('');
  const createLessonPackage = useCreateLessonPackage(customerId);
  const {
    data: pendingClasses = [],
    isError: hasPendingClassesError,
    isLoading: isLoadingPendingClasses,
  } = useCustomerPendingLessonPackageClasses(customerId);

  const methods = useForm({
    resolver: yupResolver(LessonPackageSchema),
    defaultValues: {
      title: '',
      description: '',
      warnings: '',
      lessonUnitPrice: 0,
      status: 'active',
    },
  });

  const {
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = methods;

  const lessonUnitPrice = watch('lessonUnitPrice');
  const summary = useMemo(
    () => calculateSummary(classes, lessonUnitPrice),
    [classes, lessonUnitPrice],
  );

  const handleClassesChange = (nextClasses) => {
    setClasses(nextClasses);
    setClassesError('');
  };

  const onSubmit = handleSubmit(async (values) => {
    if (!classes.length) {
      setClassesError('Adicione pelo menos uma aula ao pacote.');
      return;
    }

    try {
      await createLessonPackage.mutateAsync({
        customerId: Number(customerId),
        title: values.title,
        description: values.description || undefined,
        warnings: values.warnings || undefined,
        lessonUnitPrice: Number(values.lessonUnitPrice),
        status: values.status,
        classes,
      });

      enqueueSnackbar('Pacote criado com sucesso!', { variant: 'success' });
      router.push(paths.dashboard.customer.lessonPackages(customerId));
    } catch (error) {
      enqueueSnackbar(getCreatePackageErrorMessage(error), { variant: 'error' });
    }
  });

  return (
    <Container maxWidth="lg">
      <CustomBreadcrumbs
        heading="Novo pacote de aulas"
        links={[
          { name: 'Dashboard', href: paths.dashboard.root },
          { name: 'Alunos', href: paths.dashboard.customer.root },
          { name: 'Pacotes de aulas', href: paths.dashboard.customer.lessonPackages(customerId) },
          { name: 'Novo pacote' },
        ]}
        sx={{ mb: { xs: 3, md: 5 } }}
      />

      <FormProvider methods={methods} onSubmit={onSubmit}>
        <Stack spacing={3}>
          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Stack spacing={3}>
              <Stack spacing={0.5}>
                <Typography variant="h6">Dados do pacote</Typography>
                <Typography variant="body2" color="text.secondary">
                  Informe o título, valor da aula e orientações que aparecem no card do pacote.
                </Typography>
              </Stack>

              <Box
                sx={{
                  display: 'grid',
                  gap: 2,
                  gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1fr' },
                }}
              >
                <RHFTextField name="title" label="Título do pacote" />
                <RHFTextField name="lessonUnitPrice" label="Valor da aula" type="number" />
                <RHFSelect name="status" label="Status">
                  {PACKAGE_STATUS_OPTIONS.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </RHFSelect>
              </Box>

              <RHFTextField
                name="description"
                label="Descrição"
                multiline
                minRows={2}
                placeholder="Ex: Personal 3x/semana + permuta semanal"
              />

              <RHFTextField
                name="warnings"
                label="Avisos"
                multiline
                minRows={3}
                placeholder="Ex: Chave Pix, regras de remarcação ou observações do pacote"
              />

              <Alert severity="info">
                O total em R$ considera apenas aulas regulares. Aulas pendentes e de permuta contam
                no total de aulas, mas não entram no valor cobrado.
              </Alert>
            </Stack>
          </Card>

          <LessonPackageClassesBuilder
            classes={classes}
            error={classesError}
            pendingClassesCount={pendingClasses.length}
            hasPendingClassesError={hasPendingClassesError}
            isLoadingPendingClasses={isLoadingPendingClasses}
            onChange={handleClassesChange}
          />

          <Card sx={{ p: { xs: 2, md: 3 } }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              alignItems={{ xs: 'stretch', md: 'center' }}
              justifyContent="space-between"
              spacing={2}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total de aulas
                  </Typography>
                  <Typography variant="h6">{summary.totalLessons}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Aulas cobradas
                  </Typography>
                  <Typography variant="h6">{summary.paidLessons}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Pendentes/Permutas
                  </Typography>
                  <Typography variant="h6">{summary.freeLessons}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Valor total
                  </Typography>
                  <Typography variant="h6">{formatCurrency(summary.totalAmount)}</Typography>
                </Box>
              </Stack>

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={() => router.push(paths.dashboard.customer.lessonPackages(customerId))}
                >
                  Cancelar
                </Button>

                <LoadingButton
                  type="submit"
                  variant="contained"
                  loading={isSubmitting || createLessonPackage.isPending}
                >
                  Criar pacote
                </LoadingButton>
              </Stack>
            </Stack>
          </Card>
        </Stack>
      </FormProvider>
    </Container>
  );
}

LessonPackageForm.propTypes = {
  customerId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};
