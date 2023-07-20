import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useFormContext } from 'react-hook-form';
export default function ReferenceMonthDate() {
  const { control } = useFormContext();
  return (
    <Controller
      name="referenceMonth"
      control={control}
      render={({ field }) => (
        <DatePicker
          {...field}
          label="Mês de referência"
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          views={['month', 'year']}
          format="MMMM-yyyy"
          slotProps={{
            textField: {
              variant: 'standard',
              error: false,
            },
          }}
        />
      )}
    />
  );
}
