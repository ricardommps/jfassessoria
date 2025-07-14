import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import * as Yup from 'yup';
export default function ExerciseInfo({ open, onClose, title, id, onSave, exerciseInfoById }) {
  const exerciseInfoSchema = Yup.object().shape({
    reps: Yup.string().required('Campo obrigatório'),
  });

  const defaultValues = useMemo(
    () => ({
      id: id,
      reps: exerciseInfoById?.reps || '',
      reset: exerciseInfoById?.reset || '',
      rir: exerciseInfoById?.rir || '',
      method: exerciseInfoById?.method || '',
      cadence: exerciseInfoById?.cadence || '',
      comments: exerciseInfoById?.comments || '',
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(exerciseInfoSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  const forwardSave = (data) => {
    onSave(data);
    onClose();
  };

  const handleSubmitWithoutPropagation = (e) => {
    e.preventDefault();
    e.stopPropagation();
    handleSubmit(forwardSave)(e);
  };

  return (
    <Dialog sx={{ '& .MuiDialog-paper': { width: '80%' } }} maxWidth="xs" open={open}>
      <DialogTitle>
        <Typography>{title}</Typography>
      </DialogTitle>
      <DialogContent dividers>
        <FormProvider methods={methods} onSubmit={handleSubmitWithoutPropagation}>
          <>
            <Typography sx={{ fontSize: '1em', fontWeight: 'bold', color: '#f7951e' }}>
              Entre com as informações do exercício
            </Typography>
            <>
              <Box rowGap={3} columnGap={2} display="grid" pt={1}>
                <RHFTextField name="method" label="Método" />
                <RHFTextField name="reps" label="Range de repetições" />
                <RHFTextField
                  name="reset"
                  label="Intervalo de recuperação(segundos)"
                  type={'number'}
                />
                <RHFTextField name="rir" label="Repetições de reserva" />
                <RHFTextField name="cadence" label="Cadência/velocidade de movimento" />
                <RHFTextField name="comments" label="Observações" multiline rows={3} />
              </Box>
            </>
          </>
          <Stack direction={'row'} justifyContent={'flex-end'} spacing={3} pt={4}>
            <Button autoFocus onClick={onClose}>
              Cancelar
            </Button>
            <LoadingButton type="submit" variant="contained">
              Salvar
            </LoadingButton>
          </Stack>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
