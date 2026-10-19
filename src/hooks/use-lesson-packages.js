import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  cancelLessonPackageClass,
  createLessonPackage,
  deleteLessonPackage,
  finishLessonPackageClass,
  getCustomerLessonPackages,
  getCustomerPendingLessonPackageClasses,
  getExpiringLessonPackages,
  getLessonPackageClasses,
  markLessonPackageClassPending,
  updateLessonPackage,
  updateLessonPackageClass,
  updateLessonPackageStatus,
} from 'src/services/lesson-packages.service';

export const expiringLessonPackagesQueryKey = ['expiring-lesson-packages'];

export const customerLessonPackagesQueryKey = (customerId) => [
  'customer-lesson-packages',
  String(customerId),
];

export const lessonPackageClassesQueryKey = (packageId) => [
  'customer-lesson-package-classes',
  Number(packageId),
];

export const customerPendingLessonPackageClassesQueryKey = (customerId) => [
  'customer-lesson-package-pending-classes',
  String(customerId),
];

export function useExpiringLessonPackages() {
  return useQuery({
    queryKey: expiringLessonPackagesQueryKey,
    queryFn: getExpiringLessonPackages,
    staleTime: 1000 * 60 * 5,
  });
}

export function useCustomerLessonPackages(customerId) {
  return useQuery({
    queryKey: customerLessonPackagesQueryKey(customerId),
    queryFn: () => getCustomerLessonPackages(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60 * 2,
  });
}

export function useLessonPackageClasses(packageId, enabled = true) {
  return useQuery({
    queryKey: lessonPackageClassesQueryKey(packageId),
    queryFn: () => getLessonPackageClasses(packageId),
    enabled: !!packageId && enabled,
    staleTime: 1000 * 60,
  });
}

export function useCustomerPendingLessonPackageClasses(customerId) {
  return useQuery({
    queryKey: customerPendingLessonPackageClassesQueryKey(customerId),
    queryFn: () => getCustomerPendingLessonPackageClasses(customerId),
    enabled: !!customerId,
    staleTime: 1000 * 60,
  });
}

export function useCreateLessonPackage(customerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createLessonPackage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerLessonPackagesQueryKey(customerId) });
      queryClient.invalidateQueries({ queryKey: expiringLessonPackagesQueryKey });
    },
  });
}

export function useUpdateLessonPackage(customerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packageId, payload }) => updateLessonPackage(packageId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerLessonPackagesQueryKey(customerId) });
      queryClient.invalidateQueries({ queryKey: expiringLessonPackagesQueryKey });
      queryClient.invalidateQueries({
        queryKey: customerPendingLessonPackageClassesQueryKey(customerId),
      });
      queryClient.invalidateQueries({
        queryKey: lessonPackageClassesQueryKey(variables.packageId),
      });
    },
  });
}

export function useUpdateLessonPackageStatus(customerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ packageId, status }) => updateLessonPackageStatus(packageId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: customerLessonPackagesQueryKey(customerId) });
      queryClient.invalidateQueries({ queryKey: expiringLessonPackagesQueryKey });
      queryClient.invalidateQueries({
        queryKey: lessonPackageClassesQueryKey(variables.packageId),
      });
    },
  });
}

export function useDeleteLessonPackage(customerId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteLessonPackage,
    onSuccess: (_, packageId) => {
      queryClient.invalidateQueries({ queryKey: customerLessonPackagesQueryKey(customerId) });
      queryClient.invalidateQueries({ queryKey: expiringLessonPackagesQueryKey });
      queryClient.invalidateQueries({ queryKey: lessonPackageClassesQueryKey(packageId) });
    },
  });
}

export function useFinishLessonPackageClass(customerId, packageId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: finishLessonPackageClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerLessonPackagesQueryKey(customerId) });
      queryClient.invalidateQueries({ queryKey: expiringLessonPackagesQueryKey });
      queryClient.invalidateQueries({ queryKey: lessonPackageClassesQueryKey(packageId) });
    },
  });
}

export function useUpdateLessonPackageClass(customerId, packageId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ classId, payload }) => updateLessonPackageClass(classId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerLessonPackagesQueryKey(customerId) });
      queryClient.invalidateQueries({ queryKey: expiringLessonPackagesQueryKey });
      queryClient.invalidateQueries({ queryKey: lessonPackageClassesQueryKey(packageId) });
    },
  });
}

export function useCancelLessonPackageClass(customerId, packageId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: cancelLessonPackageClass,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerLessonPackagesQueryKey(customerId) });
      queryClient.invalidateQueries({ queryKey: expiringLessonPackagesQueryKey });
      queryClient.invalidateQueries({ queryKey: lessonPackageClassesQueryKey(packageId) });
    },
  });
}

export function useMarkLessonPackageClassPending(customerId, packageId) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: markLessonPackageClassPending,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: customerLessonPackagesQueryKey(customerId) });
      queryClient.invalidateQueries({ queryKey: expiringLessonPackagesQueryKey });
      queryClient.invalidateQueries({ queryKey: lessonPackageClassesQueryKey(packageId) });
    },
  });
}
