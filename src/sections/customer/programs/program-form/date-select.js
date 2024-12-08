import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useFormContext } from 'react-hook-form';
export default function DateSelect({ value, name, label }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <DatePicker
          {...field}
          value={new Date(Date.parse(value))}
          format="dd/MM/yyyy"
          label={label}
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          slotProps={{
            textField: {
              fullWidth: true,
              error: false,
            },
            actionBar: {
              actions: ['clear'],
            },
          }}
        />
      )}
    />
  );
}
