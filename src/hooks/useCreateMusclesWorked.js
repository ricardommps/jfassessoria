'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createMuscleWorked } from 'src/services/muscles-worked';

export function useCreateMusclesWorked() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createMuscleWorked,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['media'] });
      queryClient.invalidateQueries({ queryKey: ['muscles-worked'] });
    },
  });
}
