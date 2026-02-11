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
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import Iconify from 'src/components/iconify/iconify';
import MusclesScreen from 'src/components/muscles-screen';
import { useBoolean } from 'src/hooks/use-boolean';
import { useCreateMusclesWorked } from 'src/hooks/useCreateMusclesWorked';
import { useDeleteMusclesWorked } from 'src/hooks/useDeleteMusclesWorked';
import { useUpdateMusclesWorked } from 'src/hooks/useUpdateMusclesWorked';
import { muscles } from 'src/utils/muscles';

/**
 * MusclesWorked - Integrado com React Hook Form Context
 *
 * Quando musclesWorked é salvo, atualiza automaticamente o workoutItems[index].medias
 * no formulário para manter os dados sincronizados
 */

export default function MusclesWorked({
  mediaId,
  musclesWorked,
  workoutIndex, // Índice do workoutItem
}) {
  const [musclesSelected, setMusclesSelected] = useState([]);
  const showMusclesScreen = useBoolean();

  // Obtém acesso ao contexto do formulário
  const { setValue, watch } = useFormContext();
  const workoutItems = watch('workoutItems');

  const createMutation = useCreateMusclesWorked();
  const updateMutation = useUpdateMusclesWorked();
  const deleteMutation = useDeleteMusclesWorked();

  const isEditing = Boolean(musclesWorked?.id);

  const handleCloseMusclesScreen = useCallback(() => {
    showMusclesScreen.onFalse();
  }, [showMusclesScreen]);

  // Sync from prop to state
  useEffect(() => {
    if (musclesWorked?.musclesId) {
      setMusclesSelected(musclesWorked.musclesId);
    } else {
      setMusclesSelected([]);
    }
  }, [musclesWorked]);

  const handleChange = useCallback((event) => {
    const {
      target: { value },
    } = event;
    setMusclesSelected(typeof value === 'string' ? value.split(',').map(Number) : value);
  }, []);

  /**
   * Atualiza o objeto media dentro de workoutItems[index].medias
   * com os novos dados de musclesWorked
   */
  const updateMediaInForm = useCallback(
    (musclesWorkedData) => {
      if (workoutIndex === undefined || workoutIndex === null) {
        console.warn('workoutIndex não fornecido para MusclesWorked');
        return;
      }

      const currentWorkoutItem = workoutItems?.[workoutIndex];
      if (!currentWorkoutItem?.medias) return;

      // Atualiza o array de medias encontrando e atualizando o media correto
      const updatedMedias = currentWorkoutItem.medias.map((mediaGroup) => {
        if (!Array.isArray(mediaGroup)) return mediaGroup;

        return mediaGroup.map((media) => {
          if (media.id === mediaId) {
            return {
              ...media,
              musclesWorked: musclesWorkedData,
            };
          }
          return media;
        });
      });

      // Atualiza no formulário
      setValue(`workoutItems[${workoutIndex}].medias`, updatedMedias, {
        shouldValidate: false,
        shouldDirty: true,
      });
    },
    [workoutIndex, workoutItems, mediaId, setValue],
  );

  const handleSave = useCallback(() => {
    const mutationConfig = {
      onSuccess: (data) => {
        updateMediaInForm(data);
      },
      onError: (error) => {
        console.error('❌ Erro ao salvar musclesWorked:', error);
      },
    };

    if (isEditing) {
      updateMutation.mutate(
        {
          mediaId,
          musclesId: musclesSelected,
        },
        mutationConfig,
      );
    } else {
      createMutation.mutate(
        {
          mediaId,
          musclesId: musclesSelected,
        },
        mutationConfig,
      );
    }
  }, [isEditing, mediaId, musclesSelected, createMutation, updateMutation, updateMediaInForm]);

  const handleDelete = useCallback(() => {
    deleteMutation.mutate(mediaId, {
      onSuccess: () => {
        setMusclesSelected([]);

        // Remove musclesWorked do formulário
        updateMediaInForm(null);
      },
      onError: (error) => {
        console.error('❌ Erro ao deletar musclesWorked:', error);
      },
    });
  }, [mediaId, deleteMutation, updateMediaInForm]);

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
