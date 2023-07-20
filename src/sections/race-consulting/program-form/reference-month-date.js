import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Controller, useFormContext } from 'react-hook-form';
export default function ReferenceMonthDate({ value }) {
  const { control } = useFormContext();
  return (
    <Controller
      name="referenceMonth"
      control={control}
      render={({ field }) => (
        <DatePicker
          {...field}
          value={new Date(Date.parse(value))}
          format="MMMM-yyyy"
          label="Mês de referência"
          onChange={(newValue) => {
            field.onChange(newValue);
          }}
          views={['month', 'year']}
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
