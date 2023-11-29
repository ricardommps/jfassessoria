import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/iconify';
export default function PacesForm() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'paces',
  });

  const handleAdd = () => {
    append({
      value: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Paces:
      </Typography>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => {
          return (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack direction={'column'} spacing={2} sx={{ width: 1 }}>
                <RHFTextField
                  size="small"
                  name={`paces[${index}].value`}
                  label="Pace"
                  InputLabelProps={{ shrink: true }}
                  inputRef={(input) => {
                    if (input != null) {
                      input.focus();
                    }
                  }}
                />
              </Stack>
              <Button
                size="small"
                color="error"
                startIcon={<Iconify icon="solar:trash-bin-trash-bold" />}
                onClick={() => handleRemove(index)}
              >
                Remover
              </Button>
            </Stack>
          );
        })}
      </Stack>
      <Divider sx={{ my: 3, borderStyle: 'dashed' }} />
      <Stack
        spacing={3}
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-end', md: 'center' }}
      >
        <Button
          size="small"
          color="primary"
          startIcon={<Iconify icon="mingcute:add-line" />}
          onClick={handleAdd}
          sx={{ flexShrink: 0 }}
        >
          Adicionar Pace
        </Button>
      </Stack>
    </Box>
  );
}
