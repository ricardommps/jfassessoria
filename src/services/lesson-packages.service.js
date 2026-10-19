import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

export function getExpiringLessonPackages() {
  return jfApi.get(`${JF_APP_ENDPOINTS.lessonPackages}/expiring`).then((res) => res.data);
}

export function getCustomerLessonPackages(customerId) {
  return jfApi
    .get(`${JF_APP_ENDPOINTS.lessonPackages}/customer/${customerId}`)
    .then((res) => res.data);
}

export function getLessonPackageClasses(packageId) {
  return jfApi
    .get(`${JF_APP_ENDPOINTS.lessonPackages}/${packageId}/classes`)
    .then((res) => res.data);
}

export function getCustomerPendingLessonPackageClasses(customerId) {
  return jfApi
    .get(`${JF_APP_ENDPOINTS.lessonPackages}/pending-classes`, {
      params: { customerId },
    })
    .then((res) => res.data);
}

export function createLessonPackage(payload) {
  return jfApi.post(JF_APP_ENDPOINTS.lessonPackages, payload).then((res) => res.data);
}

export function updateLessonPackage(packageId, payload) {
  return jfApi
    .patch(`${JF_APP_ENDPOINTS.lessonPackages}/${packageId}`, payload)
    .then((res) => res.data);
}

export function updateLessonPackageStatus(packageId, status) {
  return jfApi
    .patch(`${JF_APP_ENDPOINTS.lessonPackages}/${packageId}/status`, { status })
    .then((res) => res.data);
}

export function finishLessonPackageClass(classId) {
  return jfApi
    .patch(`${JF_APP_ENDPOINTS.lessonPackages}/classes/${classId}/finish`)
    .then((res) => res.data);
}

export function updateLessonPackageClass(classId, payload) {
  return jfApi
    .patch(`${JF_APP_ENDPOINTS.lessonPackages}/classes/${classId}`, payload)
    .then((res) => res.data);
}

export function cancelLessonPackageClass(classId) {
  return jfApi
    .patch(`${JF_APP_ENDPOINTS.lessonPackages}/classes/${classId}/cancel`)
    .then((res) => res.data);
}

export function markLessonPackageClassPending(classId) {
  return jfApi
    .patch(`${JF_APP_ENDPOINTS.lessonPackages}/classes/${classId}/pending`, {})
    .then((res) => res.data);
}

export function deleteLessonPackage(packageId) {
  return jfApi.delete(`${JF_APP_ENDPOINTS.lessonPackages}/${packageId}`).then((res) => res.data);
}
