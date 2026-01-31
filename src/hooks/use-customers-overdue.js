'use client';

import { useQuery } from '@tanstack/react-query';
import { getCustomersOverdue } from 'src/services/customers-overdue';

export function useCustomerOverdue() {
  return useQuery({
    queryKey: ['customers-overdue'],
    queryFn: getCustomersOverdue,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
