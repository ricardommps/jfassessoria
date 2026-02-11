'use client';

import { useQuery } from '@tanstack/react-query';
import { getRawAndEntities } from 'src/services/muscles-worked';

export function useGetMediaWithMusclesWorked(mediaId, enabled) {
  return useQuery({
    queryKey: ['media-with-muscles-worked', mediaId],
    queryFn: () => getRawAndEntities(mediaId),
    enabled,
  });
}
