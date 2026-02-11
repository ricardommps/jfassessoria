import { useQuery } from '@tanstack/react-query';
import { getMedias } from 'src/services/media.service';

export function useGetMedias() {
  return useQuery({
    queryKey: ['medias'],
    queryFn: getMedias,
  });
}
