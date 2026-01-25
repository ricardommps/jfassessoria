import {
  Box,
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Stack,
  Typography,
} from '@mui/material';
import IconButton from '@mui/material/IconButton';
import { useEffect, useState } from 'react';
import Iconify from 'src/components/iconify/iconify';
import MusclesScreen from 'src/components/muscles-screen';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCreateMusclesWorked } from 'src/hooks/useCreateMusclesWorked';
import { useDeleteMusclesWorked } from 'src/hooks/useDeleteMusclesWorked';
import { useUpdateMusclesWorked } from 'src/hooks/useUpdateMusclesWorked';
import { muscles } from 'src/utils/muscles';

export default function MusclesWorked({ mediaId, musclesWorked }) {
  const [musclesSelected, setMusclesSelected] = useState([]);

  const showMusclesScreen = useBoolean();

  const createMutation = useCreateMusclesWorked();
  const updateMutation = useUpdateMusclesWorked();
  const deleteMutation = useDeleteMusclesWorked();

  const isEditing = Boolean(musclesWorked?.id);

  const handleCloseMusclesScreen = () => {
    showMusclesScreen.onFalse();
  };

  useEffect(() => {
    if (musclesWorked?.musclesId) {
      setMusclesSelected(musclesWorked.musclesId);
    }
  }, [musclesWorked]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    setMusclesSelected(typeof value === 'string' ? value.split(',').map(Number) : value);
  };

  const handleSave = () => {
    if (isEditing) {
      updateMutation.mutate({
        mediaId,
        musclesId: musclesSelected,
      });
    } else {
      createMutation.mutate({
        mediaId,
        musclesId: musclesSelected,
      });
    }
  };

  const handleDelete = () => {
    deleteMutation.mutate(mediaId);
    setMusclesSelected([]);
  };

  const isPending =
    createMutation.isPending || updateMutation.isPending || deleteMutation.isPending;

  return (
    <Box
      sx={{
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 2,
        p: 2,
      }}
    >
      <Stack spacing={2}>
        <Stack spacing={1.5} direction="row" mt={3}>
          <Typography variant="subtitle1">Musculatura trabalhada</Typography>
          {musclesSelected.length > 0 && (
            <IconButton sx={{ padding: 0 }} onClick={showMusclesScreen.onTrue}>
              <Iconify icon="eva:info-outline" />
            </IconButton>
          )}
        </Stack>

        <FormControl fullWidth>
          <InputLabel id="muscles-label">Músculos</InputLabel>

          <Select
            labelId="muscles-label"
            multiple
            value={musclesSelected}
            onChange={handleChange}
            input={<OutlinedInput label="Músculos" />}
            renderValue={(selected) => {
              const selectedMuscles = muscles
                .filter((m) => selected.includes(m.id))
                .map((m) => m.muscle);

              if (selectedMuscles.length === 0) return '';

              const displayText =
                selectedMuscles.length <= 3
                  ? selectedMuscles.join(', ')
                  : `${selectedMuscles.slice(0, 2).join(', ')} +${
                      selectedMuscles.length - 2
                    } outros`;

              return (
                <Box
                  component="span"
                  sx={{
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayText}
                </Box>
              );
            }}
          >
            {muscles.map((muscle) => (
              <MenuItem key={muscle.id} value={muscle.id}>
                <Checkbox checked={musclesSelected.includes(muscle.id)} />
                <ListItemText primary={muscle.muscle} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Button fullWidth variant="outlined" onClick={handleSave} disabled={isPending}>
          {isPending ? 'Salvando...' : isEditing ? 'Atualizar' : 'Salvar'}
        </Button>

        {isEditing && (
          <Button
            fullWidth
            color="error"
            variant="text"
            onClick={handleDelete}
            disabled={isPending}
          >
            Remover musculatura
          </Button>
        )}
      </Stack>
      {showMusclesScreen.value && (
        <MusclesScreen
          open={showMusclesScreen.value}
          onClose={handleCloseMusclesScreen}
          musclesWorked={musclesSelected}
        />
      )}
    </Box>
  );
}
