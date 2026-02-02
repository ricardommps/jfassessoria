'use client';

import { useQuery } from '@tanstack/react-query';
import { getExpiredPrograms } from 'src/services/expired-programs';

export function useExpiredPrograms() {
  return useQuery({
    queryKey: ['expired-programs'],
    queryFn: getExpiredPrograms,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
