'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createComments, getComments, markCommentsAsRead } from 'src/services/comments.service';

/**
 * Criar comentário
 */
export function useComments(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => createComments(payload),

    onSuccess: (data, variables) => {
      // Invalidar queries se necessário
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      options.onSuccess?.(data, variables);
    },

    onError: (error, variables) => {
      options.onError?.(error, variables);
    },
  });
}

/**
 * Marcar comentários como lidos
 */
export function useMarkCommentsAsRead(options = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => markCommentsAsRead(payload),

    onSuccess: (data, variables) => {
      if (options.invalidateQueries) {
        options.invalidateQueries.forEach((queryKey) => {
          queryClient.invalidateQueries({ queryKey });
        });
      }

      options.onSuccess?.(data, variables);
    },

    onError: (error, variables) => {
      options.onError?.(error, variables);
    },
  });
}

export function useGetComments(finishedId) {
  return useQuery({
    queryKey: ['media-with-muscles-worked', finishedId],
    queryFn: () => getComments(finishedId),
    enabled: !!finishedId,
  });
}
