import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';

export function FeedbackForm({
  isOpen,
  loading,
  onSubmit,
  onCancel,
  onOpen,
  buttonText = 'Dar FeedBack',
}) {
  const methods = useForm({
    defaultValues: {
      feedback: '',
    },
  });

  const { handleSubmit } = methods;

  if (!isOpen) {
    return (
      <Button variant="outlined" onClick={onOpen} fullWidth>
        {buttonText}
      </Button>
    );
  }

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box rowGap={3} columnGap={2} display="grid" pt={2}>
        <RHFTextField
          name="feedback"
          label="Comentários"
          multiline
          rows={6}
          inputRef={(input) => {
            if (input != null) {
              input.focus();
            }
          }}
        />
      </Box>
      <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
        <LoadingButton type="submit" variant="contained" fullWidth loading={loading}>
          Salvar
        </LoadingButton>
        <Button fullWidth variant="outlined" color="warning" onClick={onCancel} disabled={loading}>
          Cancelar
        </Button>
      </Stack>
    </FormProvider>
  );
}
