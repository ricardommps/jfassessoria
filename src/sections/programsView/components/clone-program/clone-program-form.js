import LoadingButton from '@mui/lab/LoadingButton';
import { Button } from '@mui/material';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { Controller, useForm } from 'react-hook-form';
import FormProvider from 'src/components/hook-form';
import Scrollbar from 'src/components/scrollbar/scrollbar';
import { useSnackbar } from 'src/components/snackbar';
export default function CloneProgramForm({ customers, handleClose }) {
  const { enqueueSnackbar } = useSnackbar();
  const methods = useForm({
    defaultValues: {
      selected: [],
    },
  });
  const {
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = useCallback(async (data) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      enqueueSnackbar('A lista de Arquivos do Aluno foi atualizada!');
      console.info('DATA', data);
      handleClose();
    } catch (error) {
      console.error(error);
    }
  }, []);

  const getSelected = (selectedItems, item) =>
    selectedItems.includes(item)
      ? selectedItems.filter((value) => value !== item)
      : [...selectedItems, item];

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack
        sx={{
          display: 'flex',
          overflowY: 'hidden',
          position: 'relative',
          flexDirection: 'column',
          maxHeight: 'calc(100% - 64px)',
          alignItems: 'center',
        }}
      >
        <Stack
          pt={4}
          spacing={1}
          sx={{
            p: 0,
            flex: '1 1 auto',
            display: 'block',
            overflowY: 'hidden',
            height: '300px',
            width: '250px',
          }}
        >
          <Scrollbar>
            <Controller
              name="selected"
              control={control}
              render={({ field }) => (
                <>
                  {customers.map((customer) => (
                    <FormControlLabel
                      key={customer.id}
                      label={customer.name}
                      labelPlacement="start"
                      control={
                        <Switch
                          checked={field.value.includes(customer.id)}
                          onChange={() => field.onChange(getSelected(values.selected, customer.id))}
                        />
                      }
                      sx={{ m: 0, width: 1, justifyContent: 'space-between' }}
                    />
                  ))}
                </>
              )}
            />
          </Scrollbar>
        </Stack>
        <Stack
          spacing={3}
          pt={2}
          justifyContent="center"
          sx={{ flex: '0 0 auto', display: 'flex', flexDirection: 'row' }}
        >
          <LoadingButton
            type="submit"
            variant="contained"
            loading={isSubmitting}
            sx={{ ml: 'auto' }}
          >
            Salvar
          </LoadingButton>
          <Button onClick={handleClose}>Cancelar</Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}

CloneProgramForm.propTypes = {
  customers: PropTypes.array,
  handleClose: PropTypes.func,
};

//{"cid":441120,"pid":58878}
