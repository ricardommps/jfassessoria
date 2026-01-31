import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

export function getCustomersOverdue() {
  return jfApi.get(`${JF_APP_ENDPOINTS.invoice}/customers-overdue`).then((res) => res.data);
}
