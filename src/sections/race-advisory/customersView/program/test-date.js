import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useFormContext } from 'react-hook-form';
export default function TestDate() {
  const { control } = useFormContext();
  return (
    <Controller
      name="dateTest"
      control={control}
      render={({ field, fieldState: { error } }) => (
        <DatePicker
          format="dd/MM/yyyy"
          label="Data do teste"
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          slotProps={{
            textField: {
              variant: 'standard',
              fullWidth: true,
              error: !!error,
              helperText: error?.message,
            },
          }}
        />
      )}
    />
  );
}
