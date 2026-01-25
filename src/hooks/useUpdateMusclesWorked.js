// src/hooks/useUpdateMusclesWorked.js
'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateMuscleWorked } from 'src/services/muscles-worked';

export function useUpdateMusclesWorked() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ mediaId, musclesId }) => updateMuscleWorked(mediaId, musclesId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['muscles-worked'] });
    },
  });
}
