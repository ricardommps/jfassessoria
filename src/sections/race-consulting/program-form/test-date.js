import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useFormContext } from 'react-hook-form';
export default function TestDate({ value }) {
  const { control } = useFormContext();
  return (
    <Controller
      name="dateTest"
      control={control}
      render={({ field }) => (
        <DatePicker
          {...field}
          value={new Date(Date.parse(value))}
          format="dd/MM/yyyy"
          label="Data do teste"
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          slotProps={{
            textField: {
              variant: 'standard',
              fullWidth: true,
              error: false,
            },
          }}
        />
      )}
    />
  );
}
