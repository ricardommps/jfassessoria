import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { RHFTextField } from 'src/components/hook-form';
import Iconify from 'src/components/iconify/iconify';
export default function VideosForm() {
  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'videos',
  });

  const handleAdd = () => {
    append({
      title: '',
      url: '',
    });
  };

  const handleRemove = (index) => {
    remove(index);
  };

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h6" sx={{ color: 'text.disabled', mb: 3 }}>
        Vídeos:
      </Typography>
      <Stack divider={<Divider flexItem sx={{ borderStyle: 'dashed' }} />} spacing={3}>
        {fields.map((item, index) => {
          return (
            <Stack key={item.id} alignItems="flex-end" spacing={1.5}>
              <Stack direction={'column'} spacing={2} sx={{ width: 1 }}>
                <RHFTextField
                  size="small"
                  name={`videos[${index}].title`}
                  label="Title"
                  InputLabelProps={{ shrink: true }}
                />
                <RHFTextField
                  size="small"
                  name={`videos[${index}].url`}
                  label="Url"
                  InputLabelProps={{ shrink: true }}
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
          Adicionar vídeo
        </Button>
      </Stack>
    </Box>
  );
}
