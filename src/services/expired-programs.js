import { JF_APP_ENDPOINTS, jfApi } from 'src/utils/axios';

export function getExpiredPrograms() {
  return jfApi.get(`${JF_APP_ENDPOINTS.program}/expired`).then((res) => res.data);
}
