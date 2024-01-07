import { yupResolver } from '@hookform/resolvers/yup';
import LoadingButton from '@mui/lab/LoadingButton';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import { enqueueSnackbar } from 'notistack';
import { useCallback, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import FormProvider from 'src/components/hook-form/form-provider';
import useFeedbackTraining from 'src/hooks/use-feedback-training';
import * as Yup from 'yup';

import PacesForm from './paces-form';
export default function FeedBackForm({
  training,
  finishedTrainingId,
  trainingname,
  handleCloseForm,
}) {
  const { onFeedbackSave, onFeedbackUpdate } = useFeedbackTraining();
  const NewFeedBackFSchema = Yup.object().shape({
    descriptionFeedback: Yup.string().required('Comentários obrigatório'),
  });
  const formatedPace = (paces) => {
    const jsonPace = [];

    for (var pace in paces) {
      var jsonObj = new Object();
      jsonObj.value = paces[pace];
      jsonPace.push(jsonObj);
    }
    return jsonPace;
  };
  const defaultValues = useMemo(
    () => ({
      descriptionFeedback: training?.descriptionfeedback || null,
      paces: formatedPace(training?.paces) || null,
      finishedTrainingId: training?.finishedTrainingId || finishedTrainingId,
    }),
    [],
  );

  const methods = useForm({
    resolver: yupResolver(NewFeedBackFSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  const onSubmit = useCallback(async (data) => {
    try {
      const payload = Object.assign({}, data);
      if (
        trainingname === 'HIIT_CURTO' ||
        trainingname === 'HIITT_LONGO' ||
        trainingname === 'LL2_INTERVALADO' ||
        trainingname === 'COMPETICAO' ||
        trainingname === 'SPRINT' ||
        trainingname === 'HIT_ELEVACAO'
      ) {
        const { paces } = payload;
        if (paces.length) {
          let pacesArray = paces.map(function (obj) {
            return obj.value.replace(',', '.').replace(' ', '');
          });
          pacesArray = pacesArray.filter(function (e) {
            return e;
          });
          payload.paces = pacesArray;
        }
      } else {
        delete payload.paces;
      }
      if (!training.feedbackid) {
        onFeedbackSave(payload);
      } else {
        payload.id = training.feedbackid;
        onFeedbackUpdate(payload);
      }
    } catch (err) {
      enqueueSnackbar(`Erro ao salvar: ${err}`, {
        autoHideDuration: 8000,
        variant: 'error',
      });
    }
  }, []);

  const renderErros = (
    <>
      {errors && (
        <>
          {Object.keys(errors).map((key) => (
            <Alert severity="error" key={key}>
              {errors[key].message}
            </Alert>
          ))}
        </>
      )}
    </>
  );

  const renderPacesForm = (
    <>
      {(trainingname === 'HIIT_CURTO' ||
        trainingname === 'HIITT_LONGO' ||
        trainingname === 'LL2_INTERVALADO' ||
        trainingname === 'COMPETICAO') && <PacesForm />}
    </>
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <>
        <Box rowGap={3} columnGap={2} display="grid" pt={2}>
          <RHFTextField
            name="descriptionFeedback"
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
        {renderPacesForm}
        <Stack pt={2} sx={{ width: '100%' }} spacing={2}>
          {renderErros}
        </Stack>
        <Stack alignItems="flex-end" sx={{ mt: 3 }} spacing={2}>
          <LoadingButton type="submit" variant="contained" loading={isSubmitting} fullWidth>
            Salvar
          </LoadingButton>
          <Button fullWidth variant="outlined" color="warning" onClick={handleCloseForm}>
            Cancelar
          </Button>
        </Stack>
      </>
    </FormProvider>
  );
}
