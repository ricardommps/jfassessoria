// src/hooks/useDeleteMusclesWorked.js
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { deleteMuscleWorked } from 'src/services/muscles-worked';

export function useDeleteMusclesWorked() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMuscleWorked,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['muscles-worked'] });
    },
  });
}
