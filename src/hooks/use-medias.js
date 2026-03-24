import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { create, getMedias } from 'src/services/media.service';

export function useGetMedias() {
  return useQuery({
    queryKey: ['medias'],
    queryFn: getMedias,
  });
}

export function useCreateMedia() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: create,
    onSuccess: () => {
      // Invalida a query de medias para refetch automático
      queryClient.invalidateQueries({ queryKey: ['medias'] });
    },
  });
}
